from datetime import datetime

from fastapi import HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.security import create_access_token, create_refresh_token, decode_token, hash_token, verify_password
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.auth import TokenPair
from app.schemas.user import UserCreateRequest
from app.services.user_service import UserService


class AuthService:
    @staticmethod
    async def register(session: AsyncSession, user_in: UserCreateRequest) -> User:
        return await UserService.create_user(session, user_in)

    @staticmethod
    async def authenticate(session: AsyncSession, email: str, password: str) -> User:
        user = await UserService.get_by_email(session, email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is blocked")

        user.last_login_at = datetime.utcnow()
        user.updated_at = datetime.utcnow()
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    @staticmethod
    async def issue_token_pair(
        session: AsyncSession,
        *,
        user: User,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> TokenPair:
        access_token, access_expires, _ = create_access_token(user.id, role=user.role.value)
        refresh_token, refresh_expires, refresh_jti = create_refresh_token(user.id, role=user.role.value)

        record = RefreshToken(
            user_id=user.id,
            token_jti=refresh_jti,
            token_hash=hash_token(refresh_token),
            expires_at=refresh_expires.replace(tzinfo=None),
            user_agent=user_agent,
            ip_address=ip_address,
        )
        session.add(record)
        await session.commit()

        return TokenPair(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_at=access_expires,
            refresh_expires_at=refresh_expires,
            role=user.role,
        )

    @staticmethod
    async def refresh_tokens(
        session: AsyncSession,
        *,
        refresh_token: str,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> TokenPair:
        try:
            payload = decode_token(refresh_token)
        except ValueError as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        stmt = select(RefreshToken).where(RefreshToken.token_hash == hash_token(refresh_token))
        record = (await session.exec(stmt)).first()
        if not record or record.revoked_at is not None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked")
        if record.expires_at <= datetime.utcnow():
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

        user = await session.get(User, record.user_id)
        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is inactive")

        record.revoked_at = datetime.utcnow()
        session.add(record)
        await session.commit()

        return await AuthService.issue_token_pair(
            session,
            user=user,
            user_agent=user_agent,
            ip_address=ip_address,
        )

    @staticmethod
    async def revoke_refresh_token(session: AsyncSession, refresh_token: str) -> None:
        stmt = select(RefreshToken).where(RefreshToken.token_hash == hash_token(refresh_token))
        record = (await session.exec(stmt)).first()
        if record and record.revoked_at is None:
            record.revoked_at = datetime.utcnow()
            session.add(record)
            await session.commit()

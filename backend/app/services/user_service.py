from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import delete
from sqlmodel import func, or_, select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.security import get_password_hash
from app.models.audit_log import AuditLog
from app.models.incident import Incident
from app.models.notification import Notification
from app.models.refresh_token import RefreshToken
from app.models.user import User, UserRole
from app.schemas.user import UserCreateRequest


class UserService:
    @staticmethod
    async def get_by_email(session: AsyncSession, email: str) -> User | None:
        stmt = select(User).where(func.lower(User.email) == email.lower())
        return (await session.exec(stmt)).first()

    @staticmethod
    async def create_user(session: AsyncSession, user_in: UserCreateRequest, *, is_superuser: bool = False) -> User:
        existing_user = await UserService.get_by_email(session, user_in.email)
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

        user = User(
            email=user_in.email.lower(),
            full_name=user_in.full_name,
            hashed_password=get_password_hash(user_in.password),
            role=user_in.role,
            is_active=user_in.is_active,
            is_superuser=is_superuser,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    @staticmethod
    async def list_users(
        session: AsyncSession,
        *,
        page: int,
        page_size: int,
        search: str | None = None,
    ) -> tuple[list[User], int]:
        filters = []
        if search:
            like_pattern = f"%{search}%"
            filters.append(or_(User.email.ilike(like_pattern), User.full_name.ilike(like_pattern)))

        stmt = select(User)
        count_stmt = select(func.count(User.id))
        for item in filters:
            stmt = stmt.where(item)
            count_stmt = count_stmt.where(item)

        stmt = stmt.order_by(User.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
        users = list((await session.exec(stmt)).all())
        total = int((await session.exec(count_stmt)).one() or 0)
        return users, total

    @staticmethod
    async def get_user_or_404(session: AsyncSession, user_id: int) -> User:
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    @staticmethod
    async def update_role(session: AsyncSession, *, user: User, role: UserRole) -> User:
        user.role = role
        user.updated_at = datetime.utcnow()
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    @staticmethod
    async def set_active_state(session: AsyncSession, *, user: User, is_active: bool) -> User:
        user.is_active = is_active
        user.blocked_at = None if is_active else datetime.utcnow()
        user.updated_at = datetime.utcnow()
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    @staticmethod
    async def delete_user(session: AsyncSession, *, user: User) -> None:
        incident_ids = list(
            (
                await session.exec(
                    select(Incident.id).where(Incident.created_by == user.id)
                )
            ).all()
        )
        if incident_ids:
            await session.exec(delete(Notification).where(Notification.incident_id.in_(incident_ids)))
            await session.exec(delete(Incident).where(Incident.id.in_(incident_ids)))
        await session.exec(delete(Notification).where(Notification.user_id == user.id))
        await session.exec(delete(RefreshToken).where(RefreshToken.user_id == user.id))
        await session.exec(delete(AuditLog).where(AuditLog.actor_user_id == user.id))
        await session.delete(user)
        await session.commit()

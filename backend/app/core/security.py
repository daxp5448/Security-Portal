import hashlib
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Union

import bcrypt

from jose import JWTError, jwt

from app.core.config import settings


def _prehash_password(password: str) -> bytes:
    return hashlib.sha256(password.encode("utf-8")).digest()


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(_prehash_password(password), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(_prehash_password(plain_password), hashed_password.encode("utf-8"))


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _build_token(
    *,
    subject: Union[str, int, Any],
    token_type: str,
    role: Optional[str] = None,
    expires_delta: timedelta,
    jti: Optional[str] = None,
) -> tuple[str, datetime, str]:
    expire = datetime.now(timezone.utc) + expires_delta
    token_id = jti or str(uuid.uuid4())
    payload = {
        "exp": expire,
        "sub": str(subject),
        "type": token_type,
        "jti": token_id,
    }
    if role:
        payload["role"] = role
    encoded = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded, expire, token_id


def create_access_token(subject: Union[str, int, Any], role: Optional[str] = None) -> tuple[str, datetime, str]:
    return _build_token(
        subject=subject,
        token_type="access",
        role=role,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(subject: Union[str, int, Any], role: Optional[str] = None) -> tuple[str, datetime, str]:
    return _build_token(
        subject=subject,
        token_type="refresh",
        role=role,
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )


def decode_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError as exc:
        raise ValueError("Invalid token") from exc

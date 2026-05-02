from datetime import datetime
from typing import Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.utcnow()


class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    actor_user_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    actor_email: Optional[str] = Field(default=None, max_length=255, index=True)
    action: str = Field(max_length=100, index=True)
    entity_type: str = Field(max_length=100, index=True)
    entity_id: Optional[str] = Field(default=None, max_length=100, index=True)
    description: str = Field(max_length=500)
    ip_address: Optional[str] = Field(default=None, max_length=64)
    status: str = Field(default="success", max_length=50, index=True)
    payload: Optional[dict] = Field(default=None, sa_column=Column(JSON, nullable=True))
    created_at: datetime = Field(default_factory=utc_now, index=True)

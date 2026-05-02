from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.utcnow()


class Notification(SQLModel, table=True):
    __tablename__ = "notifications"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    incident_id: Optional[int] = Field(default=None, foreign_key="incidents.id", index=True)
    title: str = Field(max_length=160)
    message: str = Field(max_length=500)
    severity: str = Field(default="info", max_length=50, index=True)
    is_read: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=utc_now, index=True)

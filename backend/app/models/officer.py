from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.utcnow()


class OfficerStatus(str, Enum):
    AVAILABLE = "available"
    ON_DUTY = "on-duty"
    OFF_DUTY = "off-duty"
    BUSY = "busy"


class Officer(SQLModel, table=True):
    __tablename__ = "officers"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    phone: str = Field(max_length=50)
    status: OfficerStatus = Field(default=OfficerStatus.AVAILABLE, index=True)
    location: str = Field(max_length=255)
    incidents_resolved: int = Field(default=0)
    rating: float = Field(default=5.0)
    response_time_mins: int = Field(default=5)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.utcnow()


class IncidentStatus(str, Enum):
    OPEN = "open"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"


class RiskCategory(str, Enum):
    SAFE = "safe"
    MODERATE = "moderate"
    HIGH = "high"


class Incident(SQLModel, table=True):
    __tablename__ = "incidents"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=160, index=True)
    description: str = Field(max_length=4000)
    location_name: str = Field(max_length=255, index=True)
    latitude: float = Field(index=True)
    longitude: float = Field(index=True)
    incident_at: datetime = Field(default_factory=utc_now, index=True)
    status: IncidentStatus = Field(default=IncidentStatus.OPEN, index=True)
    risk_score: float = Field(default=0.0, index=True)
    risk_category: RiskCategory = Field(default=RiskCategory.SAFE, index=True)
    location_crime_rate: float = Field(default=0.0)
    nearby_similar_count: int = Field(default=0)
    image_path: Optional[str] = Field(default=None, max_length=500)
    assigned_to: Optional[int] = Field(default=None, foreign_key="officers.id", index=True)
    dispatch_time: Optional[datetime] = None
    created_by: int = Field(index=True, foreign_key="users.id")
    created_at: datetime = Field(default_factory=utc_now, index=True)
    updated_at: datetime = Field(default_factory=utc_now)

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.utcnow()


class LocationRiskProfile(SQLModel, table=True):
    __tablename__ = "location_risk_profiles"

    id: Optional[int] = Field(default=None, primary_key=True)
    location_name: str = Field(index=True, unique=True, max_length=255)
    latitude: float
    longitude: float
    crime_rate: float = Field(default=0.0, index=True)
    notes: Optional[str] = Field(default=None, max_length=500)
    created_at: datetime = Field(default_factory=utc_now, index=True)
    updated_at: datetime = Field(default_factory=utc_now)

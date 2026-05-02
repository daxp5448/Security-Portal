from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.models.officer import OfficerStatus


class OfficerRead(BaseModel):
    id: int
    name: str
    phone: str
    status: OfficerStatus
    location: str
    incidents_resolved: int
    rating: float
    response_time_mins: int
    user_id: int | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OfficerCreateRequest(BaseModel):
    name: str = Field(max_length=255)
    phone: str = Field(max_length=50)
    location: str = Field(max_length=255)
    status: OfficerStatus = OfficerStatus.AVAILABLE
    user_id: int | None = None


class OfficerStatusUpdateRequest(BaseModel):
    status: OfficerStatus

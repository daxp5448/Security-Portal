from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.incident import IncidentStatus, RiskCategory


class IncidentCreateRequest(BaseModel):
    title: str = Field(min_length=3, max_length=160)
    description: str = Field(min_length=10, max_length=4000)
    location_name: str = Field(min_length=2, max_length=255)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    incident_at: datetime | None = None


class IncidentRead(BaseModel):
    id: int
    title: str
    description: str
    location_name: str
    latitude: float
    longitude: float
    incident_at: datetime
    status: IncidentStatus
    risk_score: float
    risk_category: RiskCategory
    location_crime_rate: float
    nearby_similar_count: int
    image_path: str | None = None
    assigned_to: int | None = None
    dispatch_time: datetime | None = None
    created_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IncidentStatusUpdateRequest(BaseModel):
    status: IncidentStatus


class IncidentAssignRequest(BaseModel):
    officer_id: int


class IncidentImageResponse(BaseModel):
    id: int
    image_path: str


class PaginatedIncidents(BaseModel):
    items: list[IncidentRead]
    total: int
    page: int
    page_size: int


class RiskAssessmentRead(BaseModel):
    risk_score: float
    category: RiskCategory
    location_crime_rate: float
    nearby_similar_count: int


class RiskAssessmentRequest(BaseModel):
    location_name: str = Field(min_length=2, max_length=255)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    incident_at: datetime | None = None

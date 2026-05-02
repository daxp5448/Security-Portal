from pydantic import BaseModel


class IncidentsPerLocationRead(BaseModel):
    location_name: str
    count: int


class IncidentsPerMonthRead(BaseModel):
    month: str
    count: int


class DangerousAreaRead(BaseModel):
    location_name: str
    incident_count: int
    average_risk_score: float


class IncidentTrendRead(BaseModel):
    day: str
    count: int


class IncidentCategoryRead(BaseModel):
    name: str
    value: int


class IncidentResolutionRead(BaseModel):
    name: str
    value: int

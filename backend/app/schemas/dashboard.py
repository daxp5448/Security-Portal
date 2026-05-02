from datetime import datetime

from pydantic import BaseModel


class HighRiskAreaRead(BaseModel):
    location_name: str
    incident_count: int
    average_risk_score: float


class RecentActivityRead(BaseModel):
    id: int
    actor_email: str | None = None
    action: str
    entity_type: str
    entity_id: str | None = None
    description: str
    status: str
    ip_address: str | None = None
    created_at: datetime


class DashboardStatsRead(BaseModel):
    total_users: int
    total_incidents: int
    active_incidents: int
    high_risk_areas: list[HighRiskAreaRead]
    recent_activities: list[RecentActivityRead]
    total_reports: int
    verified_reports: int
    resolved_reports: int

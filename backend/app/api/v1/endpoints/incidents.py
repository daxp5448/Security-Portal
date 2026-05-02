from datetime import datetime

from fastapi import APIRouter, File, Query, Request, UploadFile, status

from app.api.deps import AdminUser, CurrentUser, ModeratorUser, SessionDep, get_client_ip
from app.models.incident import IncidentStatus
from app.schemas.incident import (
    IncidentCreateRequest,
    IncidentImageResponse,
    IncidentRead,
    RiskAssessmentRead,
    RiskAssessmentRequest,
    IncidentStatusUpdateRequest,
    PaginatedIncidents,
)
from app.services.audit_service import AuditService
from app.services.incident_service import IncidentService
from app.services.risk_service import RiskService
from app.services.upload_service import UploadService


router = APIRouter()


@router.post("/risk-assessment", response_model=RiskAssessmentRead)
async def assess_risk(payload: RiskAssessmentRequest, session: SessionDep, current_user: CurrentUser):
    assessment = await RiskService.assess_incident_risk(
        session,
        location_name=payload.location_name,
        incident_at=payload.incident_at or datetime.utcnow(),
        latitude=payload.latitude,
        longitude=payload.longitude,
    )
    return RiskAssessmentRead(
        risk_score=assessment["risk_score"],
        category=assessment["category"],
        location_crime_rate=assessment["location_crime_rate"],
        nearby_similar_count=assessment["nearby_similar_count"],
    )


@router.post("/", response_model=IncidentRead, status_code=status.HTTP_201_CREATED)
async def create_incident(incident: IncidentCreateRequest, session: SessionDep, current_user: CurrentUser, request: Request):
    created = await IncidentService.create_incident(session, incident_in=incident, current_user=current_user)
    await AuditService.log(
        session,
        action="create",
        entity_type="incident",
        entity_id=str(created.id),
        description=f"Incident created: {created.title}",
        actor=current_user,
        ip_address=get_client_ip(request),
        payload={"risk_score": created.risk_score, "location": created.location_name},
    )
    return IncidentRead.model_validate(created)


@router.get("/", response_model=PaginatedIncidents)
async def get_incidents(
    session: SessionDep,
    current_user: CurrentUser,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: IncidentStatus | None = Query(default=None, alias="status"),
    risk_min: float | None = Query(default=None, ge=0, le=100),
    location: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
):
    incidents, total = await IncidentService.list_incidents(
        session,
        page=page,
        page_size=page_size,
        risk_min=risk_min,
        location=location,
        status_filter=status_filter,
        date_from=date_from,
        date_to=date_to,
    )
    return PaginatedIncidents(
        items=[IncidentRead.model_validate(item) for item in incidents],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{incident_id}", response_model=IncidentRead)
async def get_incident(incident_id: int, session: SessionDep, current_user: CurrentUser):
    incident = await IncidentService.get_incident_or_404(session, incident_id)
    return IncidentRead.model_validate(incident)


@router.patch("/{incident_id}/status", response_model=IncidentRead)
async def update_incident_status(
    incident_id: int,
    payload: IncidentStatusUpdateRequest,
    session: SessionDep,
    current_user: ModeratorUser,
    request: Request,
):
    incident = await IncidentService.get_incident_or_404(session, incident_id)
    updated = await IncidentService.update_status(session, incident=incident, status_value=payload.status)
    await AuditService.log(
        session,
        action="update",
        entity_type="incident",
        entity_id=str(updated.id),
        description=f"Incident status updated to {updated.status.value}",
        actor=current_user,
        ip_address=get_client_ip(request),
    )
    return IncidentRead.model_validate(updated)


@router.post("/{incident_id}/image", response_model=IncidentImageResponse)
async def upload_incident_image(
    incident_id: int,
    session: SessionDep,
    current_user: ModeratorUser,
    request: Request,
    file: UploadFile = File(...),
):
    incident = await IncidentService.get_incident_or_404(session, incident_id)
    image_path = await UploadService.save_incident_image(file, incident_id)
    updated = await IncidentService.attach_image(session, incident=incident, image_path=image_path)
    await AuditService.log(
        session,
        action="update",
        entity_type="incident_image",
        entity_id=str(updated.id),
        description="Incident image uploaded",
        actor=current_user,
        ip_address=get_client_ip(request),
    )
    return IncidentImageResponse(id=updated.id, image_path=updated.image_path or "")


@router.delete("/{incident_id}")
async def delete_incident(incident_id: int, session: SessionDep, current_user: AdminUser, request: Request):
    incident = await IncidentService.get_incident_or_404(session, incident_id)
    title = incident.title
    await IncidentService.delete_incident(session, incident=incident)
    await AuditService.log(
        session,
        action="delete",
        entity_type="incident",
        entity_id=str(incident_id),
        description=f"Incident deleted: {title}",
        actor=current_user,
        ip_address=get_client_ip(request),
    )
    return {"message": "Incident deleted"}

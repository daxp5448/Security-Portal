from fastapi import APIRouter, Query, Request, status
from fastapi import HTTPException
from sqlmodel import select

from app.api.deps import AdminUser, SessionDep, get_client_ip
from app.models.audit_log import AuditLog
from app.models.notification import Notification
from app.schemas.analytics import DangerousAreaRead, IncidentsPerLocationRead, IncidentsPerMonthRead
from app.schemas.dashboard import DashboardStatsRead
from app.schemas.log import AuditLogRead
from app.schemas.notification import NotificationRead
from app.schemas.user import PaginatedUsers, UserBlockUpdateRequest, UserCreateRequest, UserRead, UserRoleUpdateRequest
from app.schemas.analytics import IncidentTrendRead, IncidentCategoryRead, IncidentResolutionRead
from app.schemas.officer import OfficerRead, OfficerCreateRequest, OfficerStatusUpdateRequest
from app.schemas.incident import IncidentAssignRequest
from app.services.analytics_service import AnalyticsService
from app.services.audit_service import AuditService
from app.services.dashboard_service import DashboardService
from app.services.user_service import UserService
from app.services.officer_service import OfficerService
from app.services.incident_service import IncidentService
from sqlalchemy import text


router = APIRouter()


@router.get("/stats", response_model=DashboardStatsRead)
async def get_admin_stats(session: SessionDep, current_admin: AdminUser):
    return await DashboardService.get_dashboard_stats(session)


@router.get("/stats/map")
async def get_map_stats(session: SessionDep, current_admin: AdminUser):
    rows = await AnalyticsService.dangerous_areas(session)
    return [{"_id": row.location_name, "count": row.incident_count} for row in rows]


@router.get("/users")
async def get_users(
    session: SessionDep,
    current_admin: AdminUser,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = None,
):
    users, total = await UserService.list_users(session, page=page, page_size=page_size, search=search)
    payload = PaginatedUsers(
        items=[UserRead.model_validate(user) for user in users],
        total=total,
        page=page,
        page_size=page_size,
    )
    if page == 1 and page_size >= total and not search:
        return [item.model_dump() for item in payload.items]
    return payload


@router.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreateRequest, session: SessionDep, current_admin: AdminUser, request: Request):
    user = await UserService.create_user(session, user_in)
    await AuditService.log(
        session,
        action="create",
        entity_type="user",
        entity_id=str(user.id),
        description=f"Created user account for {user.email}",
        actor=current_admin,
        ip_address=get_client_ip(request),
    )
    return UserRead.model_validate(user)


@router.patch("/users/{user_id}/role", response_model=UserRead)
async def update_user_role(
    user_id: int,
    payload: UserRoleUpdateRequest,
    session: SessionDep,
    current_admin: AdminUser,
    request: Request,
):
    user = await UserService.get_user_or_404(session, user_id)
    updated = await UserService.update_role(session, user=user, role=payload.role)
    await AuditService.log(
        session,
        action="update",
        entity_type="user_role",
        entity_id=str(user_id),
        description=f"Changed role for {updated.email} to {updated.role.value}",
        actor=current_admin,
        ip_address=get_client_ip(request),
    )
    return UserRead.model_validate(updated)


@router.patch("/users/{user_id}/block", response_model=UserRead)
async def toggle_user_block(
    user_id: int,
    payload: UserBlockUpdateRequest,
    session: SessionDep,
    current_admin: AdminUser,
    request: Request,
):
    user = await UserService.get_user_or_404(session, user_id)
    updated = await UserService.set_active_state(session, user=user, is_active=payload.is_active)
    action_label = "unblocked" if payload.is_active else "blocked"
    await AuditService.log(
        session,
        action="update",
        entity_type="user_status",
        entity_id=str(user_id),
        description=f"{updated.email} was {action_label}",
        actor=current_admin,
        ip_address=get_client_ip(request),
    )
    return UserRead.model_validate(updated)


@router.delete("/users/{user_id}")
async def delete_user(user_id: int, session: SessionDep, current_admin: AdminUser, request: Request):
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    user = await UserService.get_user_or_404(session, user_id)
    email = user.email
    await UserService.delete_user(session, user=user)
    await AuditService.log(
        session,
        action="delete",
        entity_type="user",
        entity_id=str(user_id),
        description=f"Deleted user {email}",
        actor=current_admin,
        ip_address=get_client_ip(request),
    )
    return {"message": "User deleted"}


from app.schemas.user_detail import UserDetailRead
from app.models.incident import Incident
from app.models.audit_log import AuditLog

@router.get("/users/{user_id}", response_model=UserDetailRead)
async def get_user_detail(user_id: int, session: SessionDep, current_admin: AdminUser):
    user = await UserService.get_user_or_404(session, user_id)
    
    logs_stmt = select(AuditLog).where(AuditLog.actor_user_id == user_id).order_by(AuditLog.created_at.desc()).limit(10)
    logs = (await session.exec(logs_stmt)).all()
    
    incidents_stmt = select(Incident).where(Incident.created_by == user_id).order_by(Incident.created_at.desc()).limit(10)
    incidents = (await session.exec(incidents_stmt)).all()
    
    return UserDetailRead(
        user=user,
        recent_logs=logs,
        reported_incidents=incidents
    )


@router.get("/analytics/incidents-per-location", response_model=list[IncidentsPerLocationRead])
async def incidents_per_location(session: SessionDep, current_admin: AdminUser):
    return await AnalyticsService.incidents_per_location(session)


@router.get("/analytics/incidents-per-month", response_model=list[IncidentsPerMonthRead])
async def incidents_per_month(session: SessionDep, current_admin: AdminUser):
    return await AnalyticsService.incidents_per_month(session)


@router.get("/analytics/dangerous-areas", response_model=list[DangerousAreaRead])
async def dangerous_areas(session: SessionDep, current_admin: AdminUser):
    return await AnalyticsService.dangerous_areas(session)


@router.get("/audit-logs", response_model=list[AuditLogRead])
async def get_audit_logs(session: SessionDep, current_admin: AdminUser, limit: int = Query(50, ge=1, le=200)):
    stmt = select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)
    return [AuditLogRead.model_validate(item) for item in (await session.exec(stmt)).all()]


@router.get("/notifications", response_model=list[NotificationRead])
async def get_notifications(session: SessionDep, current_admin: AdminUser, limit: int = Query(50, ge=1, le=200)):
    stmt = select(Notification).order_by(Notification.created_at.desc()).limit(limit)
    return [NotificationRead.model_validate(item) for item in (await session.exec(stmt)).all()]


@router.get("/analytics/trends", response_model=list[IncidentTrendRead])
async def analytics_trends(session: SessionDep, current_admin: AdminUser):
    return await AnalyticsService.get_incident_trend(session)


@router.get("/analytics/categories", response_model=list[IncidentCategoryRead])
async def analytics_categories(session: SessionDep, current_admin: AdminUser):
    return await AnalyticsService.get_incident_category(session)


@router.get("/analytics/resolution", response_model=list[IncidentResolutionRead])
async def analytics_resolution(session: SessionDep, current_admin: AdminUser):
    return await AnalyticsService.get_incident_resolution(session)


@router.get("/officers", response_model=list[OfficerRead])
async def get_officers(session: SessionDep, current_admin: AdminUser):
    return await OfficerService.list_officers(session)


@router.post("/officers", response_model=OfficerRead, status_code=status.HTTP_201_CREATED)
async def create_officer(payload: OfficerCreateRequest, session: SessionDep, current_admin: AdminUser):
    return await OfficerService.create_officer(session, payload)


@router.patch("/officers/{officer_id}/status", response_model=OfficerRead)
async def update_officer_status(officer_id: int, payload: OfficerStatusUpdateRequest, session: SessionDep, current_admin: AdminUser):
    officer = await OfficerService.get_officer_or_404(session, officer_id)
    return await OfficerService.update_status(session, officer, payload.status)


@router.patch("/incidents/{incident_id}/assign")
async def assign_incident(incident_id: int, payload: IncidentAssignRequest, session: SessionDep, current_admin: AdminUser):
    incident = await IncidentService.get_incident_or_404(session, incident_id)
    updated = await IncidentService.assign_officer(session, incident=incident, officer_id=payload.officer_id)
    return updated


@router.get("/system/status")
async def get_system_status(session: SessionDep, current_admin: AdminUser):
    try:
        await session.exec(text("SELECT 1"))
        db_status = "operational"
    except Exception:
        db_status = "degraded"
        
    return {
        "api": "operational",
        "database": db_status,
        "websocket": "operational",
        "redis": "degraded"
    }

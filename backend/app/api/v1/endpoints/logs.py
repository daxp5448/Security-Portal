from fastapi import APIRouter, Query, Request, status
from sqlmodel import select

from app.api.deps import ModeratorUser, SessionDep, get_client_ip
from app.models.audit_log import AuditLog
from app.models.logs import LogCreate
from app.schemas.log import AuditLogRead
from app.services.audit_service import AuditService


router = APIRouter()


@router.get("/", response_model=list[AuditLogRead])
async def list_logs(session: SessionDep, current_user: ModeratorUser, limit: int = Query(50, ge=1, le=200)):
    stmt = select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)
    return [AuditLogRead.model_validate(item) for item in (await session.exec(stmt)).all()]


@router.post("/", response_model=AuditLogRead, status_code=status.HTTP_201_CREATED)
async def create_log(log: LogCreate, session: SessionDep, current_user: ModeratorUser, request: Request):
    created = await AuditService.log(
        session,
        action=log.action,
        entity_type=log.entity_type,
        entity_id=log.entity_id,
        description=log.description,
        actor=current_user,
        ip_address=get_client_ip(request),
        status=log.status,
        payload=log.payload,
    )
    return AuditLogRead.model_validate(created)

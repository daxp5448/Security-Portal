from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import delete
from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings
from app.models.incident import Incident, IncidentStatus
from app.models.notification import Notification
from app.models.user import User
from app.schemas.incident import IncidentCreateRequest
from app.services.notification_service import NotificationService
from app.services.risk_service import RiskService


class IncidentService:
    @staticmethod
    async def create_incident(
        session: AsyncSession,
        *,
        incident_in: IncidentCreateRequest,
        current_user: User,
    ) -> Incident:
        incident_at = incident_in.incident_at or datetime.utcnow()
        risk = await RiskService.assess_incident_risk(
            session,
            location_name=incident_in.location_name,
            incident_at=incident_at,
            latitude=incident_in.latitude,
            longitude=incident_in.longitude,
        )
        incident = Incident(
            title=incident_in.title,
            description=incident_in.description,
            location_name=incident_in.location_name,
            latitude=incident_in.latitude,
            longitude=incident_in.longitude,
            incident_at=incident_at,
            risk_score=risk["risk_score"],
            risk_category=risk["category"],
            location_crime_rate=risk["location_crime_rate"],
            nearby_similar_count=risk["nearby_similar_count"],
            created_by=current_user.id,
        )
        session.add(incident)
        await session.commit()
        await session.refresh(incident)

        if incident.risk_score >= settings.INCIDENT_HIGH_RISK_THRESHOLD:
            await NotificationService.create_high_risk_notification(session, incident)

        return incident

    @staticmethod
    async def get_incident_or_404(session: AsyncSession, incident_id: int) -> Incident:
        incident = await session.get(Incident, incident_id)
        if not incident:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")
        return incident

    @staticmethod
    async def list_incidents(
        session: AsyncSession,
        *,
        page: int,
        page_size: int,
        risk_min: float | None = None,
        location: str | None = None,
        status_filter: IncidentStatus | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> tuple[list[Incident], int]:
        stmt = select(Incident)
        count_stmt = select(func.count(Incident.id))

        filters = []
        if risk_min is not None:
            filters.append(Incident.risk_score >= risk_min)
        if location:
            filters.append(Incident.location_name.ilike(f"%{location}%"))
        if status_filter:
            filters.append(Incident.status == status_filter)
        if date_from:
            filters.append(Incident.incident_at >= date_from)
        if date_to:
            filters.append(Incident.incident_at <= date_to)

        for item in filters:
            stmt = stmt.where(item)
            count_stmt = count_stmt.where(item)

        stmt = stmt.order_by(Incident.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
        incidents = list((await session.exec(stmt)).all())
        total = int((await session.exec(count_stmt)).one() or 0)
        return incidents, total

    @staticmethod
    async def update_status(
        session: AsyncSession,
        *,
        incident: Incident,
        status_value: IncidentStatus,
    ) -> Incident:
        incident.status = status_value
        incident.updated_at = datetime.utcnow()
        session.add(incident)
        await session.commit()
        await session.refresh(incident)
        return incident

    @staticmethod
    async def assign_officer(
        session: AsyncSession,
        *,
        incident: Incident,
        officer_id: int,
    ) -> Incident:
        incident.assigned_to = officer_id
        incident.dispatch_time = datetime.utcnow()
        incident.updated_at = datetime.utcnow()
        session.add(incident)
        await session.commit()
        await session.refresh(incident)
        return incident

    @staticmethod
    async def attach_image(session: AsyncSession, *, incident: Incident, image_path: str) -> Incident:
        incident.image_path = image_path
        incident.updated_at = datetime.utcnow()
        session.add(incident)
        await session.commit()
        await session.refresh(incident)
        return incident

    @staticmethod
    async def delete_incident(session: AsyncSession, *, incident: Incident) -> None:
        await session.exec(delete(Notification).where(Notification.incident_id == incident.id))
        await session.delete(incident)
        await session.commit()

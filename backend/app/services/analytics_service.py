from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.incident import Incident
from app.schemas.analytics import DangerousAreaRead, IncidentsPerLocationRead, IncidentsPerMonthRead, IncidentTrendRead, IncidentCategoryRead, IncidentResolutionRead


class AnalyticsService:
    @staticmethod
    async def incidents_per_location(session: AsyncSession) -> list[IncidentsPerLocationRead]:
        stmt = (
            select(Incident.location_name, func.count(Incident.id))
            .group_by(Incident.location_name)
            .order_by(func.count(Incident.id).desc())
        )
        rows = (await session.exec(stmt)).all()
        return [IncidentsPerLocationRead(location_name=row[0], count=int(row[1])) for row in rows]

    @staticmethod
    async def incidents_per_month(session: AsyncSession) -> list[IncidentsPerMonthRead]:
        month_bucket = func.to_char(Incident.incident_at, "YYYY-MM")
        stmt = select(month_bucket, func.count(Incident.id)).group_by(month_bucket).order_by(month_bucket)
        rows = (await session.exec(stmt)).all()
        return [IncidentsPerMonthRead(month=row[0], count=int(row[1])) for row in rows]

    @staticmethod
    async def dangerous_areas(session: AsyncSession) -> list[DangerousAreaRead]:
        stmt = (
            select(Incident.location_name, func.count(Incident.id), func.avg(Incident.risk_score))
            .group_by(Incident.location_name)
            .order_by(func.avg(Incident.risk_score).desc(), func.count(Incident.id).desc())
            .limit(10)
        )
        rows = (await session.exec(stmt)).all()
        return [
            DangerousAreaRead(
                location_name=row[0],
                incident_count=int(row[1]),
                average_risk_score=round(float(row[2] or 0), 2),
            )
            for row in rows
        ]

    @staticmethod
    async def get_incident_trend(session: AsyncSession) -> list[IncidentTrendRead]:
        day_bucket = func.to_char(Incident.incident_at, "Day")
        stmt = select(day_bucket, func.count(Incident.id)).group_by(day_bucket, func.date(Incident.incident_at)).order_by(func.date(Incident.incident_at)).limit(7)
        rows = (await session.exec(stmt)).all()
        return [IncidentTrendRead(day=row[0].strip(), count=int(row[1])) for row in rows]

    @staticmethod
    async def get_incident_category(session: AsyncSession) -> list[IncidentCategoryRead]:
        # Using string matching or simple groupings on title just for demonstration
        stmt = select(Incident.risk_category, func.count(Incident.id)).group_by(Incident.risk_category)
        rows = (await session.exec(stmt)).all()
        return [IncidentCategoryRead(name=row[0].name.capitalize(), value=int(row[1])) for row in rows]

    @staticmethod
    async def get_incident_resolution(session: AsyncSession) -> list[IncidentResolutionRead]:
        stmt = select(Incident.status, func.count(Incident.id)).group_by(Incident.status)
        rows = (await session.exec(stmt)).all()
        return [IncidentResolutionRead(name=row[0].name.capitalize(), value=int(row[1])) for row in rows]

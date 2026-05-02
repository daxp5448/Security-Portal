from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.audit_log import AuditLog
from app.models.incident import Incident, IncidentStatus
from app.models.user import User
from app.schemas.dashboard import DashboardStatsRead, HighRiskAreaRead, RecentActivityRead


class DashboardService:
    @staticmethod
    async def get_dashboard_stats(session: AsyncSession) -> DashboardStatsRead:
        total_users = int((await session.exec(select(func.count(User.id)))).one() or 0)
        total_incidents = int((await session.exec(select(func.count(Incident.id)))).one() or 0)
        active_incidents = int(
            (await session.exec(select(func.count(Incident.id)).where(Incident.status != IncidentStatus.RESOLVED))).one() or 0
        )

        high_risk_stmt = (
            select(Incident.location_name, func.count(Incident.id), func.avg(Incident.risk_score))
            .where(Incident.risk_score >= 70)
            .group_by(Incident.location_name)
            .order_by(func.avg(Incident.risk_score).desc(), func.count(Incident.id).desc())
            .limit(5)
        )
        high_risk_rows = (await session.exec(high_risk_stmt)).all()
        high_risk_areas = [
            HighRiskAreaRead(
                location_name=row[0],
                incident_count=int(row[1]),
                average_risk_score=round(float(row[2] or 0), 2),
            )
            for row in high_risk_rows
        ]

        recent_stmt = select(AuditLog).order_by(AuditLog.created_at.desc()).limit(10)
        recent_logs = (await session.exec(recent_stmt)).all()
        recent_activities = [
            RecentActivityRead(
                id=log.id,
                actor_email=log.actor_email,
                action=log.action,
                entity_type=log.entity_type,
                entity_id=log.entity_id,
                description=log.description,
                status=log.status,
                ip_address=log.ip_address,
                created_at=log.created_at
            )
            for log in recent_logs
        ]

        resolved_reports = int(
            (await session.exec(select(func.count(Incident.id)).where(Incident.status == IncidentStatus.RESOLVED))).one() or 0
        )
        investigating_reports = int(
            (await session.exec(select(func.count(Incident.id)).where(Incident.status == IncidentStatus.INVESTIGATING))).one() or 0
        )

        return DashboardStatsRead(
            total_users=total_users,
            total_incidents=total_incidents,
            active_incidents=active_incidents,
            high_risk_areas=high_risk_areas,
            recent_activities=recent_activities,
            total_reports=total_incidents,
            verified_reports=investigating_reports,
            resolved_reports=resolved_reports,
        )

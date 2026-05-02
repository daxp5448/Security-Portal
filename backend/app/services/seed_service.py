from datetime import datetime, timedelta

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.security import get_password_hash
from app.models.audit_log import AuditLog
from app.models.incident import Incident, IncidentStatus, RiskCategory
from app.models.location_risk import LocationRiskProfile
from app.models.user import User, UserRole


class SeedService:
    @staticmethod
    async def seed(session: AsyncSession) -> None:
        existing_user = (await session.exec(select(User))).first()
        if existing_user:
            return

        now = datetime.utcnow()
        users = [
            User(
                email="admin@sentinel.local",
                full_name="System Admin",
                hashed_password=get_password_hash("Admin@12345"),
                role=UserRole.ADMIN,
                is_superuser=True,
                last_login_at=now,
            ),
            User(
                email="moderator@sentinel.local",
                full_name="Ops Moderator",
                hashed_password=get_password_hash("Moderator@123"),
                role=UserRole.MODERATOR,
            ),
            User(
                email="user@sentinel.local",
                full_name="Field Reporter",
                hashed_password=get_password_hash("User@12345"),
                role=UserRole.USER,
            ),
        ]
        session.add_all(users)
        await session.commit()
        for user in users:
            await session.refresh(user)

        session.add_all(
            [
                LocationRiskProfile(location_name="Downtown", latitude=28.6139, longitude=77.2090, crime_rate=78),
                LocationRiskProfile(location_name="North Sector", latitude=28.7041, longitude=77.1025, crime_rate=61),
                LocationRiskProfile(location_name="Riverfront", latitude=19.0760, longitude=72.8777, crime_rate=48),
                LocationRiskProfile(location_name="Tech Park", latitude=12.9716, longitude=77.5946, crime_rate=32),
            ]
        )
        await session.commit()

        incidents = [
            Incident(
                title="Suspicious group gathering",
                description="Multiple reports of a group attempting vehicle checks late at night.",
                location_name="Downtown",
                latitude=28.6139,
                longitude=77.2090,
                incident_at=now - timedelta(hours=3),
                status=IncidentStatus.OPEN,
                risk_score=84.0,
                risk_category=RiskCategory.HIGH,
                location_crime_rate=78,
                nearby_similar_count=3,
                created_by=users[2].id,
            ),
            Incident(
                title="Streetlight outage",
                description="Dark segment near metro exit raising safety concerns.",
                location_name="North Sector",
                latitude=28.7041,
                longitude=77.1025,
                incident_at=now - timedelta(days=1),
                status=IncidentStatus.INVESTIGATING,
                risk_score=62.0,
                risk_category=RiskCategory.MODERATE,
                location_crime_rate=61,
                nearby_similar_count=1,
                created_by=users[1].id,
            ),
            Incident(
                title="Resolved pickpocket alert",
                description="Patrol unit responded and cleared the scene.",
                location_name="Riverfront",
                latitude=19.0760,
                longitude=72.8777,
                incident_at=now - timedelta(days=8),
                status=IncidentStatus.RESOLVED,
                risk_score=38.0,
                risk_category=RiskCategory.SAFE,
                location_crime_rate=48,
                nearby_similar_count=0,
                created_by=users[0].id,
            ),
        ]
        session.add_all(incidents)
        await session.commit()
        for incident in incidents:
            await session.refresh(incident)

        session.add_all(
            [
                AuditLog(
                    actor_user_id=users[0].id,
                    actor_email=users[0].email,
                    action="login",
                    entity_type="auth",
                    description="Admin logged into the control center",
                    status="success",
                ),
                AuditLog(
                    actor_user_id=users[1].id,
                    actor_email=users[1].email,
                    action="update",
                    entity_type="incident",
                    entity_id=str(incidents[1].id),
                    description="Moderator changed incident state to investigating",
                    status="success",
                ),
                AuditLog(
                    actor_user_id=users[0].id,
                    actor_email=users[0].email,
                    action="delete",
                    entity_type="incident",
                    entity_id="999",
                    description="Removed spam incident report",
                    status="success",
                ),
            ]
        )
        await session.commit()

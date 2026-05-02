from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.incident import Incident
from app.models.notification import Notification


class NotificationService:
    @staticmethod
    async def create_high_risk_notification(session: AsyncSession, incident: Incident) -> Notification:
        notification = Notification(
            incident_id=incident.id,
            title="High-risk incident detected",
            message=f"{incident.title} in {incident.location_name} requires immediate attention.",
            severity="high",
        )
        session.add(notification)
        await session.commit()
        await session.refresh(notification)
        return notification

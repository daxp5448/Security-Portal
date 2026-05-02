from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.audit_log import AuditLog
from app.models.user import User


class AuditService:
    @staticmethod
    async def log(
        session: AsyncSession,
        *,
        action: str,
        entity_type: str,
        description: str,
        actor: User | None = None,
        entity_id: str | None = None,
        ip_address: str | None = None,
        status: str = "success",
        payload: dict | None = None,
        commit: bool = True,
    ) -> AuditLog:
        entry = AuditLog(
            actor_user_id=actor.id if actor else None,
            actor_email=actor.email if actor else None,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            description=description,
            ip_address=ip_address,
            status=status,
            payload=payload,
        )
        session.add(entry)
        if commit:
            await session.commit()
            await session.refresh(entry)
        return entry

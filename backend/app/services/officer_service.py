from datetime import datetime
from fastapi import HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.officer import Officer, OfficerStatus
from app.schemas.officer import OfficerCreateRequest


class OfficerService:
    @staticmethod
    async def list_officers(session: AsyncSession) -> list[Officer]:
        stmt = select(Officer).order_by(Officer.created_at.desc())
        return list((await session.exec(stmt)).all())

    @staticmethod
    async def create_officer(session: AsyncSession, payload: OfficerCreateRequest) -> Officer:
        officer = Officer(
            name=payload.name,
            phone=payload.phone,
            location=payload.location,
            status=payload.status,
            user_id=payload.user_id,
        )
        session.add(officer)
        await session.commit()
        await session.refresh(officer)
        return officer

    @staticmethod
    async def get_officer_or_404(session: AsyncSession, officer_id: int) -> Officer:
        officer = await session.get(Officer, officer_id)
        if not officer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Officer not found")
        return officer

    @staticmethod
    async def update_status(session: AsyncSession, officer: Officer, new_status: OfficerStatus) -> Officer:
        officer.status = new_status
        officer.updated_at = datetime.utcnow()
        session.add(officer)
        await session.commit()
        await session.refresh(officer)
        return officer

    @staticmethod
    async def delete_officer(session: AsyncSession, officer: Officer) -> None:
        await session.delete(officer)
        await session.commit()

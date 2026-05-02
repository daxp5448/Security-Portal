from datetime import datetime

from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.incident import Incident, RiskCategory
from app.models.location_risk import LocationRiskProfile


class RiskService:
    @staticmethod
    async def assess_incident_risk(
        session: AsyncSession,
        *,
        location_name: str,
        incident_at: datetime,
        latitude: float,
        longitude: float,
    ) -> dict:
        profile_stmt = select(LocationRiskProfile).where(
            func.lower(LocationRiskProfile.location_name) == location_name.lower()
        )
        profile = (await session.exec(profile_stmt)).first()
        location_crime_rate = round(profile.crime_rate if profile else 35.0, 2)

        similar_stmt = select(func.count(Incident.id)).where(
            func.lower(Incident.location_name) == location_name.lower(),
            Incident.created_at >= incident_at.replace(hour=0, minute=0, second=0, microsecond=0),
        )
        nearby_similar_count = int((await session.exec(similar_stmt)).one() or 0)

        hour = incident_at.hour
        if 0 <= hour < 5:
            time_risk = 28
        elif 5 <= hour < 9:
            time_risk = 12
        elif 9 <= hour < 18:
            time_risk = 8
        else:
            time_risk = 20

        score = min(100.0, max(0.0, (location_crime_rate * 0.55) + (nearby_similar_count * 9) + time_risk))
        if score >= 70:
            category = RiskCategory.HIGH
        elif score >= 40:
            category = RiskCategory.MODERATE
        else:
            category = RiskCategory.SAFE

        return {
            "risk_score": round(score, 2),
            "category": category,
            "location_crime_rate": location_crime_rate,
            "nearby_similar_count": nearby_similar_count,
            "latitude": latitude,
            "longitude": longitude,
        }

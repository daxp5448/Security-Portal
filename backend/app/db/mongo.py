from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings


class MongoDB:
    client: AsyncIOMotorClient | None = None
    db = None
    enabled: bool = False


db = MongoDB()


async def connect_to_mongo() -> None:
    if not settings.MONGODB_ENABLED:
        db.enabled = False
        return

    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db.db = db.client[settings.DATABASE_NAME_MONGO]
    db.enabled = True


async def close_mongo_connection() -> None:
    if db.client:
        db.client.close()
    db.client = None
    db.db = None
    db.enabled = False

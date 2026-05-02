import asyncio
from sqlmodel import SQLModel
from app.db.session import engine
from sqlalchemy import text
import app.models

async def migrate():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        print("Created new tables.")
        try:
            await conn.execute(text("ALTER TABLE incidents ADD COLUMN assigned_to INTEGER"))
            await conn.execute(text("ALTER TABLE incidents ADD CONSTRAINT fk_incidents_assigned_to_officers FOREIGN KEY (assigned_to) REFERENCES officers (id)"))
            print("Successfully added assigned_to.")
        except Exception as e:
            print(f"assigned_to column might exist or error: {e}")
        try:
            await conn.execute(text("ALTER TABLE incidents ADD COLUMN dispatch_time TIMESTAMP WITHOUT TIME ZONE"))
            print("Successfully added dispatch_time.")
        except Exception as e:
            print(f"dispatch_time column might exist or error: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())

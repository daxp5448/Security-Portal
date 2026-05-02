import asyncio
from app.db.session import async_session_maker
from app.models.user import User, UserRole
from app.core.security import get_password_hash

async def create_admin():
    async with async_session_maker() as session:
        # Check if admin already exists
        from sqlmodel import select
        stmt = select(User).where(User.email == "admin@sentinel.com")
        result = await session.exec(stmt)
        existing = result.first()
        
        if existing:
            print("Admin user already exists!")
            return
        
        # Create admin user
        admin = User(
            email="admin@sentinel.com",
            full_name="Admin User",
            hashed_password=get_password_hash("AdminPass123"),
            role=UserRole.ADMIN,
            is_active=True,
            is_superuser=True
        )
        
        session.add(admin)
        await session.commit()
        await session.refresh(admin)
        print(f"✅ Admin user created successfully!")
        print(f"   Email: admin@sentinel.com")
        print(f"   Password: AdminPass123")
        print(f"   ID: {admin.id}")

if __name__ == "__main__":
    asyncio.run(create_admin())

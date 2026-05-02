from fastapi import APIRouter

from app.api.v1.endpoints import admin, ai, auth, community, incidents, logs

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(community.router, prefix="/community", tags=["community"])
api_router.include_router(logs.router, prefix="/logs", tags=["logs"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])

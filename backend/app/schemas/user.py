from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.user import UserRole


class UserRead(BaseModel):
    id: int
    email: str
    full_name: str | None = None
    role: UserRole
    is_active: bool
    is_superuser: bool
    last_login_at: datetime | None = None
    blocked_at: datetime | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserCreateRequest(BaseModel):
    email: str = Field(min_length=5, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.USER
    is_active: bool = True


class UserRoleUpdateRequest(BaseModel):
    role: UserRole


class UserBlockUpdateRequest(BaseModel):
    is_active: bool


class PaginatedUsers(BaseModel):
    items: list[UserRead]
    total: int
    page: int
    page_size: int

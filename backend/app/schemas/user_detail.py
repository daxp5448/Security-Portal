from pydantic import BaseModel
from typing import List
from app.schemas.user import UserRead
from app.schemas.log import AuditLogRead
from app.schemas.incident import IncidentRead

class UserDetailRead(BaseModel):
    user: UserRead
    recent_logs: List[AuditLogRead]
    reported_incidents: List[IncidentRead]

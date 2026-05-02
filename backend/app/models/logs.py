from pydantic import BaseModel


class LogCreate(BaseModel):
    action: str
    entity_type: str = "system"
    description: str
    status: str = "success"
    entity_id: str | None = None
    payload: dict | None = None

from pydantic import BaseModel, Field, BeforeValidator, ConfigDict
from typing import Optional, List, Annotated
from datetime import datetime
from bson import ObjectId

PyObjectId = Annotated[str, BeforeValidator(str)]

class Reply(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    author: str
    content: str
    time: datetime = Field(default_factory=datetime.utcnow)
    avatar: Optional[str] = None

class CommunityPostBase(BaseModel):
    title: str = Field(...)
    description: str = Field(...)
    tags: List[str] = Field(default=[])
    author: str = Field(...)
    avatar: Optional[str] = None

class CommunityPostCreate(CommunityPostBase):
    pass

class CommunityPost(CommunityPostBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    likes: int = 0
    replies: List[Reply] = []

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )

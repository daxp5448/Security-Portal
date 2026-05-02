from fastapi import APIRouter, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List

from app.models.community import CommunityPost, CommunityPostCreate, Reply
from app.db.mongo import db

router = APIRouter()


def ensure_mongo_available():
    if not db.enabled or db.db is None:
        raise HTTPException(status_code=503, detail="Community service is currently unavailable")

@router.post("/posts", response_description="Add new post", status_code=status.HTTP_201_CREATED)
async def create_post(post: CommunityPostCreate = Body(...)):
    ensure_mongo_available()
    post_data = jsonable_encoder(post)
    post_data["created_at"] = post.created_at if hasattr(post, "created_at") else None 
    
    new_post = await db.db["posts"].insert_one(post_data)
    created_post = await db.db["posts"].find_one({"_id": new_post.inserted_id})
    created_post["_id"] = str(created_post["_id"])
    return created_post

@router.get("/posts", response_description="List all posts")
async def list_posts(limit: int = 100):
    ensure_mongo_available()
    posts = await db.db["posts"].find().sort("created_at", -1).to_list(limit)
    for p in posts:
        p["_id"] = str(p["_id"])
        for r in p.get("replies", []):
            if "id" in r:
                r["id"] = str(r["id"])
    return posts

@router.delete("/posts/{id}", response_description="Delete a post")
async def delete_post(id: str):
    ensure_mongo_available()
    # Accept both object ID representations if needed
    from bson import ObjectId
    try:
        obj_id = ObjectId(id)
    except:
        obj_id = id
        
    delete_result = await db.db["posts"].delete_one({"_id": obj_id})
    if delete_result.deleted_count == 1:
        return {"msg": "Post deleted successfully"}
    
    delete_result_str = await db.db["posts"].delete_one({"_id": id})
    if delete_result_str.deleted_count == 1:
        return {"msg": "Post deleted successfully"}
        
    raise HTTPException(status_code=404, detail=f"Post {id} not found")

@router.put("/posts/{id}/like")
async def like_post(id: str):
    ensure_mongo_available()
    from bson import ObjectId
    try:
        obj_id = ObjectId(id)
    except:
        obj_id = id

    if await db.db["posts"].find_one({"_id": obj_id}) is not None:
        await db.db["posts"].update_one({"_id": obj_id}, {"$inc": {"likes": 1}})
        post = await db.db["posts"].find_one({"_id": obj_id})
        post["_id"] = str(post["_id"])
        return post
    
    if await db.db["posts"].find_one({"_id": id}) is not None:
        await db.db["posts"].update_one({"_id": id}, {"$inc": {"likes": 1}})
        post = await db.db["posts"].find_one({"_id": id})
        post["_id"] = str(post["_id"])
        return post

    raise HTTPException(status_code=404, detail=f"Post {id} not found")

@router.post("/posts/{id}/reply")
async def add_reply(id: str, reply: Reply = Body(...)):
    ensure_mongo_available()
    reply_data = jsonable_encoder(reply)
    
    from bson import ObjectId
    try:
        obj_id = ObjectId(id)
    except:
        obj_id = id

    if await db.db["posts"].find_one({"_id": obj_id}) is not None:
        await db.db["posts"].update_one(
            {"_id": obj_id}, 
            {"$push": {"replies": reply_data}}
        )
        post = await db.db["posts"].find_one({"_id": obj_id})
        post["_id"] = str(post["_id"])
        return post
        
    if await db.db["posts"].find_one({"_id": id}) is not None:
        await db.db["posts"].update_one(
            {"_id": id}, 
            {"$push": {"replies": reply_data}}
        )
        post = await db.db["posts"].find_one({"_id": id})
        post["_id"] = str(post["_id"])
        return post
        
    raise HTTPException(status_code=404, detail=f"Post {id} not found")

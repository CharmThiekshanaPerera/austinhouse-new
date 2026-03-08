from fastapi import APIRouter, HTTPException
from typing import List
from app.models import BlogPostCreate, BlogPostUpdate, BlogPostOut
from app import db
import uuid

router = APIRouter(prefix="/blog", tags=["Blog"])

@router.get("/", response_model=List[BlogPostOut])
async def get_all_blog_posts():
    cursor = db.get_db().blog.find()
    blog_posts = await cursor.to_list(length=100)
    for post in blog_posts:
        post["id"] = str(post["_id"])
    return blog_posts

@router.get("/{post_id}", response_model=BlogPostOut)
async def get_blog_post(post_id: str):
    post = await db.get_db().blog.find_one({"_id": post_id})
    if post:
        post["id"] = str(post["_id"])
        return post
    raise HTTPException(status_code=404, detail="Blog post not found")

@router.post("/", response_model=BlogPostOut, status_code=201)
async def create_blog_post(post: BlogPostCreate):
    post_dict = post.model_dump()
    post_dict["_id"] = str(uuid.uuid4())
    await db.get_db().blog.insert_one(post_dict)
    post_dict["id"] = post_dict["_id"]
    return post_dict

@router.patch("/{post_id}", response_model=BlogPostOut)
async def update_blog_post(post_id: str, post_update: BlogPostUpdate):
    update_data = {k: v for k, v in post_update.model_dump().items() if v is not None}
    if update_data:
        result = await db.get_db().blog.update_one({"_id": post_id}, {"$set": update_data})
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Blog post not found")
    return await get_blog_post(post_id)

@router.delete("/{post_id}", status_code=204)
async def delete_blog_post(post_id: str):
    result = await db.get_db().blog.delete_one({"_id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return None

import os
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Response, Request, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from db import get_db
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_user,
    get_jwt_secret,
    JWT_ALGORITHM,
)
import jwt

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])

BRUTE_FORCE_MAX = 5
BRUTE_FORCE_WINDOW_SECONDS = 900  # 15 min


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def _set_tokens(response: Response, user_id: str, email: str, role: str):
    access_token = create_access_token(user_id, email, role)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=3600,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/",
    )


@router.post("/login")
async def login(body: LoginRequest, request: Request, response: Response):
    db = get_db()
    email = body.email.lower()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"

    # Brute force check
    attempts = await db.login_attempts.count_documents({"identifier": identifier})
    if attempts >= BRUTE_FORCE_MAX:
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")

    user = await db.admin_users.find_one({"email": email})
    if not user or not verify_password(body.password, user.get("password_hash", "")):
        await db.login_attempts.insert_one({
            "identifier": identifier,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is disabled")

    # Clear failed attempts on success
    await db.login_attempts.delete_many({"identifier": identifier})

    user_id = str(user["_id"])
    _set_tokens(response, user_id, email, user["role"])

    # Update last_login
    await db.admin_users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}},
    )

    # Audit log
    await db.audit_logs.insert_one({
        "user_id": user_id,
        "user_email": email,
        "action": "login",
        "resource_type": "auth",
        "resource_id": None,
        "before_state": None,
        "after_state": None,
        "changes": None,
        "ip_address": ip,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return {
        "id": user_id,
        "email": email,
        "name": user.get("name", "Admin"),
        "role": user["role"],
        "is_active": user.get("is_active", True),
    }


@router.post("/logout")
async def logout(response: Response, current_user: dict = Depends(get_current_user)):
    db = get_db()
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    await db.audit_logs.insert_one({
        "user_id": current_user["_id"],
        "user_email": current_user["email"],
        "action": "logout",
        "resource_type": "auth",
        "resource_id": None,
        "before_state": None,
        "after_state": None,
        "changes": None,
        "ip_address": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return {"message": "Logged out successfully"}


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.post("/refresh")
async def refresh(request: Request, response: Response):
    db = get_db()
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(refresh_token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.admin_users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user_id = str(user["_id"])
        access_token = create_access_token(user_id, user["email"], user["role"])
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=3600,
            path="/",
        )
        return {"message": "Token refreshed"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

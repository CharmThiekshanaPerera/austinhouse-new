from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from app.db import get_db
from app.settings import settings

router = APIRouter(tags=["auth"])

# ── Password hashing ──────────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── OAuth2 scheme (reads Bearer token from Authorization header) ──────────────
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


# ── Pydantic models ───────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


class UserInfo(BaseModel):
    username: str
    role: str


# ── JWT helpers ───────────────────────────────────────────────────────────────
def _create_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def _verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ── Dependency: resolve current user from Bearer token ────────────────────────
async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInfo:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        username: Optional[str] = payload.get("sub")
        role: str = payload.get("role", "admin")
        if username is None:
            raise credentials_exc
    except JWTError:
        raise credentials_exc
    return UserInfo(username=username, role=role)


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/auth/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    """
    JSON login endpoint — accepts {username, password}, returns JWT.
    """
    db = get_db()
    user = await db["users"].find_one({"username": body.username})
    if not user or not _verify_password(body.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    token = _create_token({"sub": user["username"], "role": user.get("role", "admin")})
    return TokenResponse(access_token=token, role=user.get("role", "admin"))


@router.post("/auth/token", response_model=TokenResponse)
async def token_form(form: OAuth2PasswordRequestForm = Depends()):
    """
    Form-based login (for OAuth2 PasswordBearer compatibility / Swagger UI).
    """
    db = get_db()
    user = await db["users"].find_one({"username": form.username})
    if not user or not _verify_password(form.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    token = _create_token({"sub": user["username"], "role": user.get("role", "admin")})
    return TokenResponse(access_token=token, role=user.get("role", "admin"))


@router.get("/auth/me", response_model=UserInfo)
async def me(current_user: UserInfo = Depends(get_current_user)):
    """Return the currently authenticated user's info."""
    return current_user

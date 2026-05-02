from typing import Annotated

from fastapi import APIRouter, Depends, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import CurrentUser, SessionDep, get_client_ip
from app.schemas.auth import AuthenticatedUser, LogoutRequest, RefreshTokenRequest, RegisterRequest, TokenPair, ForgotPasswordRequest
from app.schemas.user import UserCreateRequest
from app.services.audit_service import AuditService
from app.services.auth_service import AuthService


router = APIRouter()


@router.post("/register", response_model=AuthenticatedUser, status_code=status.HTTP_201_CREATED)
async def register(user_in: RegisterRequest, session: SessionDep, request: Request):
    user = await AuthService.register(
        session,
        UserCreateRequest(
            email=user_in.email,
            full_name=user_in.full_name,
            password=user_in.password,
        ),
    )
    await AuditService.log(
        session,
        action="register",
        entity_type="user",
        entity_id=str(user.id),
        description="New user registered",
        actor=user,
        ip_address=get_client_ip(request),
    )
    return AuthenticatedUser.model_validate(user)


@router.post("/login", response_model=TokenPair)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep,
    request: Request,
):
    user = await AuthService.authenticate(session, form_data.username, form_data.password)
    token_pair = await AuthService.issue_token_pair(
        session,
        user=user,
        user_agent=request.headers.get("user-agent"),
        ip_address=get_client_ip(request),
    )
    await AuditService.log(
        session,
        action="login",
        entity_type="auth",
        description="User logged in",
        actor=user,
        ip_address=get_client_ip(request),
        payload={"role": user.role.value},
    )
    return token_pair


@router.post("/refresh", response_model=TokenPair)
async def refresh_access_token(payload: RefreshTokenRequest, session: SessionDep, request: Request):
    return await AuthService.refresh_tokens(
        session,
        refresh_token=payload.refresh_token,
        user_agent=request.headers.get("user-agent"),
        ip_address=get_client_ip(request),
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(payload: LogoutRequest, session: SessionDep):
    await AuthService.revoke_refresh_token(session, payload.refresh_token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=AuthenticatedUser)
async def get_current_user_profile(current_user: CurrentUser):
    return AuthenticatedUser.model_validate(current_user)

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(payload: ForgotPasswordRequest, session: SessionDep):
    # Simulated email sending feature as requested in dev mode
    print(f"[MAIL_SERVICE] Simulating sending password reset email to: {payload.email}")
    return {"message": "If that email is in our system, you will receive a reset link shortly."}

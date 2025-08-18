from fastapi import APIRouter

from app.clients.supabase_client import AsyncSupabaseClientDep

# Create the router
router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
async def login_with_email(email: str, password: str, supabase_client: AsyncSupabaseClientDep):
    """
    Placeholder for login endpoint.
    """
    res = await supabase_client.auth.sign_in_with_password(
        {
            "email": email,
            "password": password,
        }
    )
    return res.session.access_token

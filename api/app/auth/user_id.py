from typing import Annotated
from uuid import UUID
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config.app_config import SupabaseConfigDep


auth_scheme = HTTPBearer()


def get_current_user_id(
    config: SupabaseConfigDep, credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)
) -> UUID:
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            config.jwt_secret.get_secret_value(),
            algorithms=["HS256"],
            audience="authenticated",
        )

        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("User ID not found in token")
        return UUID(user_id)

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


UserIdDep = Annotated[UUID, Depends(get_current_user_id)]

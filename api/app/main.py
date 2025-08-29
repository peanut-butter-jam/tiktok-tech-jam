from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.app_config import get_app_config
from app.routers.auth_router import router as auth_router
from app.routers.regulation_router import router as regulation_router
from app.routers.feature_router import router as feature_router

app = FastAPI()
allow_origins = get_app_config().core.allow_origins

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(regulation_router)
app.include_router(feature_router)

from fastapi import APIRouter

from app.dtos.feature_dto import CreateFeatureDTO
from app.services.feature.feature_service import FeatureServiceDep


router = APIRouter(prefix="/features", tags=["Features"])


@router.get("/")
async def get_features(feature_service: FeatureServiceDep):
    """
    Get all features.
    """
    return feature_service.get_all_features()


@router.get("/{feature_id}")
async def get_feature(feature_id: int, feature_service: FeatureServiceDep):
    """
    Get a feature by ID.
    """
    return feature_service.get_feature_by_id(feature_id)


# NOTE polling endpoint not done yet
@router.get("/status/{feature_id}")
async def get_feature_check_status(feature_id: int):
    """
    Get the status of a feature by ID.
    """
    return {"message": f"Get status of feature with ID {feature_id}"}


@router.post("/")
async def upload_feature(feature: CreateFeatureDTO, feature_service: FeatureServiceDep):
    """
    Create a new feature.
    """
    return feature_service.create_feature(feature)

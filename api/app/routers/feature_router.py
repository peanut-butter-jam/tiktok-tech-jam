from fastapi import APIRouter


router = APIRouter(prefix="/features", tags=["Features"])


@router.get("/")
async def get_features():
    """
    Get all features.
    """
    return {"message": "Get all features"}


@router.get("/{feature_id}")
async def get_feature(feature_id: int):
    """
    Get a feature by ID.
    """
    return {"message": f"Get feature with ID {feature_id}"}


@router.get("/status/{feature_id}")
async def get_feature_check_status(feature_id: int):
    """
    Get the status of a feature by ID.
    """
    return {"message": f"Get status of feature with ID {feature_id}"}


@router.post("/")
async def upload_feature():
    """
    Create a new feature.
    """
    return {"message": "Create a new feature"}

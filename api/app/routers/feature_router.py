from typing import List
from fastapi import APIRouter, BackgroundTasks

from app.services.feature.feat_eval.feat_eval_agent import FeatEvalAgentDep
from app.dtos.feature_dto import FeatureCreateDTO, FeatureUpdateDTO, FeatureDTOWithCheck
from app.services.feature.feature_service import FeatureServiceDep


router = APIRouter(prefix="/features", tags=["Features"])


@router.get("/", response_model=List[FeatureDTOWithCheck])
async def get_features(feature_service: FeatureServiceDep):
    """
    Get all features.
    """
    return await feature_service.get_all_features()


@router.get("/{feature_id}", response_model=FeatureDTOWithCheck)
async def get_feature(feature_id: int, feature_service: FeatureServiceDep):
    """
    Get a feature by ID.
    """
    return await feature_service.get_feature_by_id(feature_id)


@router.post("/", response_model=FeatureDTOWithCheck)
async def upload_feature(
    feature: FeatureCreateDTO,
    feature_service: FeatureServiceDep,
    feat_eval_agent: FeatEvalAgentDep,
    background_task: BackgroundTasks,
):
    """
    Create a new feature.
    """
    inserted_feature = await feature_service.create_feature(feature)

    background_task.add_task(feat_eval_agent.invoke, feature=inserted_feature)

    return inserted_feature


@router.put("/{feature_id}", response_model=FeatureDTOWithCheck)
async def update_feature(feature_id: int, feature: FeatureUpdateDTO, feature_service: FeatureServiceDep):
    """
    Update a feature's title, description, and terminologies by ID.
    Terminologies will be synced to the terminology database automatically.
    """
    return await feature_service.update_feature(feature_id, feature)

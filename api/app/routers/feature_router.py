from typing import List
from fastapi import APIRouter, UploadFile

from app.dtos.reconcile_check_result_request import ReconcileCheckResultRequest
from app.dtos.eval_result_dto import HumanReconciledEvalResultDTO
from app.services.check.check_service import CheckServiceDep
from app.dtos.check_dto import CheckDTO
from app.services.feature.feat_eval.feat_eval_agent import FeatEvalAgentDep
from app.services.feature.feat_eval.term_mapping_agent import TerminologyMappingAgentDep
from app.dtos.feature_dto import (
    FeatureCreateDTO,
    FeatureDTO,
    FeatureDTOWithCheck,
    FeatureUpdateDTO,
)
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
):
    """
    Create a new feature.
    """
    inserted_feature = await feature_service.create_feature(feature)

    await feat_eval_agent.invoke(feature=inserted_feature)

    return inserted_feature


@router.put("/{feature_id}", response_model=FeatureDTOWithCheck)
async def update_feature(
    feature_id: int, feature: FeatureUpdateDTO, feature_service: FeatureServiceDep
):
    """
    Update a feature's title, description, and terminologies by ID.
    Terminologies will be synced to the terminology database automatically.
    """
    return await feature_service.update_feature(feature_id, feature)


@router.post("/csv", response_model=List[FeatureDTOWithCheck])
async def import_features_from_csv(
    csv_file: UploadFile,
    feature_service: FeatureServiceDep,
    feat_eval_agent: FeatEvalAgentDep,
):
    """
    Import features from a CSV file.
    """
    features = await feature_service.import_features_from_csv(csv_file)

    await feat_eval_agent.invoke_multiple(
        features=[FeatureDTO.model_validate(f) for f in features]
    )

    return features


@router.post("/{feature_id}/checks", response_model=CheckDTO)
async def create_feature_check(
    feature_id: int,
    feature_service: FeatureServiceDep,
    feat_eval_agent: FeatEvalAgentDep,
):
    """
    Create a new check for a feature.
    """

    feature = await feature_service.get_feature_by_id(feature_id)

    return await feat_eval_agent.invoke(feature=feature)


@router.delete("/{feature_id}", status_code=204)
async def delete_feature_by_id(feature_id: int, feature_service: FeatureServiceDep):
    """
    Delete a feature by ID.
    """
    await feature_service.delete_feature_by_id(feature_id)


@router.post("/{feature_id}/extract-terminologies")
async def extract_terminologies_for_feature(
    feature_id: int,
    feature_service: FeatureServiceDep,
    terminology_agent: TerminologyMappingAgentDep,
):
    """
    Test endpoint: Extract terminology mappings for a specific feature.
    This will run the terminology mapping agent and return the results without updating the feature.
    """
    # Get the feature
    feature = await feature_service.get_feature_by_id(feature_id)

    # Convert to FeatureDTO for the agent
    feature_dto = FeatureDTO(
        id=feature.id,
        title=feature.title,
        description=feature.description,
        terminologies=feature.terminologies,
        created_at=feature.created_at,
        updated_at=feature.updated_at,
    )

    # Extract terminologies using the agent
    mappings = await terminology_agent.extract_terminology_mappings(feature_dto)

    return {
        "feature_id": feature_id,
        "feature_title": feature.title,
        "extracted_terminologies": mappings,
        "message": f"Found {len(mappings)} terminology mappings",
    }


@router.put("/{feature_id}/checks", response_model=CheckDTO)
async def reconcile_feature_check(
    feature_id: int,
    reconciled_result: ReconcileCheckResultRequest,
    check_service: CheckServiceDep,
):
    """
    Reconcile a feature's check result.
    """
    return await check_service.reconcile_check_result(
        feature_id, HumanReconciledEvalResultDTO.model_validate(reconciled_result)
    )

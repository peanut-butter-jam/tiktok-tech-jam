from fastapi import APIRouter

from app.dtos.feature_dto import FeatureDto
from app.services.regulation.feat_eval.feat_eval_agent import FeatEvalAgentDep
from app.services.regulation.regulation_service import RegulationServiceDep

# Create the router
router = APIRouter(prefix="/regulations", tags=["Regulations"])


@router.post("/")
async def upload_regulation(regulation: str, regulation_service: RegulationServiceDep):
    """
    Create a new regulation.
    """

    return await regulation_service.upload_regulation(regulation)


@router.post("/test_evaluate")
async def evaluate_feature(feature: FeatureDto, eval_agent: FeatEvalAgentDep):
    """
    Evaluate a feature for geo-specific compliance needs.
    """
    return await eval_agent.evaluate(feature)

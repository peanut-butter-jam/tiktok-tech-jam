from fastapi import APIRouter, UploadFile
from app.services.regulation.pdf_reader import read_pdf
from app.services.regulation.rou_extraction.map_reduce_rou_extractor import MapReduceRouExtractorDep
from app.dtos.feature_dto import FeatureDto
from app.services.regulation.feat_eval.feat_eval_agent import FeatEvalAgentDep
from app.services.regulation.regulation_service import RegulationServiceDep
from app.dtos.regulation_dto import CreateRegulationDTO

# Create the router
router = APIRouter(prefix="/regulations", tags=["Regulations"])


@router.post("/")
async def upload_regulation(regulation: CreateRegulationDTO, regulation_service: RegulationServiceDep):
    """
    Create a new regulation.
    """
    return await regulation_service.upload_regulation(regulation)


@router.get("/")
async def get_regulations(regulation_service: RegulationServiceDep):
    """
    Get all regulations.
    """
    return await regulation_service.get_all_regulations()


@router.get("/{regulation_id}")
async def get_regulation(regulation_id: int, regulation_service: RegulationServiceDep):
    """
    Get a regulation by ID.
    """
    return await regulation_service.get_regulation_by_id(regulation_id)


@router.post("/test_evaluate")
async def evaluate_feature(feature: FeatureDto, eval_agent: FeatEvalAgentDep):
    """
    Evaluate a feature for geo-specific compliance needs.
    """
    return await eval_agent.evaluate(feature)


@router.post("/test_upload_regulation")
async def test_upload_regulation(
    regulation: UploadFile,
    map_reduce_rou_extractor: MapReduceRouExtractorDep,
    regulation_service: RegulationServiceDep,
):
    """
    Test the map-reduce functionality.
    """
    text = read_pdf(regulation)

    extracted_rous = await map_reduce_rou_extractor.extract(text)

    return await regulation_service.upload_regulation(extracted_rous)

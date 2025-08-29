from fastapi import APIRouter, BackgroundTasks, UploadFile

from app.dtos.feature_dto import FeatureDTO
from app.dtos.regulation_dto import RegulationCreateDTO, RegulationDTO
from app.services.regulation.rou_service import RouServiceDep, SupabaseStorageServiceDep
from app.services.regulation.feat_eval.feat_eval_agent import FeatEvalAgentDep
from app.services.regulation.regulation_service import RegulationServiceDep

# Create the router
router = APIRouter(prefix="/regulations", tags=["Regulations"])


@router.post("/file")
async def upload_regulation_file(file: UploadFile, supabase_storage_service: SupabaseStorageServiceDep):
    return await supabase_storage_service.upload_file("regulations", file)


@router.post("/", response_model=RegulationDTO)
async def upload_regulation(
    regulation: RegulationCreateDTO,
    regulation_service: RegulationServiceDep,
    background_task: BackgroundTasks,
    rou_service: RouServiceDep,
):
    """
    Create a new regulation.
    """
    uploaded_regulation = await regulation_service.upload_regulation(regulation)

    # Non-blocking rous extraction task
    background_task.add_task(rou_service.extract_from_regulation, regulation=uploaded_regulation)

    return uploaded_regulation


@router.get("/", response_model=list[RegulationDTO])
async def get_regulations(regulation_service: RegulationServiceDep):
    """
    Get all regulations.
    """
    return await regulation_service.get_all_regulations()


@router.get("/{regulation_id}", response_model=RegulationDTO)
async def get_regulation(regulation_id: int, regulation_service: RegulationServiceDep):
    """
    Get a regulation by ID.
    """
    return await regulation_service.get_regulation_by_id(regulation_id)


@router.post("/test_evaluate")
async def evaluate_feature(feature: FeatureDTO, eval_agent: FeatEvalAgentDep):
    """
    Evaluate a feature for geo-specific compliance needs.
    """
    return await eval_agent.evaluate(feature)

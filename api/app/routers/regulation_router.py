from fastapi import APIRouter

from app.services.regulation.regulation_service import RegulationServiceDep
from app.dtos.regulation_dto import CreateRegulationDTO

# Create the router
router = APIRouter(prefix="/regulations", tags=["Regulations"])


@router.post("/")
async def upload_regulation(
    regulation: CreateRegulationDTO, regulation_service: RegulationServiceDep
):
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

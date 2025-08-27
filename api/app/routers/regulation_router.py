from fastapi import APIRouter

from app.services.regulation.regulation_service import RegulationServiceDep

# Create the router
router = APIRouter(prefix="/regulations", tags=["Regulations"])


@router.post("/")
async def upload_regulation(regulation: str, regulation_service: RegulationServiceDep):
    """
    Create a new regulation.
    """
    return await regulation_service.upload_regulation(regulation)

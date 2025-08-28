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


@router.get("/")
async def get_regulations():
    """
    Get all regulations.
    """
    return {"message": "Get all regulations"}


@router.get("/{regulation_id}")
async def get_regulation(regulation_id: int):
    """
    Get a regulation by ID.
    """
    return {"message": f"Get regulation with ID {regulation_id}"}

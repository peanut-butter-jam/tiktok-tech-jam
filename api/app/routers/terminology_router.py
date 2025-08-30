from typing import List
from fastapi import APIRouter, UploadFile

from app.dtos.terminology_dto import TerminologyCreateDTO, TerminologyDTO
from app.services.terminology.terminology_service import TerminologyServiceDep

router = APIRouter(prefix="/terminologies", tags=["Terminologies"])


@router.get("/", response_model=List[TerminologyDTO])
async def get_terminologies(terminology_service: TerminologyServiceDep):
    """
    Get all terminologies.
    """
    return await terminology_service.get_all_terminologies()


@router.get("/{terminology_id}", response_model=TerminologyDTO)
async def get_terminology(terminology_id: int, terminology_service: TerminologyServiceDep):
    """
    Get a terminology by ID.
    """
    return await terminology_service.get_terminology_by_id(terminology_id)


@router.post("/", response_model=TerminologyDTO)
async def create_terminology(
    terminology: TerminologyCreateDTO,
    terminology_service: TerminologyServiceDep,
):
    """
    Create a new terminology.
    """
    return await terminology_service.create_terminology(terminology)


@router.post("/csv", response_model=List[TerminologyDTO])
async def import_terminologies_from_csv(
    csv_file: UploadFile,
    terminology_service: TerminologyServiceDep,
):
    """
    Import terminologies from a CSV file.
    Expected CSV format: key,value
    """
    return await terminology_service.import_terminologies_from_csv(csv_file)


@router.delete("/{terminology_id}", status_code=204)
async def delete_terminology(terminology_id: int, terminology_service: TerminologyServiceDep):
    """
    Delete a terminology by ID.
    """
    await terminology_service.delete_terminology_by_id(terminology_id)
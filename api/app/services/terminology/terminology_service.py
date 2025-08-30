from typing import Annotated, List
from fastapi import Depends, UploadFile, HTTPException
from sqlalchemy.exc import IntegrityError
import pandas as pd

from app.dtos.terminology_dto import TerminologyCreateDTO, TerminologyDTO
from app.database.repositories.terminology_repository import TerminologyRepositoryDep


class TerminologyService:

    def __init__(self, terminology_repository: TerminologyRepositoryDep):
        self.terminology_repository = terminology_repository

    async def get_all_terminologies(self) -> List[TerminologyDTO]:
        """Get all terminologies"""
        entries = await self.terminology_repository.get_all()
        return [TerminologyDTO.model_validate(entry) for entry in entries]

    async def get_terminology_by_id(self, terminology_id: int) -> TerminologyDTO:
        """Get a terminology by ID"""
        entry = await self.terminology_repository.get_one_by_id(terminology_id)
        
        if not entry:
            raise ValueError("Terminology not found")
        
        return TerminologyDTO.model_validate(entry)

    async def create_terminology(self, terminology: TerminologyCreateDTO) -> TerminologyDTO:
        """Create a single terminology"""
        try:
            inserted = await self.terminology_repository.create(terminology.to_db())
            return TerminologyDTO.model_validate(inserted)
        except IntegrityError as e:
            if "uq_terminology_key_value" in str(e):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Terminology with key '{terminology.key}' and value '{terminology.value}' already exists"
                )
            raise HTTPException(status_code=400, detail="Database constraint violation")

    async def delete_terminology_by_id(self, terminology_id: int) -> None:
        """Delete a terminology by ID"""
        deleted_count = await self.terminology_repository.delete_by_id(terminology_id)
        if deleted_count == 0:
            raise HTTPException(status_code=404, detail="Terminology not found")

    async def import_terminologies_from_csv(self, csv_file: UploadFile) -> List[TerminologyDTO]:
        """Import terminologies from CSV file"""
        if csv_file.content_type != "text/csv":
            raise ValueError("Invalid file type. Please upload a CSV file.")

        df = pd.read_csv(csv_file.file)
        
        # Validate CSV has required columns
        required_columns = ['key', 'value']
        if not all(col in df.columns for col in required_columns):
            raise ValueError(f"CSV must contain columns: {', '.join(required_columns)}")

        # Remove duplicates within the CSV itself
        df = df.drop_duplicates(subset=['key', 'value'])

        # Create DTO objects from CSV data
        terminologies = [TerminologyCreateDTO.model_validate(row) for row in df.to_dict(orient="records")]

        try:
            # Bulk insert terminologies
            inserted_terminologies = await self.terminology_repository.create_many(
                [terminology.to_db() for terminology in terminologies]
            )
            return [TerminologyDTO.model_validate(entry) for entry in inserted_terminologies]
        except IntegrityError as e:
            if "uq_terminology_key_value" in str(e):
                raise HTTPException(
                    status_code=400, 
                    detail="Some terminologies already exist in the database. Please check for duplicates."
                )
            raise HTTPException(status_code=400, detail="Database constraint violation")


TerminologyServiceDep = Annotated[TerminologyService, Depends(TerminologyService)]
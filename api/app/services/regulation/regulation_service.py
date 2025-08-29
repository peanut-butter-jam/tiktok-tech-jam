from typing import Annotated, List
from chromadb.api.models.Collection import Collection
from fastapi import BackgroundTasks, Depends
from sqlalchemy.orm import selectinload

from app.dtos.extraction_result import ExtractedRouDto
from app.database.schemas.regulation import Regulation
from app.database.repositories.regulation_repository import RegulationRepositoryDep
from app.dtos.rou_dto import RouDto
from app.database.schemas.enums.rou_type import RouType
from app.database.schemas.rou import ROU
from app.database.repositories.rou_repository import RouRepositoryDep
from app.clients.chromadb_client import ROU_COLLECTION_NAME, ChromaDbClientDep
from app.services.regulation.rou_extraction.rou_extract_model import RouExtractModelDep
from app.dtos.regulation_dto import RegulationCreateDTO, RegulationDTO


class RegulationService:
    def __init__(
        self,
        rou_extractor: RouExtractModelDep,
        rou_repository: RouRepositoryDep,
        chromadb_client: ChromaDbClientDep,
        regulation_repository: RegulationRepositoryDep,
    ):
        self.rou_extractor = rou_extractor
        self.rou_repository = rou_repository
        self.chromadb_client = chromadb_client
        self.regulation_repository = regulation_repository

    async def upload_regulation(self, regulation: RegulationCreateDTO) -> RegulationDTO:
        # create entry in regulations table
        entry = Regulation(title=regulation.title, file_object_id=regulation.file_object_id)

        inserted_model = await self.regulation_repository.create(entry)
        regulation_with_rous = await self.get_regulation_by_id(inserted_model.id)

        return RegulationDTO.model_validate(regulation_with_rous)

    async def get_all_regulations(self) -> List[RegulationDTO]:
        entries = await self.regulation_repository.get_all(options=[selectinload(Regulation.rous)])

        return [RegulationDTO.model_validate(reg) for reg in entries]

    async def get_regulation_by_id(self, regulation_id: int) -> RegulationDTO:
        entry = await self.regulation_repository.get_one_by_id(
            regulation_id, options=[selectinload(Regulation.rous)]
        )

        if not entry:
            raise ValueError(f"Regulation with ID {regulation_id} not found")

        return RegulationDTO.model_validate(entry)

    async def query_relevant_rous(self, query: str) -> List[RouDto]:
        rous_collection: Collection = self.chromadb_client.get_collection(ROU_COLLECTION_NAME)
        results = rous_collection.query(query_texts=[query])

        rou_ids = [int(i) for i in results["ids"][0]]
        return [
            RouDto.model_validate(rou) for rou in await self.rou_repository.get_by_filter(id=rou_ids)
        ]


RegulationServiceDep = Annotated[RegulationService, Depends(RegulationService)]

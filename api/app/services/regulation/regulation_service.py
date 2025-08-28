from typing import Annotated, List
from chromadb.api.models.Collection import Collection
from fastapi import Depends

from app.database.schemas.regulation import Regulation
from app.database.repositories.regulation_repository import RegulationRepositoryDep
from app.dtos.rou_dto import RouDto
from app.database.schemas.enums.rou_type import RouType
from app.database.schemas.rou import ROU
from app.database.repositories.rou_repository import RouRepositoryDep
from app.clients.chromadb_client import ROU_COLLECTION_NAME, ChromaDbClientDep
from app.services.regulation.rou_extractor import RouExtractorDep
from app.dtos.regulation_dto import CreateRegulationDTO, GetRegulationDTO


class RegulationService:
    def __init__(
        self,
        rou_extractor: RouExtractorDep,
        rou_repository: RouRepositoryDep,
        chromadb_client: ChromaDbClientDep,
        regulation_repository: RegulationRepositoryDep,
    ):
        self.rou_extractor = rou_extractor
        self.rou_repository = rou_repository
        self.chromadb_client = chromadb_client
        self.regulation_repository = regulation_repository

    async def upload_regulation(self, regulation: CreateRegulationDTO) -> List[RouDto]:

        # create entry in regulations table
        entry = Regulation(
            title=regulation.title, file_object_id=regulation.file_object_id
        )

        await self.regulation_repository.create(entry)

        # Extract rous from the regulation text

        rous = await self.rou_extractor.extract("")

        inserted_models = await self.rou_repository.create_many(
            [ROU(type=RouType.AI, source_id=0, **rou.model_dump()) for rou in rous]
        )

        rous_collection: Collection = self.chromadb_client.get_collection(
            ROU_COLLECTION_NAME
        )
        ids = [str(rou.id) for rou in inserted_models]
        documents = [rou.canonical_text for rou in rous]
        rous_collection.add(ids=ids, documents=documents)

        return [RouDto.model_validate(rou) for rou in inserted_models]

    async def get_all_regulations(self) -> List[GetRegulationDTO]:
        regulation_entries = await self.regulation_repository.get_all()

        regulation_dtos = map(
            lambda reg: GetRegulationDTO(
                id=reg.id,
                title=reg.title,
                file_object_id=None,
                created_at=reg.created_at,
                updated_at=reg.updated_at,
                rous=None,
            ),
            regulation_entries,
        )

        return list(regulation_dtos)

    async def get_regulation_by_id(self, regulation_id: int) -> GetRegulationDTO:
        regulation_entry = await self.regulation_repository.get_one_by_id(regulation_id)

        if not regulation_entry:
            raise ValueError(f"Regulation with ID {regulation_id} not found")

        rous = await self.rou_repository.get_by_filter(source_id=regulation_id)
        rous = [RouDto.model_validate(rou) for rou in rous]

        regulation_dto = GetRegulationDTO(
            id=regulation_entry.id,
            title=regulation_entry.title,
            file_object_id=regulation_entry.file_object_id,
            created_at=regulation_entry.created_at,
            updated_at=regulation_entry.updated_at,
            rous=rous,
        )

        return regulation_dto


RegulationServiceDep = Annotated[RegulationService, Depends(RegulationService)]

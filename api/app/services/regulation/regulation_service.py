from typing import Annotated, List
from chromadb.api.models.Collection import Collection
from fastapi import Depends

from app.dtos.rou_dto import RouDto
from app.database.schemas.enums.rou_type import RouType
from app.database.schemas.rou import ROU
from app.database.repositories.rou_repository import RouRepositoryDep
from app.clients.chromadb_client import ROU_COLLECTION_NAME, ChromaDbClientDep
from app.services.regulation.rou_extractor import RouExtractorDep


class RegulationService:
    def __init__(
        self,
        rou_extractor: RouExtractorDep,
        rou_repository: RouRepositoryDep,
        chromadb_client: ChromaDbClientDep,
    ):
        self.rou_extractor = rou_extractor
        self.rou_repository = rou_repository
        self.chromadb_client = chromadb_client

    async def upload_regulation(self, regulation: str) -> List[RouDto]:
        # Extract rous from the regulation text
        rous = await self.rou_extractor.extract(regulation)

        inserted_models = await self.rou_repository.create_many(
            [ROU(type=RouType.AI, source_id=0, **rou.model_dump()) for rou in rous]
        )

        rous_collection: Collection = self.chromadb_client.get_collection(ROU_COLLECTION_NAME)
        ids = [str(rou.id) for rou in inserted_models]
        documents = [rou.canonical_text for rou in rous]
        rous_collection.add(ids=ids, documents=documents)

        return [RouDto.model_validate(rou) for rou in inserted_models]

    async def query_relevant_rous(self, query: str) -> List[RouDto]:
        rous_collection: Collection = self.chromadb_client.get_collection(ROU_COLLECTION_NAME)
        results = rous_collection.query(query_texts=[query])

        rou_ids = [int(i) for i in results["ids"][0]]
        return [
            RouDto.model_validate(rou) for rou in await self.rou_repository.get_by_filter(id=rou_ids)
        ]


RegulationServiceDep = Annotated[RegulationService, Depends(RegulationService)]

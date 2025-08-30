from io import BytesIO
import logging
from typing import Annotated, List
from chromadb.api.models.Collection import Collection
from fastapi import Depends

from app.database.schemas.enums.rou_type import RouType
from app.dtos.extraction_result import ExtractedRouDto
from app.dtos.regulation_dto import RegulationDTO
from app.dtos.rou_dto import RouDto
from app.clients.chromadb_client import ROU_COLLECTION_NAME, ChromaDbClientDep
from app.database.schemas.rou import ROU
from app.services.regulation.pdf_reader import read_pdf
from app.services.regulation.regulation_service import RegulationServiceDep
from app.services.supabase.supabase_storage_service import SupabaseStorageServiceDep
from app.services.regulation.rou_extraction.map_reduce_rou_extractor import MapReduceRouExtractorDep
from app.database.repositories.rou_repository import RouRepositoryDep


class RouService:
    def __init__(
        self,
        rou_repository: RouRepositoryDep,
        rou_extractor: MapReduceRouExtractorDep,
        supabase_storage_service: SupabaseStorageServiceDep,
        chromadb_client: ChromaDbClientDep,
        regulation_service: RegulationServiceDep,
    ):
        self.rou_repository = rou_repository
        self.rou_extractor = rou_extractor
        self.supabase_storage_service = supabase_storage_service
        self.chromadb_client = chromadb_client
        self.regulation_service = regulation_service

    async def extract_from_bytes(self, bytes_io: BytesIO) -> List[ExtractedRouDto]:
        content = read_pdf(bytes_io)

        return await self.rou_extractor.extract(content)

    async def store_rous(self, rous: List[ExtractedRouDto], source_id: int) -> List[RouDto]:
        inserted_rous = await self.rou_repository.create_many(
            [ROU(type=RouType.AI, source_id=source_id, **rou.model_dump()) for rou in rous]
        )
        print(f"Stored {len(rous)} ROUs for regulation {source_id} into postgreSQL")

        rous_collection: Collection = self.chromadb_client.get_collection(ROU_COLLECTION_NAME)
        ids = [str(rou.id) for rou in inserted_rous]
        documents = [rou.canonical_text for rou in inserted_rous]
        rous_collection.add(ids=ids, documents=documents)
        print(f"Stored {len(inserted_rous)} ROUs for regulation {source_id} into ChromaDB")

        return [RouDto.model_validate(rou) for rou in inserted_rous]

    async def extract_from_regulation(self, regulation: RegulationDTO) -> List[RouDto]:
        file_bytes = await self.supabase_storage_service.download_file(regulation.file_object_id)
        file_stream = BytesIO(file_bytes)

        extracted_rous = await self.extract_from_bytes(file_stream)

        return await self.store_rous(extracted_rous, regulation.id)


RouServiceDep = Annotated[RouService, Depends(RouService)]

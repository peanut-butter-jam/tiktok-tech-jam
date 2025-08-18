import asyncio
from contextlib import asynccontextmanager
from typing import Annotated
from uuid import UUID
from fastapi import Depends, UploadFile
from storage3.types import UploadResponse

from app.dtos.file_object_dto import FileObjectDTO
from app.database.schemas.file_object import FileObject
from app.database.repositories.file_object_repository import (
    FileObjectRepositoryDep,
    file_object_repository_context,
)
from app.clients.supabase_client import AsyncSupabaseClientDep, supabase_client_context


class SupabaseStorageService:
    def __init__(
        self, supabase_client: AsyncSupabaseClientDep, file_object_repository: FileObjectRepositoryDep
    ):
        self.supabase_client = supabase_client
        self.file_object_repository = file_object_repository

    async def upload_file(self, bucket_name: str, file: UploadFile) -> FileObjectDTO:
        """Uploads a file to the specified Supabase storage bucket."""
        try:
            filename, content_type = (
                file.filename or "Untitled",
                file.content_type or "application/octet-stream",
            )
            bytes = await file.read()

            res: UploadResponse = await self.supabase_client.storage.from_(bucket_name).upload(
                filename, bytes, {"content-type": content_type}
            )

            inserted = await self.file_object_repository.create(
                FileObject(bucket_name=bucket_name, path=res.path)
            )
            return FileObjectDTO.model_validate(inserted)
        except Exception as e:
            raise Exception(f"Failed to upload file: {e}")

    async def upload_files(self, bucket_name: str, files: list[UploadFile]) -> list[FileObjectDTO]:
        file_objects = await asyncio.gather(*(self.upload_file(bucket_name, file) for file in files))

        return file_objects

    async def download_file(self, file_object_id: UUID) -> bytes:
        """Downloads a file from the specified Supabase storage bucket."""
        file_object: FileObject = await self.file_object_repository.get_one_by_id(file_object_id)
        if not file_object:
            raise LookupError(f"FileObject with ID {file_object_id} not found.")

        bytes = await self.supabase_client.storage.from_(file_object.bucket_name).download(
            file_object.path
        )
        return bytes

    async def get_signed_url(self, file_object_id: UUID) -> str:
        """Gets a signed URL for a file in the specified Supabase storage bucket."""
        file_object: FileObject = await self.file_object_repository.get_one_by_id(file_object_id)
        if not file_object:
            raise LookupError(f"FileObject with ID {file_object_id} not found.")

        res = await self.supabase_client.storage.from_(file_object.bucket_name).create_signed_url(
            file_object.path, expires_in=3600
        )
        return res["signedUrl"]


SupabaseStorageServiceDep = Annotated[SupabaseStorageService, Depends(SupabaseStorageService)]


@asynccontextmanager
async def supabase_storage_service_context():
    async with supabase_client_context() as supabase_client, file_object_repository_context() as file_object_repository:
        yield SupabaseStorageService(supabase_client, file_object_repository)

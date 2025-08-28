from typing import List, Optional
from langchain_core.tools import ArgsSchema, BaseTool
from pydantic import BaseModel, Field

from app.dtos.rou_dto import RouDto
from app.services.regulation.regulation_service import RegulationService


class QueryRousInput(BaseModel):
    query: str = Field(..., description="The query string to search for relevant ROUs.")


class QueryRousTool(BaseTool):
    name: str = "QueryROUsTool"
    description: str = "A tool to query regulation obligation units based on a specific query."
    args_schema: Optional[ArgsSchema] = QueryRousInput
    regulation_service: RegulationService

    def _run(self, query: str) -> List[RouDto]:
        raise NotImplementedError("Synchronous execution is not supported.")

    async def _arun(self, query: str) -> List[RouDto]:
        response = await self.regulation_service.query_relevant_rous(query)
        return response

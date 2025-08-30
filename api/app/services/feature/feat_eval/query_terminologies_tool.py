from typing import List, Optional
from langchain_core.tools import ArgsSchema, BaseTool
from pydantic import BaseModel, Field

from app.database.repositories.terminology_repository import TerminologyRepository


class QueryTerminologiesInput(BaseModel):
    key: str = Field(..., description="The short form/key to search for in the terminology database.")


class QueryTerminologiesTool(BaseTool):
    name: str = "QueryTerminologiesTool"
    description: str = "A tool to query terminology mappings from the database based on a short form/key."
    args_schema: Optional[ArgsSchema] = QueryTerminologiesInput
    terminology_repository: TerminologyRepository

    def _run(self, key: str) -> List[dict]:
        raise NotImplementedError("Synchronous execution is not supported.")

    async def _arun(self, key: str) -> List[dict]:
        """Query terminologies by key and return as simple dict for LLM"""
        terminologies = await self.terminology_repository.get_by_filter(key=key)
        
        # Return simple dict format for LLM consumption
        return [
            {
                "key": term.key,
                "value": term.value
            }
            for term in terminologies
        ]
from typing import Annotated, List
from fastapi import Depends
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config.app_config import OpenAIConfigDep
from app.dtos.extraction_result import DedupResult, ExtractedRouDto, ExtractionResult


class RouDedupModel:
    def __init__(self, openai_config: OpenAIConfigDep):
        self.dedup_model = ChatOpenAI(
            model="gpt-4o-mini", api_key=openai_config.api_key
        ).with_structured_output(DedupResult)
        self.system_prompt = """
You are an expert compliance analyst specializing in global geo-regulations.
You will be given multiple lists of Regulation Obligation Unit (ROU) records. Some may be duplicates or near-duplicates.

Your task: merge them into a single clean list.
- If two or more ROUs are duplicates or near-duplicates, keep only one.
- For duplicates, choose the clearest canonical_text.
- Merge and de-duplicate obligations (short imperative phrases).
"""

    def _build_prompts(self, rous_lists: List[List[ExtractedRouDto]]) -> List[BaseMessage]:
        """
        Build the input prompts for the LLM based on the context and sample data.

        Args:
            text (str): The regulation text to extract ROUs from.
        """
        instruction = f"Deduplicate and merge the following lists of ROUs:\n\n{rous_lists}"
        messages = [SystemMessage(content=self.system_prompt), HumanMessage(content=instruction)]

        return messages

    async def dedup(self, rous_lists: List[List[ExtractedRouDto]]) -> List[ExtractedRouDto]:
        """
        Extract ROUs from a text chunk.

        Args:
            chunk (str): The text chunk to extract ROUs from.

        Returns:
            List[ExtractedRouDto]: A list of extracted ROUs.
        """
        prompts = self._build_prompts(rous_lists)
        res = await self.dedup_model.ainvoke(prompts)

        res = DedupResult.model_validate(res) if res else None

        return res.rous if res else []


RouDedupModelDep = Annotated[RouDedupModel, Depends(RouDedupModel)]

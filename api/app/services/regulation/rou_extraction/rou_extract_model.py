from typing import Annotated, List
from fastapi import Depends
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config.app_config import OpenAIConfigDep
from app.dtos.extraction_result import ExtractedRouDto, ExtractionResult


class RouExtractModel:
    def __init__(self, openai_config: OpenAIConfigDep):
        self.extractor_model = ChatOpenAI(
            model="gpt-4o-mini", api_key=openai_config.api_key
        ).with_structured_output(ExtractionResult)
        self.system_prompt = """
You are an expert compliance analyst specializing in global geo-regulations.
Your task is to carefully read regulation text and extract a **list of Regulation Obligation Units (ROUs)**.

Scope limitation:
- Extract only those regulatory requirements that directly affect **product features**, user experience, data handling, or technical implementation.  
- Do NOT extract obligations related to corporate reporting, internal documentation, licensing, staffing, or financial disclosures unless they clearly impose requirements on the product itself.  

Each ROU must contain:
- canonical_text: the key regulatory requirement in concise form
- desc: a short human-friendly description of the ROU
- obligations: one or more **short imperative action phrases** that are directly implementable by engineering
- jurisdiction: the country or region this ROU applies to

Only extract **legal or regulatory requirements**.
If text is ambiguous, still extract but keep desc clear about uncertainty.
"""

    def _build_prompts(self, text: str) -> List[BaseMessage]:
        """
        Build the input prompts for the LLM based on the context and sample data.

        Args:
            text (str): The regulation text to extract ROUs from.
        """
        instruction = f"Extract all geo-regulatory ROUs from the following regulation text:\n\n{text}"
        messages = [SystemMessage(content=self.system_prompt), HumanMessage(content=instruction)]

        return messages

    async def extract(self, text: str) -> List[ExtractedRouDto]:
        """
        Extract ROUs from a text chunk.

        Args:
            chunk (str): The text chunk to extract ROUs from.

        Returns:
            List[ExtractedRouDto]: A list of extracted ROUs.
        """
        prompts = self._build_prompts(text)
        res = await self.extractor_model.ainvoke(prompts)

        res = ExtractionResult.model_validate(res) if res else None

        return res.rous if res else []


RouExtractModelDep = Annotated[RouExtractModel, Depends(RouExtractModel)]

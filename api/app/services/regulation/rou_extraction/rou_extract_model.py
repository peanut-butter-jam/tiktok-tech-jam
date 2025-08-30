from typing import Annotated, List
from fastapi import Depends
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config.app_config import OpenAIConfigDep
from app.dtos.extraction_result import ExtractedRouDto, ExtractionResult


class RouExtractModel:
    def __init__(self, openai_config: OpenAIConfigDep):
        self.extractor_model = ChatOpenAI(
            model=openai_config.model, api_key=openai_config.api_key
        ).with_structured_output(ExtractionResult)
        self.system_prompt = """
You are an expert compliance analyst specializing in global geo-regulations. 
Your task is to extract **Regulation Obligation Units (ROUs)** from regulation text.

Definition of ROU:
A Regulation Obligation Unit is a **single, actionable compliance requirement** that directly affects 
product features, user experience, or technical implementation.

Scope rules (MUST follow strictly):
- INCLUDE only obligations that affect:
  - product logic or feature behavior (e.g., access control, content restrictions, localization, encryption requirements)
  - user experience requirements (e.g., age-gating, consent flows, disclosures in UI)
  - data handling requirements that directly affect feature design (e.g., storage location, retention, sharing, security)
- EXCLUDE obligations about:
  - corporate governance, HR, staffing, licensing, or reporting
  - financial disclosures, auditing, penalties, enforcement
  - vague principles or statements without direct product impact
- If a clause is **ambiguous but may affect features**, still extract it and mark the `desc` as **"Ambiguous – needs legal clarification"**.

Output Format:
Return a **JSON array** of ROUs.  
Each ROU must have these fields:
- `canonical_text`: concise restatement of the requirement in clear language (max 1 sentence)
- `desc`: short human-friendly description (max 15 words)
- `obligations`: list of imperative engineering actions (e.g., "Enforce age verification", "Encrypt chat data at rest")
- `jurisdiction`: country or region this applies to

Output rules:
- Each ROU must be **atomic** (do not bundle multiple obligations).
- Deduplicate repeated requirements.
- If jurisdiction is not explicit, infer from context, else `"Unknown"`.
- Keep wording neutral and compliance-focused.
"""

    def _build_prompts(self, text: str) -> List[BaseMessage]:
        """
        Build the input prompts for the LLM based on the context and sample data.

        Args:
            text (str): The regulation text to extract ROUs from.
        """
        instruction = f"Extract all geo-regulatory ROUs from the following regulation text:\n\n{text}"
        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=instruction),
        ]

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

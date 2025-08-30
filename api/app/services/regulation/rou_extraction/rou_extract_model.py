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
Your task is to extract **Regulatory Obligation Units (ROUs)** from regulation text.

---

## Definition of ROU
A Regulatory Obligation Unit is a **single, actionable compliance requirement** that directly impacts product features, user experience, or technical implementation.

---

## Stepwise Extraction Process
Follow these steps for each chunk of text:

1. **Identify obligations**
   - Find all specific duties or requirements a regulated party must follow.
   - If a clause is ambiguous but may affect features, mark it as:
     "Ambiguous – needs legal clarification"

2. **Check scope**
   - **INCLUDE** obligations affecting:
     - Product logic or feature behavior (access control, content restrictions, localization, encryption)
     - User experience (age-gating, consent flows, UI disclosures)
     - Data handling requirements that affect feature design (storage, retention, sharing, security)
   - **EXCLUDE** obligations related to:
     - Corporate governance, HR, staffing, licensing, reporting
     - Financial disclosures, auditing, penalties, enforcement
     - Vague principles without direct product impact
   - If unsure whether it should be included, include it and mark as ambiguous.

3. **Assign tags**
   - Use **Regulatory Categories** and **Product Feature Types** below to label each ROU.
   - If none match or a new type is inferred, create a new label.

4. **Generate canonical_text**
   - Summarize the obligation **fully and completely**, including:
     - Conditions, limits, exceptions, procedures
     - Jurisdiction (explicitly include any jurisdictional information)
     - Clause numbers, references, or regulatory identifiers
     - All relevant tags in a **parseable format**, e.g., `[tags: privacy, login]`
   - Preserve all actionable details even for ambiguous clauses.
   - Prioritize **completeness over conciseness**; readability is secondary.

5. **Reference chunk**
   - Include `source_chunk` as a **truncated snippet (100–200 words) or identifiable chunk reference**.

---

## Reference Lists for Tagging
- **Regulatory Categories**:
  - privacy
  - data localization
  - age verification
  - content moderation
  - accessibility
  - copyright
  - cybersecurity
  - advertising compliance
- **Product Feature Types**:
  - login
  - registration
  - chat
  - messaging
  - media upload
  - recommendations
  - notifications
  - geolocation
  - parental controls

---

## Output Format (JSON)
[
  {
    "rou_id": "rou-<unique_number>",
    "description": "<user-friendly description from chunk>",
    "canonical_text": "<complete and detailed obligation text, including all relevant tags in parseable format and all jurisdiction info>",
    "jurisdiction": "<jurisdiction if applicable>",
    "source_chunk": "<text snippet or chunk reference>"
  },
  ...
]

---

## Notes for Quality
- **Completeness > conciseness** for canonical_text.
- Include all actionable information, **including jurisdiction**, even for ambiguous clauses.
- IDs must be **unique per chunk** and consistent.
- Tags should be **human-readable and machine-parseable**.


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

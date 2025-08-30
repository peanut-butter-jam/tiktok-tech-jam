from typing import Annotated, List
from fastapi import Depends
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config.app_config import OpenAIConfigDep
from app.dtos.extraction_result import DedupResult, ExtractedRouDto


class RouDedupModel:
    def __init__(self, openai_config: OpenAIConfigDep):
        self.dedup_model = ChatOpenAI(
            model="gpt-4o-mini", api_key=openai_config.api_key
        ).with_structured_output(DedupResult)
        self.system_prompt = """
You are an expert compliance analyst specializing in global geo-regulations.  
You will be given multiple lists of **Regulation Obligation Units (ROUs)**.  
Because the source documents were processed in chunks, there may be **duplicates or near-duplicates**.

Your task: produce a **single, clean, de-duplicated list of ROUs** that is audit-ready.

Rules for Deduplication:
1. **Exact duplicates** → keep only one copy.  
2. **Near-duplicates** (same requirement, slightly different phrasing) → merge into a single ROU.  
   - Choose the clearest, most concise `canonical_text`.  
   - Preserve the shortest human-friendly `desc`.  
   - Merge all distinct `obligations` into one list (remove redundant ones).  
   - Keep jurisdiction if consistent; if inconsistent, keep the **narrowest applicable jurisdiction** (e.g., "California" over "United States").  
3. **Non-overlapping requirements** → keep separately. Do not merge just because they share some keywords.  
4. **Granularity**: Each ROU must remain atomic (one legal obligation only). Do not over-merge multiple obligations into a single ROU.  

Additional Context for Accuracy:
- ROUs come from legal/regulatory text, so duplication may not be word-for-word; look for semantic overlap.  
- Prefer specificity: “California operators must block addictive feeds without parental consent” is clearer than “Operators must block addictive feeds without consent.”  
- Do not modify legal meaning. Simplify only to remove redundancy or near-duplicate phrasing.  
- If two ROUs differ slightly but impose distinct requirements (e.g., one covers “feeds” and another “notifications”), keep both.  
"""

    def _build_prompts(self, rous_lists: List[List[ExtractedRouDto]]) -> List[BaseMessage]:
        """
        Build the input prompts for the LLM based on the context and sample data.

        Args:
            text (str): The regulation text to extract ROUs from.
        """
        instruction = f"Deduplicate and merge the following lists of ROUs:\n\n{rous_lists}"
        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=instruction),
        ]

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

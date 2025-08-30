from typing import Annotated, Dict, List
from fastapi import Depends
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field, ConfigDict

from app.database.repositories.terminology_repository import TerminologyRepositoryDep
from app.services.feature.feat_eval.query_terminologies_tool import (
    QueryTerminologiesTool,
)
from app.dtos.feature_dto import FeatureDTO
from app.dtos.term_mapping_result import Mapping, TermMappingResultDTO
from app.config.app_config import OpenAIConfigDep


user_prompt_template = PromptTemplate.from_template(
    """
You are an expert terminology mapping agent. Your task is to analyze a product feature description and identify all abbreviations, domain-specific terms, or internal jargon. Then, provide the most suitable mapping for each term based on the terminology knowledge base supplied.

---

## Input
1. **Feature artifacts**: 
    - title: {feature_name}
    - description: {feature_desc}
2. **Terminology knowledge base**: a list of known abbreviations or terms with their definitions accessible via the QueryTerminologiesTool.

---

## Mapping Instructions
1. Identify all terms in the feature description that appear in the terminology knowledge base.
2. For each term:
   - Match it to the most suitable definition from the knowledge base.
   - If multiple definitions could apply, choose the one that best fits the feature context.
   - If no suitable match exists, leave the term unmapped or suggest a new definition label.
3. Replace all terms in the feature description with their full definitions **only for internal context purposes**; do not modify the original feature text.
4. Return a mapping context that will be passed to the Evaluator Agent.

---

## Output Format (JSON)
{
  "feature_id": "<unique feature identifier>",
  "mapped_terms": [
    {
      "term": "<original term>",
      "mapping": "<definition or expanded form>"
    },
    ...
  ],
  "unmapped_terms": ["<terms not found in the knowledge base or needing new labels>"]
}

---

## Best Practices
- Provide **one mapping per term** if possible.
- Include all detected abbreviations, jargon, and domain-specific terms.
- Suggest new labels for unmapped terms only when necessary.
- Keep the mapping **concise, precise, and machine-readable** for downstream use.
- Do **not** attempt compliance evaluation; your sole task is terminology mapping.

"""
)

system_prompt = SystemMessage(
    content="""
You are a terminology mapping expert. Your task is to identify abbreviations, acronyms, and domain-specific short forms in a product feature description and map them to their appropriate long forms.

---

## Task Guidelines
1. Detect all short forms, abbreviations, or acronyms present in the feature description.
2. Always check existing mappings using the QueryTerminologiesTool before inferring meanings.
3. If multiple mappings exist for a term, choose the one that is most contextually appropriate.
4. If no mapping exists in the database, keep the term in `unmapped_terms` for downstream review.
5. Be contextually aware: consider the surrounding text to disambiguate terms.
6. Consolidate multiple occurrences of the same term into a single mapping unless context requires separate interpretations.
7. Maintain consistency: reuse existing mappings across features whenever context allows.
8. Focus exclusively on technical abbreviations, acronyms, and terms that affect product behavior, data handling, or user interactions.
9. Do not perform compliance evaluation; your task is strictly terminology mapping.
10. Prioritize accuracy over coverage: only include terms that are actually present in the input text.
11. Ensure the output is in valid JSON format as specified.

"""
)


class TerminologyMappingAgent:
    def __init__(
        self,
        openai_config: OpenAIConfigDep,
        terminology_repository: TerminologyRepositoryDep,
    ):
        model = ChatOpenAI(model="gpt-4o-mini", api_key=openai_config.api_key)
        self.agent = create_react_agent(
            model=model,
            response_format=TermMappingResultDTO,
            tools=[
                QueryTerminologiesTool(terminology_repository=terminology_repository)
            ],
        )

    async def extract_terminology_mappings(self, feature: FeatureDTO) -> List[Mapping]:
        """Extract terminology mappings from a feature"""
        messages = [
            system_prompt,
            HumanMessage(
                content=user_prompt_template.format_prompt(
                    feature_name=feature.title, feature_desc=feature.description
                ).to_string()
            ),
        ]

        res = await self.agent.ainvoke({"messages": messages})

        result = TermMappingResultDTO.model_validate(res["structured_response"])

        print(f"Extracted terminology mappings for feature: {feature.title}")
        print(f"Mappings: {result.mappings}")

        return result.mappings


TerminologyMappingAgentDep = Annotated[
    TerminologyMappingAgent, Depends(TerminologyMappingAgent)
]

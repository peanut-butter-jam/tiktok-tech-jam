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
from app.dtos.term_mapping_result import TermMappingResultDTO
from app.config.app_config import OpenAIConfigDep


user_prompt_template = PromptTemplate.from_template(
    """
Analyze the following feature and identify all potential short forms (abbreviations, acronyms, etc.) that need terminology mapping:

Feature:
- Title: {feature_name}
- Description: {feature_desc}

Your task:
1. Extract all potential short forms from the feature title and description
2. For each short form, use the QueryTerminologiesTool to check if mappings exist in the database
3. If mappings exist, choose the most appropriate one based on context
4. If no mappings exist, infer the best possible meaning from context
5. Return a JSON object with key-value pairs (short form -> long form)

Focus on:
- Abbreviations (e.g., "DB" -> "Database")
- Acronyms (e.g., "API" -> "Application Programming Interface") 
- Technical terms that might have short forms
- Domain-specific terminology

Example output format:
{{
  "mappings": [
    {{"key": "AI", "value": "Artificial Intelligence"}},
    {{"key": "ML", "value": "Machine Learning"}},
    {{"key": "API", "value": "Application Programming Interface"}}
  ]
}}
"""
)

system_prompt = SystemMessage(
    content="""
You are a terminology mapping expert. Your job is to identify short forms in feature descriptions and map them to their appropriate long forms.

Guidelines:
1. Be contextually aware - the same short form might have different meanings in different contexts
2. Use the QueryTerminologiesTool to check existing mappings in the database
3. If multiple mappings exist for a short form, choose the most contextually appropriate one
4. If no database mapping exists, use your knowledge to infer the most likely meaning
5. Only include mappings that are actually present in the input text
6. Focus on technical terminology, abbreviations, and acronyms
7. Return results in the exact JSON format specified
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

    async def extract_terminology_mappings(self, feature: FeatureDTO) -> Dict[str, str]:
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

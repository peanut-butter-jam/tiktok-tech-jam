import asyncio
from contextlib import asynccontextmanager
from typing import Annotated, List
from fastapi import Depends
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, SystemMessage

from app.services.feature.feature_service import FeatureServiceDep, feature_service_context
from app.database.repositories.terminology_repository import (
    TerminologyRepositoryDep,
    terminology_repository_context,
)
from app.services.feature.feat_eval.query_terminologies_tool import (
    QueryTerminologiesTool,
)
from app.dtos.feature_dto import FeatureDTO, FeatureUpdateDTO
from app.dtos.term_mapping_result import Mapping, TermMappingResultDTO
from app.config.app_config import OpenAIConfigDep, get_app_config


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


class TermMappingAgent:
    def __init__(
        self,
        openai_config: OpenAIConfigDep,
        terminology_repository: TerminologyRepositoryDep,
        feature_service: FeatureServiceDep,
    ):
        model = ChatOpenAI(model="gpt-4o-mini", api_key=openai_config.api_key)
        self.agent = create_react_agent(
            model=model,
            response_format=TermMappingResultDTO,
            tools=[QueryTerminologiesTool(terminology_repository=terminology_repository)],
        )
        self.feature_service = feature_service

    async def ainvoke(self, feature: FeatureDTO) -> FeatureDTO:
        mappings = await self._generate_mappings(feature)

        updated_feature = await self.feature_service.update_feature(
            feature.id,
            FeatureUpdateDTO(
                title=feature.title, description=feature.description, terminologies=mappings
            ),
        )

        return updated_feature

    async def _generate_mappings(self, feature: FeatureDTO) -> List[Mapping]:
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
        res_dto = TermMappingResultDTO.model_validate(res["structured_response"])

        return res_dto.mappings


TermMappingAgentDep = Annotated[TermMappingAgent, Depends(TermMappingAgent)]


@asynccontextmanager
async def term_mapping_agent_context():
    """
    Context manager for TermMappingAgent.
    """
    async with feature_service_context() as feature_service, terminology_repository_context() as terminology_repository:
        yield TermMappingAgent(
            openai_config=get_app_config().openai,
            terminology_repository=terminology_repository,
            feature_service=feature_service,
        )

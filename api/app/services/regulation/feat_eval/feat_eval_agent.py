from typing import Annotated
from fastapi import Depends
from langchain_core.messages import SystemMessage
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage

from app.services.regulation.feat_eval.query_rous_tool import QueryRousTool
from app.services.regulation.regulation_service import RegulationServiceDep
from app.dtos.check import EvalResult
from app.config.app_config import FeatEvalConfigDep, OpenAIConfigDep
from app.dtos.feature_dto import FeatureDto

user_prompt_template = PromptTemplate.from_template(
    """
Evaluate the following feature for geo-specific compliance needs.

Feature:
- feature_name: {feature_name}
- feature_description: {feature_desc}
"""
)


class FeatEvalAgent:
    def __init__(
        self,
        openai_config: OpenAIConfigDep,
        regulation_service: RegulationServiceDep,
        feat_eval_config: FeatEvalConfigDep,
    ):
        model = ChatOpenAI(model="gpt-4o-mini", api_key=openai_config.api_key)
        self.agent = create_react_agent(
            model=model,
            response_format=EvalResult,
            tools=[QueryRousTool(regulation_service=regulation_service)],
        )
        self.system_prompt = feat_eval_config.system_prompt

    async def evaluate(self, feature: FeatureDto):
        messages = [
            self.system_prompt,
            HumanMessage(
                content=user_prompt_template.format_prompt(
                    feature_name=feature.name, feature_desc=feature.desc
                ).to_string()
            ),
        ]
        res = await self.agent.ainvoke({"messages": messages})
        return res["structured_response"]


FeatEvalAgentDep = Annotated[FeatEvalAgent, Depends(FeatEvalAgent)]

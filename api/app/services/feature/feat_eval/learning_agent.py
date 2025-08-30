from typing import Annotated
from fastapi import Depends
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from pydantic import BaseModel

from app.config.app_config import LearningAgentConfigDep, OpenAIConfigDep
from app.database.schemas.enums.agent_type import AgentType
from app.dtos.system_prompt_dto import SystemPromptVersionCreateDTO
from app.services.system_prompt.system_prompt_service import SystemPromptServiceDep


class LearningResultDTO(BaseModel):
    new_prompt: str
    patch_summary: str


class LearningAgent:
    def __init__(
        self,
        openai_config: OpenAIConfigDep,
        learning_agent_config: LearningAgentConfigDep,
        system_prompt_service: SystemPromptServiceDep,
    ):
        model = ChatOpenAI(model="gpt-4o-mini", api_key=openai_config.api_key)
        self.agent = create_react_agent(
            model=model, response_format=LearningResultDTO, tools=[], debug=True
        )
        self.config = learning_agent_config
        self.system_prompt_service = system_prompt_service

    async def ainvoke(
        self, agent_type: AgentType, input: str, agent_output: str, reconciled_output: str
    ):
        print("Invoking learning agent...")
        prompt_template = PromptTemplate.from_template(self.config.user_prompt_template)
        target_agent_prompt = await self.system_prompt_service.get_active_prompt_text(agent_type)

        messages = [
            SystemMessage(content=self.config.system_prompt),
            HumanMessage(
                content=prompt_template.format_prompt(
                    system_prompt=target_agent_prompt,
                    input=input,
                    agent_output=agent_output,
                    reconciled_output=reconciled_output,
                ).to_string()
            ),
        ]
        res = await self.agent.ainvoke({"messages": messages})

        learning_result = LearningResultDTO.model_validate(res["structured_response"])

        await self.system_prompt_service.patch_prompt(
            SystemPromptVersionCreateDTO(
                agent_type=agent_type,
                system_prompt=learning_result.new_prompt,
                patch_summary=learning_result.patch_summary,
            )
        )


LearningAgentDep = Annotated[LearningAgent, Depends(LearningAgent)]

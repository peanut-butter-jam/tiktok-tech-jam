from pydantic import BaseModel


class LearningAgentConfig(BaseModel):
    system_prompt: str
    user_prompt_template: str

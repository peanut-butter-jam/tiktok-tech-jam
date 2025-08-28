from pydantic import BaseModel


class FeatEvalConfig(BaseModel):
    system_prompt: str

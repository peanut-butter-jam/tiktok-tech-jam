from pydantic import BaseModel, SecretStr


class OpenAIConfig(BaseModel):
    model: str
    api_key: SecretStr

from pydantic import BaseModel, SecretStr


class OpenAIConfig(BaseModel):
    api_key: SecretStr

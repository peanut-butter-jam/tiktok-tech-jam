from pydantic import BaseModel, SecretStr


class SupabaseConfig(BaseModel):
    url: str
    jwt_secret: SecretStr
    anon_key: SecretStr
    service_role_key: SecretStr

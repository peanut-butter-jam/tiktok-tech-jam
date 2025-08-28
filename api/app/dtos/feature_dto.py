from pydantic import BaseModel


class FeatureDto(BaseModel):
    id: int
    name: str
    desc: str

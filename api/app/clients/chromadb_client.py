from typing import Annotated
import chromadb
from chromadb.api import ClientAPI
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction
from fastapi import Depends

from app.config.app_config import OpenAIConfigDep

ROU_COLLECTION_NAME = "regulatory_obligation_unit"


def get_chromadb_client(openai_config: OpenAIConfigDep):
    client = chromadb.PersistentClient()

    embedding_function = OpenAIEmbeddingFunction(
        api_key=openai_config.api_key.get_secret_value(), model_name="text-embedding-3-small"
    )

    client.get_or_create_collection(ROU_COLLECTION_NAME, embedding_function=embedding_function)

    return client


ChromaDbClientDep = Annotated[ClientAPI, Depends(get_chromadb_client)]

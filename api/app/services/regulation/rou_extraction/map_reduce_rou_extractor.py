import asyncio
import logging
import operator
from typing import Annotated, List
from fastapi import Depends
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pydantic import BaseModel
from langgraph.types import Send
from langgraph.graph import END, START, StateGraph

from app.services.regulation.rou_extraction.rou_deduplicate_model import RouDedupModelDep
from app.dtos.extraction_result import ExtractedRouDto
from app.services.regulation.rou_extraction.rou_extract_model import RouExtractModelDep


class OverallState(BaseModel):
    text: str
    # chunk list (created in map-start)
    chunks: list[str] = []
    # aggregator: each map node returns a list of ROU dicts and the graph will combine them via operator.add
    chunk_rous: Annotated[list[list[ExtractedRouDto]], operator.add] = []
    # final result
    final_rous: list[ExtractedRouDto] = []


class MapInputState(BaseModel):
    chunk: str


semaphore = asyncio.Semaphore(20)


class MapReduceRouExtractor:
    def __init__(self, rou_extractor_model: RouExtractModelDep, rou_dedup_model: RouDedupModelDep):
        self.text_splitter = RecursiveCharacterTextSplitter()
        self.map_model = rou_extractor_model
        self.reduce_model = rou_dedup_model

        # build a graph instance tied to this extractor
        self.compiled_graph = self._build_graph()

    def _build_graph(self):
        graph = StateGraph(OverallState)
        graph.add_node("generate_chunks", self.generate_chunks)
        graph.add_node("map_extract", self.map_extract)
        graph.add_node("reduce_rous", self.reduce_rous)

        graph.add_edge(START, "generate_chunks")
        graph.add_conditional_edges("generate_chunks", self.continue_to_map, ["map_extract"])
        graph.add_edge("map_extract", "reduce_rous")
        graph.add_edge("reduce_rous", END)

        return graph.compile()

    def generate_chunks(self, state: OverallState):
        chunks = self.text_splitter.split_text(state.text)
        print(f"Generated {len(chunks)} chunks")
        return {"chunks": chunks}

    def continue_to_map(self, state: OverallState):
        return [Send("map_extract", MapInputState(chunk=c)) for c in state.chunks]

    async def map_extract(self, state: MapInputState):
        async with semaphore:
            rous = await self.map_model.extract(state.chunk)
            print(f"Extracted {len(rous)} ROUs from chunk")
        return {"chunk_rous": [rous]}

    async def reduce_rous(self, state: OverallState):
        print(f"Reducing {len(state.chunk_rous)} ROUs")
        final_rous = await self.reduce_model.dedup(state.chunk_rous)
        print(f"Reduced to {len(final_rous)} final ROUs")
        return {"final_rous": final_rous}

    async def extract(self, text: str) -> List[ExtractedRouDto]:
        res = await self.compiled_graph.ainvoke(OverallState(text=text))
        return res["final_rous"]


MapReduceRouExtractorDep = Annotated[MapReduceRouExtractor, Depends(MapReduceRouExtractor)]

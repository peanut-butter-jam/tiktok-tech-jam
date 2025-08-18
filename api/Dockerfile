FROM ubuntu:latest AS base

# Install Python 3.12, curl and security updates
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y python3.12 python3-pip curl ca-certificates && \
    curl -LsSf https://astral.sh/uv/install.sh | sh

ENV PATH="/root/.local/bin/:$PATH"

WORKDIR /api

COPY pyproject.toml uv.lock ./

RUN uv sync --no-dev

COPY app/ app/
COPY config/ config/

CMD ["uv", "run", "fastapi", "run"]
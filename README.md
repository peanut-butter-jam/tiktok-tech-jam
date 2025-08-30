# Regulation Compliance System

This repository is a boilerplate codebase for a full-stack application using the following technologies:

-   React: A JavaScript library for building user interfaces.
-   Tailwind CSS: For styling the frontend.
-   FastAPI: A modern, fast (high-performance) web framework for building APIs with Python.
-   Pytest: For testing the FastAPI backend.
-   PostgreSQL: A powerful, open-source object-relational database system.
-   SQLAlchemy: For database ORM (Object Relational Mapping) in Python.
-   Alembic: For database migrations.
-   ESLint & Prettier: For code linting and formatting.
-   Docker: For containerizing the application and managing dependencies.

---

## Architecture

### Core Components

1. **Regulation Processing Engine** - Processes regulatory documents using advanced RAG techniques
2. **Feature Checking Pipeline** - Evaluates uploaded features against processed regulations
3. **Term Mapper Agent** - Extracts and contextualizes special terminology
4. **Evaluation Agent** - Performs compliance assessment against regulatory database
5. **Learning Agent** - Incorporates user feedback for continuous improvement

---

## How It Works

### 1. Regulation Processing

The system processes regulatory documents through a sophisticated pipeline:

```
Regulatory Document → Chunking → Map-Reduce Extraction → Embedding Storage
```

**Process Details:**

-   **Chunking**: Documents are split into overlapping chunks to preserve boundary context
-   **Map Task**: Each chunk is processed in parallel to extract regulatory facts
-   **Reduce Task**: Duplicate facts are identified and removed
-   **Storage**: Clean, unique facts are stored as embeddings for efficient retrieval

### 2. Feature Checking Pipeline

When a feature is uploaded, it triggers an automated checking process:

```
Feature Upload → Term Mapping → Regulation Query → Evaluation → Results
```

**Step-by-Step Process:**

#### Term Mapper Agent

-   Extracts special terminology from feature descriptions
-   Queries terminology database for context-appropriate explanations
-   Enriches feature understanding with regulatory context

#### Evaluation Agent

-   Searches regulatory database for relevant compliance requirements
-   Identifies potential violations or conflicts
-   Performs comprehensive compliance assessment

### 3. Results and Actions

The system provides structured output for each evaluation:

#### Result Format

```json
{
    "flag": "yes|no|unknown",
    "reasoning": "Detailed explanation of the assessment",
    "suggested_action": "Recommended next steps"
}
```

#### Result Types

**Compliant (`yes`)**

-   Feature meets all identified regulatory requirements
-   No violations detected
-   Ready for implementation

**Non-Compliant (`no`)**

-   Clear regulatory violations identified
-   Specific requirements cited
-   Modification recommendations provided

**Unclear (`unknown`)**

-   Insufficient information for definitive assessment
-   Additional context required
-   User input needed for re-evaluation

---

## User Interaction

### Handling Uncertain Results

When the system returns `unknown`:

1. **Review Suggestions**: Check recommended areas for clarification
2. **Update Description**: Provide additional feature details
3. **Clarify Terminology**: Refine technical terms used
4. **Re-run Check**: Click the rerun button for fresh evaluation

### Feedback and Learning

If you disagree with a result:

1. **Provide Feedback**: Submit your assessment and reasoning
2. **Learning Integration**: The system's learning agent processes your input
3. **Re-evaluation**: Run a new check with updated model understanding
4. **Continuous Improvement**: Your feedback helps improve future assessments

---

# Setup Guide

This project consists of three main components that need to be set up to run the application:

1. Frontend (React + Tailwind CSS)
2. Backend (FastAPI + SQLAlchemy + Alembic)
3. Database (Supabase/PostgreSQL)

**Recommended order: Database → Backend → Frontend**

### 1. Database (Supabase / PostgreSQL)

Prerequisites:

-   Node.js 18+ (https://nodejs.org/en/download/)
-   Docker Desktop (https://www.docker.com/products/docker-desktop/)

Steps:

1. Navigate to the supabase directory:
    ```
    cd /supabase
    ```
2. Install dependencies:
    ```
    npm install
    ```
3. Start Supabase locally:
    ```
    npx supabase start
    ```
4. After startup, the terminal will display database and API URLs. Copy them into .env.sample and rename it to .env under api/ folder:

    ```
    CORE__DATABASE_URL=[DB URL]
    SUPABASE__JWT_SECRET=[JWT secret]
    SUPABASE__URL=[API URL]
    SUPABASE__ANON_KEY=[anon key]
    SUPABASE__SERVICE_ROLE_KEY=[service_role key]
    OPENAI__API_KEY=[your OpenAI API key]
    ```

5. Open the Supabase Studio URL, navigate to Storage, and create a new bucket named regulations.

Official Setup Guide: https://supabase.com/docs/guides/cli

---

### 2. Backend (FastAPI + SQLAlchemy + Alembic)

Prerequisites:

-   Python 3.11+ (https://www.python.org/downloads/)
-   uv CLI installed (`pip install uv`)

Steps:

1. Navigate to the backend directory:
    ```
    cd /api
    ```
2. Create and activate a virtual environment, then install dependencies:
    ```
    uv sync
    ```
3. Run database migrations to initialize the schema:
   `  uv run alembic upgrade head`
   Official Guide: https://fastapi.tiangolo.com/tutorial/sql-databases/

---

### 3. Frontend (React + Tailwind CSS)

Prerequisites:

-   Node.js 18+ (https://nodejs.org/en/download/)

Steps:

1. Copy .env.sample and rename it to .env

1. Navigate to the frontend directory:
    ```
    cd /frontend
    ```
1. Install dependencies:
    ```
    npm install
    ```
1. Start the development server:
    ```
    npm run dev
    ```

Official Guides:

-   React Official Docs: https://reactjs.org/docs/getting-started.html
-   Tailwind CSS Setup: https://tailwindcss.com/docs/installation

---

### 4. Start the Full Application

Once the database is running and backend migrations are applied:

1. Start the backend in its virtual environment:
    ```
    uv run fastapi dev app/main.py
    ```
2. Start the frontend:
    ```
    cd /frontend
    npm run dev
    ```

The application should now be running locally and ready for testing.

Tip: Follow the setup order carefully (Database → Backend → Frontend) to avoid connection or migration errors.

---

5. Additional Notes

-   Make sure to add your own OpenAI API key in the .env file to enable AI-related features.
-   All core services (backend, frontend, database) must be running to fully test the system.

## User Workflow

### 1. Upload Regulation

1. Navigate to the **Regulation** page.
2. Click **Upload Regulation**.
3. Upload the regulation file.
4. Refresh the page and wait for extraction to complete.
    - The regulation is considered fully extracted when **ROUs are visible** under the regulation view.

---

### 2. Update Term Mapping

1. Navigate to the **Terminology** page.
2. Click **Bulk Upload**.
3. Upload the CSV file containing the term mappings.

---

### 3. Upload Feature

1. Navigate to the **Feature** page.
2. Click **Upload Feature**.
3. Choose one of the following:
    - Upload features **individually**, or
    - Upload features in **bulk** via CSV file.
4. Wait for the compliance check to complete.
5. Review the feature check results.
    - If flagged as **unknown**, provide additional context.
    - If you **disagree with the system’s flagging**, reconcile the result.

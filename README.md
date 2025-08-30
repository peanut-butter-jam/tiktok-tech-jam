# React-FastAPI-Postgres Boilerplate

This repository is a boilerplate codebase for a full-stack application using the following technologies:

- React: A JavaScript library for building user interfaces.
- Tailwind CSS: For styling the frontend.
- FastAPI: A modern, fast (high-performance) web framework for building APIs with Python.
- Pytest: For testing the FastAPI backend.
- PostgreSQL: A powerful, open-source object-relational database system.
- SQLAlchemy: For database ORM (Object Relational Mapping) in Python.
- Alembic: For database migrations.
- ESLint & Prettier: For code linting and formatting.
- Docker: For containerizing the application and managing dependencies.

---


# Setup Guide


This project consists of three main components that need to be set up to run the application:

1. Frontend (React + Tailwind CSS)  
2. Backend (FastAPI + SQLAlchemy + Alembic)  
3. Database (Supabase/PostgreSQL)

**Recommended order: Database → Backend → Frontend**

---

### 1. Database (Supabase / PostgreSQL)

Prerequisites:  
- Node.js 18+ (https://nodejs.org/en/download/)  
- Docker Desktop (https://www.docker.com/products/docker-desktop/)

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
4. After startup, the terminal will display database and API URLs. Copy them into .env.sample and rename it to .env:

    ```
   CORE__DATABASE_URL=[DB URL]  
   SUPABASE__JWT_SECRET=[JWT secret]  
   SUPABASE__URL=[API URL]  
   SUPABASE__ANON_KEY=[anon key]  
   SUPABASE__SERVICE_ROLE_KEY=[service_role key]  
   OPENAI__API_KEY=[your OpenAI API key]
    ```
5.  Open the Supabase Studio URL, navigate to Storage, and create a new bucket named regulations.


Official Setup Guide: https://supabase.com/docs/guides/cli

---

### 2. Backend (FastAPI + SQLAlchemy + Alembic)

Prerequisites:  
- Python 3.11+ (https://www.python.org/downloads/)  
- uv CLI installed (`pip install uv`)

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
    ```
   uv run alembic upgrade head
    ```
Official Guide: https://fastapi.tiangolo.com/tutorial/sql-databases/

---

### 3. Frontend (React + Tailwind CSS)

Prerequisites:  
- Node.js 18+ (https://nodejs.org/en/download/)

Steps:

1. Navigate to the frontend directory:
    ```
   cd /frontend
    ```
2. Install dependencies:
    ```
   npm install
    ```
3. Start the development server:
    ```
   npm run dev
    ```

Official Guides:  
- React Official Docs: https://reactjs.org/docs/getting-started.html  
- Tailwind CSS Setup: https://tailwindcss.com/docs/installation

---

4. Start the Full Application

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

- Make sure to add your own OpenAI API key in the .env file to enable AI-related features.  
- All core services (backend, frontend, database) must be running to fully test the system.  

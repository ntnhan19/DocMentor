# DocMentor Backend

The DocMentor backend is a FastAPI service responsible for authentication, document management, background document processing, Retrieval-Augmented Generation (RAG), AI document analysis, export features, and dashboard data.

## Responsibilities

- Provide REST APIs for the React frontend.
- Manage users, JWT authentication, and Google OAuth login.
- Store relational data in PostgreSQL through SQLAlchemy.
- Store uploaded source files in Supabase Storage.
- Extract text from PDF, DOCX, and TXT files.
- Split documents into chunks and generate Gemini embeddings.
- Store document vectors in Pinecone.
- Retrieve relevant chunks and generate grounded answers with Gemini.
- Stream generated answers to the client through Server-Sent Events.
- Persist query history, conversations, citations, and feedback.

## Technology Stack

- Python 3.10
- FastAPI 0.119
- Uvicorn
- Pydantic Settings
- SQLAlchemy 2
- Alembic
- PostgreSQL
- `python-jose`, Passlib, Argon2
- Google Generative AI / Gemini
- Pinecone
- LangChain Text Splitters
- PyMuPDF
- python-docx
- Supabase
- ReportLab, python-pptx, fpdf, openpyxl

## Directory Structure

```text
backend/
|-- app/
|   |-- main.py                     # FastAPI application, CORS, router registration
|   |-- config.py                   # Environment-based settings
|   |-- database.py                 # SQLAlchemy engine, session, and Base
|   |-- models/                     # SQLAlchemy ORM models
|   |   |-- user.py                 # User and UserRole
|   |   |-- document.py             # Document and Query
|   |   |-- conversation.py         # Conversations and document links
|   |   |-- folder.py               # Folders
|   |   |-- feedback.py             # Query feedback
|   |-- routers/                    # API route definitions
|   |-- schemas/                    # Pydantic request/response schemas
|   |-- services/                   # Business logic and external integrations
|   |-- utils/                      # Security, prompts, cache, helpers
|   |-- evulators/                  # RAG evaluator utilities
|-- alembic/                        # Database migrations
|-- scripts/                        # Maintenance and helper scripts
|-- requirements.txt
|-- run.py
|-- Procfile
|-- runtime.txt
```

## Installation

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

For macOS/Linux:

```bash
source venv/bin/activate
```

## Environment Variables

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://user:password@host:5432/docmentor

SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GEMINI_API_KEY=your-gemini-api-key

PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=docmentor
PINECONE_ENVIRONMENT=us-east-1

UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
ALLOWED_EXTENSIONS=.pdf,.docx,.txt

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
SUPABASE_BUCKET=documents

ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173
```

## Database

Apply migrations:

```bash
alembic upgrade head
```

Create a new migration:

```bash
alembic revision --autogenerate -m "describe change"
```

Rollback the latest migration:

```bash
alembic downgrade -1
```

## Running the API

```bash
python run.py
```

Alternatively:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Local URLs:

- API root: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health check: `http://localhost:8000/health`

## API Routers

| Router | Prefix | Description |
| --- | --- | --- |
| `auth.py` | `/auth` | Registration, login, Google OAuth, current user |
| `documents.py` | `/documents` | Upload, list, detail, update, delete, download/preview |
| `query.py` | `/query` | RAG Q&A, query history, query statistics, feedback |
| `analysis.py` | `/analysis` | Summaries, concepts, quizzes, PDF export |
| `conversations.py` | `/conversations` | Conversation CRUD and document association |
| `folders.py` | `/folders` | Folder CRUD |
| `user_dashboard.py` | `/user/dashboard` | User dashboard statistics |
| `analytics.py` | `/analytics` | Popular query analytics |
| `guest.py` | `/guest` | Demo documents, guest query, guest limits |

## Representative Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/google
GET  /auth/me
```

### Documents

```text
POST   /documents/upload
GET    /documents/
GET    /documents/stats
GET    /documents/{document_id}
PUT    /documents/{document_id}
GET    /documents/{document_id}/download
DELETE /documents/{document_id}
```

### Query and RAG

```text
POST   /query/
GET    /query/history
GET    /query/stats
GET    /query/{query_id}
POST   /query/feedback
GET    /query/{query_id}/feedback
DELETE /query/{query_id}
```

### Analysis

```text
POST /analysis/summary
POST /analysis/concepts
POST /analysis/quiz
POST /analysis/summary/export/pdf
POST /analysis/quiz/export/pdf
```

### User Dashboard

```text
GET /user/dashboard/stats
GET /user/dashboard/recent-documents
GET /user/dashboard/recent-queries
GET /user/dashboard/popular-queries
GET /user/dashboard/weekly-activity
GET /user/dashboard/document-distribution
GET /user/dashboard/processing-status
```

## Core Data Models

- `User`: email, password hash, display name, avatar, role, authentication provider, Google ID.
- `Document`: owner, title, file path, file type, file size, metadata, processing status, folder.
- `Query`: question, generated answer, sources, execution time, rating, conversation.
- `Conversation`: chat session and related documents.
- `Folder`: user-owned document folder.
- `Feedback`: rating and optional feedback text for a generated answer.

## Document Processing Pipeline

```text
Upload file
  -> store original file in Supabase Storage
  -> create Document record in PostgreSQL
  -> run process_document in a background task
  -> download file from URL or read local file
  -> extract text by file type
  -> split text into chunks with size 1000 and overlap 100
  -> generate Gemini embeddings
  -> store vectors in Pinecone
  -> update processing_status = completed
```

## RAG Pipeline

```text
POST /query/
  -> authenticate user with JWT
  -> verify that requested documents belong to the user
  -> trigger background processing for unprocessed documents when needed
  -> embed the user question
  -> search similar chunks in Pinecone
  -> filter by similarity score
  -> format retrieved chunks as context
  -> stream Gemini answer generation
  -> normalize citations
  -> persist Query and sources
  -> return final chunk with query_id, answer, and sources
```

## Testing and Utility Scripts

The current test files are executable service-check scripts:

```bash
python test_gemini.py
python test_gemini_embeddings.py
python test_pinecone.py
python test_rag_gemini.py
python test_processing.py
python test_analysis.py
python test_export.py
```

Utility scripts:

```bash
python recreate_pinecone_index.py
python reset_db.py
python fix_db.py
python check_models.py
python scripts/seed_queries.py
python scripts/add_doc_metadata_column.py
```

## Deployment

Render can run the service with the included `Procfile`:

```text
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

The `runtime.txt` file declares the Python runtime. All required environment variables must be configured in the deployment platform.

## Security Notes

- Do not commit `.env` files or API keys.
- Use a strong `SECRET_KEY` and separate values for development and production.
- CORS origins are configured in `app/main.py`.
- Document and query access should always be scoped by `user_id`.
- Google OAuth tokens are verified server-side.

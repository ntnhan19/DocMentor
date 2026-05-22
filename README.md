# DocMentor

## 🌟 About

DocMentor is a modern AI-powered document management and Q&A platform that leverages Retrieval-Augmented Generation (RAG) technology. Users can upload documents, ask natural-language questions, and receive AI-generated answers grounded in document content with precise citations.

### 🎯 Key Highlights
- **RAG-powered Q&A**: Get accurate, grounded answers backed by document sources
- **AI Analysis**: Auto-generate summaries, extract key concepts, and create interactive quizzes
- **Multi-role Support**: Student, Lecturer, and Admin roles with tailored interfaces
- **Guest Mode**: Try the demo without authentication
- **Export Features**: Export analysis results as PDF for sharing and documentation
- **Real-time Analytics**: Track document usage, query patterns, and user activity

### 📊 Technical Stack
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Backend**: FastAPI + PostgreSQL + SQLAlchemy
- **AI/ML**: Google Gemini (embeddings & generation)
- **Vector DB**: Pinecone (semantic search)
- **Storage**: Supabase
- **Deployment**: Vercel (frontend) + Render (backend)

### 🔗 Links
- **Live Demo**: https://doc-mentor-one.vercel.app
- **Backend API**: https://docmentor-backend.onrender.com (when deployed)

---

DocMentor is an AI-powered document assistant that helps users upload documents, ask natural-language questions, receive grounded answers with citations, generate summaries, extract key concepts, and create interactive quizzes. It combines modern full-stack development with cutting-edge AI capabilities.

The project is organized as a full-stack application:

- `backend/`: FastAPI REST API for authentication, document processing, RAG, AI analysis, storage integration, and analytics.
- `frontend/docmentor-fe/`: React + TypeScript + Vite application for guest users, authenticated users, and administrators.

## Team

This project is developed by a team of 3 members.

| Member | Role | Main Responsibilities |
| --- | --- | --- |
| Nguyen Tran Ngoc Han | Backend/RAG Engineer | FastAPI, Gemini, Pinecone, document processing, RAG pipeline |
| Luu Tran Thi Bich Luan | Frontend Engineer | React UI, chat interface, document management, dashboard, responsive design |
| Tu Minh Duc | Full-stack/Auth/QA Engineer | Authentication, database, analysis/export features, testing and integration |

## Key Features

- Email/password authentication and Google OAuth.
- Role-based users: `student`, `lecturer`, and `admin`.
- Guest mode for trying the application with demo documents.
- Upload support for PDF, DOCX, and TXT files.
- Configurable file upload limit, defaulting to 50 MB.
- Cloud file storage through Supabase Storage.
- Text extraction from PDF, DOCX, and TXT files.
- Document chunking, Gemini embeddings, and Pinecone vector storage.
- Retrieval-Augmented Generation (RAG) for document-based Q&A.
- Streaming AI responses through Server-Sent Events (SSE).
- Query history, citations, feedback, and response rating.
- Conversation management with create, rename, pin, and delete actions.
- Folder-based document organization.
- AI document analysis: summaries, key concepts, and quizzes.
- PDF export for generated summaries and quizzes.
- User dashboard with document, query, activity, and processing statistics.
- Admin dashboard and system-level analytics components.

## System Architecture

```text
Browser
  |
  | React 19 + TypeScript + Vite + Tailwind CSS
  v
Frontend: frontend/docmentor-fe
  |
  | HTTP / SSE
  v
Backend: FastAPI
  |
  |-- PostgreSQL: users, documents, queries, conversations, folders, feedback
  |-- Supabase Storage: uploaded source files
  |-- Pinecone: vectorized document chunks
  |-- Google Gemini: embeddings, answer generation, summaries, concepts, quizzes
```

## Technology Stack

### Backend

- Python 3.10
- FastAPI, Uvicorn, Pydantic Settings
- SQLAlchemy, Alembic, PostgreSQL
- JWT authentication with `python-jose`
- Argon2 password hashing
- Google Generative AI / Gemini
- Pinecone vector database
- LangChain Text Splitters
- PyMuPDF and python-docx
- Supabase Storage
- ReportLab, python-pptx, fpdf, openpyxl

### Frontend

- React 19
- TypeScript
- Vite with `rolldown-vite`
- React Router 7
- Tailwind CSS
- Axios and Fetch streaming
- TanStack Query
- Zustand
- React Hook Form and Zod
- Framer Motion
- Recharts
- React PDF / pdf.js and Mammoth
- Lucide React and React Icons

## Repository Structure

```text
DocMentor/
|-- README.md
|-- backend/
|   |-- app/
|   |   |-- main.py
|   |   |-- config.py
|   |   |-- database.py
|   |   |-- models/
|   |   |-- routers/
|   |   |-- schemas/
|   |   |-- services/
|   |   |-- utils/
|   |-- alembic/
|   |-- requirements.txt
|   |-- run.py
|   |-- Procfile
|   |-- runtime.txt
|   |-- README.md
|
|-- frontend/
|   |-- docmentor-fe/
|       |-- src/
|       |   |-- app/
|       |   |-- components/
|       |   |-- features/
|       |   |-- hooks/
|       |   |-- pages/
|       |   |-- routes/
|       |   |-- services/
|       |   |-- store/
|       |   |-- types/
|       |   |-- utils/
|       |-- package.json
|       |-- vite.config.ts
|       |-- vercel.json
|       |-- README.md
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Google Gemini API key
- Pinecone account and an index configured for 768-dimensional cosine similarity
- Supabase project and storage bucket

## Backend Setup

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

Create `backend/.env`:

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

Run database migrations and start the API:

```bash
alembic upgrade head
python run.py
```

Local backend URLs:

- API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health check: `http://localhost:8000/health`

## Frontend Setup

```bash
cd frontend/docmentor-fe
npm install
```

Create `frontend/docmentor-fe/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Start the development server:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` by default.

## Main Workflows

### Document Upload and Processing

```text
1. The user uploads a document from the frontend.
2. The backend validates file type and file size.
3. The original file is uploaded to Supabase Storage.
4. A Document record is created in PostgreSQL.
5. A background task downloads the file and extracts text.
6. The text is split into chunks with size 1000 and overlap 100.
7. Gemini generates embeddings for each chunk.
8. Pinecone stores vectors and metadata.
9. The Document record is marked as processed.
```

### RAG Question Answering

```text
1. The user selects documents and submits a question.
2. The backend verifies document ownership.
3. Gemini generates an embedding for the question.
4. Pinecone retrieves the most relevant chunks.
5. The backend formats the retrieved chunks as context.
6. Gemini generates a grounded answer.
7. The answer is streamed to the frontend through SSE.
8. Citations are normalized and attached to the response.
9. The query, answer, sources, and execution time are stored in PostgreSQL.
```

## API Overview

| Area | Representative Endpoints | Purpose |
| --- | --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/google`, `GET /auth/me` | Authentication and current user profile |
| Documents | `POST /documents/upload`, `GET /documents/`, `GET /documents/{id}`, `PUT /documents/{id}`, `DELETE /documents/{id}` | Document management |
| Query/RAG | `POST /query/`, `GET /query/history`, `GET /query/stats`, `POST /query/feedback` | Document Q&A and response feedback |
| Analysis | `POST /analysis/summary`, `POST /analysis/concepts`, `POST /analysis/quiz` | AI-powered document analysis |
| Export | `POST /analysis/summary/export/pdf`, `POST /analysis/quiz/export/pdf` | PDF export |
| Conversations | `GET /conversations/`, `POST /conversations/`, `PUT /conversations/{id}`, `DELETE /conversations/{id}` | Conversation management |
| Folders | `GET /folders/`, `POST /folders/`, `PUT /folders/{id}`, `DELETE /folders/{id}` | Folder management |
| Dashboard | `GET /user/dashboard/stats`, `GET /user/dashboard/weekly-activity`, `GET /user/dashboard/recent-documents` | User analytics |
| Guest | `GET /guest/demo-documents`, `POST /guest/query`, `GET /guest/limits` | Guest experience |
| System | `GET /`, `GET /health` | Service status |

## Common Commands

Backend:

```bash
cd backend
python run.py
alembic upgrade head
alembic revision --autogenerate -m "message"
python test_gemini.py
python test_pinecone.py
python test_rag_gemini.py
python test_analysis.py
```

Frontend:

```bash
cd frontend/docmentor-fe
npm run dev
npm run build
npm run preview
npm run lint
npm run type-check
```

## Deployment

The backend includes a `Procfile` suitable for Render:

```text
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

The backend also includes `runtime.txt` for the Python runtime. The frontend includes `vercel.json` for SPA routing on Vercel. Configure all required environment variables in the deployment platform.

## Development Notes

- Do not commit `.env` files, API keys, database URLs, or access tokens.
- The Pinecone index must match the embedding dimension used by Gemini. This project assumes 768 dimensions.
- CORS origins are configured in `backend/app/main.py`.
- Backend test files are service-check scripts rather than a single standardized pytest suite.
- Keep frontend API service definitions synchronized with backend route changes.

## Detailed Documentation

- Backend documentation: `backend/README.md`
- Frontend documentation: `frontend/docmentor-fe/README.md`

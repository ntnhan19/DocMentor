# 📚 DocMentor - AI-Powered Document Analysis & RAG Platform

> **Smart document processing with free AI stack** (Gemini + Pinecone)

## 🌟 Features

### 📄 Document Management
- ✅ Upload PDF, DOCX, TXT files
- ✅ Automatic chunking & embedding
- ✅ Background processing
- ✅ Version tracking

### 🤖 AI Analysis (Powered by Gemini)
- ✅ **Generate Summary** - Short/Medium/Long
- ✅ **Extract Key Concepts** - Auto detect important terms
- ✅ **Generate Quiz** - Easy/Medium/Hard difficulty
- ✅ **RAG-Based Q&A** - Chat with your documents

### 🔒 User Management
- ✅ Registration & Login (JWT auth)
- ✅ Role-based access control
- ✅ Document ownership

### 📊 Analytics
- ✅ Query history with filters
- ✅ Feedback rating system
- ✅ Performance metrics

---

## 🛠️ Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| **Frontend** | React 18 + TypeScript + Vite | Free |
| **Backend API** | FastAPI (Python) | Free |
| **Database** | PostgreSQL | Free (self-hosted) |
| **Vector DB** | Pinecone (Free tier) | Free ✅ |
| **LLM** | Google Gemini 2.5 Flash | Free ✅ |
| **Embeddings** | Gemini text-embedding-004 | Free ✅ |
| **Auth** | JWT + bcrypt | Free |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- PostgreSQL 12+
- Node.js 18+ (for frontend)
- API Keys: Gemini, Pinecone

### Backend Setup

#### 1. Clone & Setup
```bash
cd backend

# Create virtual environment
python -m venv venv_support
source venv_support/bin/activate  # Windows: venv_support\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### 2. Configure Environment
Create `.env` in `backend/`:
```env
DATABASE_URL=postgresql://postgres:21092004@localhost:5432/DocMentor
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

GEMINI_API_KEY=your-gemini-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=docmentor

ENVIRONMENT=development
```

#### 3. Initialize Database
```bash
alembic upgrade head
python recreate_pinecone_index.py
```

#### 4. Start Backend
```bash
# Option 1: Direct
python run.py

# Option 2: Uvicorn
uvicorn app.main:app --reload --port 8000

# Option 3: Batch script (Windows)
RUN_API.bat

# Option 4: Shell script (Linux/Mac)
./RUN_API.sh
```

**API is live at**: http://localhost:8000

### Frontend Setup

```bash
cd frontend/docmentor-fe

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Frontend is live at**: http://localhost:5173

---

## 📡 API Endpoints

### 🔐 Authentication
```
POST   /auth/register          - Create account
POST   /auth/login             - Login
GET    /auth/me                - Current user info
```

### 📂 Documents
```
POST   /documents/upload       - Upload file
GET    /documents/             - List documents
GET    /documents/{id}         - Get details
PUT    /documents/{id}         - Update title
DELETE /documents/{id}         - Delete document
GET    /documents/stats        - Statistics
```

### 💬 Query & RAG
```
POST   /query/                 - Ask question (RAG)
GET    /query/history          - Query history
GET    /query/{id}             - Query details
POST   /query/feedback         - Rate response
DELETE /query/{id}             - Delete query
GET    /query/stats            - Statistics
```

### 📊 Analysis
```
POST   /analysis/summary       - Generate summary
POST   /analysis/concepts      - Extract concepts
POST   /analysis/quiz          - Create quiz
```

### 🔧 Utilities
```
GET    /health                 - Health check
GET    /                       - API info
GET    /docs                   - Swagger UI
GET    /redoc                  - ReDoc
```

---

## 🧪 Testing with Postman

### 1. Import Collection
- File: `DocMentor_API.postman_collection.json`
- **Postman** → **File** → **Import**

### 2. Create Environment
- Name: `DocMentor Local`
- Variables:
  - `base_url`: `http://localhost:8000`
  - `token`: (auto-filled after login)

### 3. Test Flow
1. Health Check: `GET /health`
2. Register: `POST /auth/register`
3. Login: `POST /auth/login` (auto-saves token)
4. Upload: `POST /documents/upload`
5. Wait ~30s for processing
6. Analyze: `POST /analysis/summary`, etc.
7. Query: `POST /query/`

**📖 Detailed guide**: See `POSTMAN_TESTING_GUIDE.md` or `QUICK_START.md`

---

## 📂 Project Structure

```
DocMentor/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── config.py            # Settings
│   │   ├── database.py          # DB connection
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── routers/             # API endpoints
│   │   ├── services/            # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── document_service.py
│   │   │   ├── rag_service_gemini.py
│   │   │   ├── gemini_service.py
│   │   │   ├── embedding_service_gemini.py
│   │   │   └── analysis_service.py
│   │   └── utils/               # Helpers
│   ├── alembic/                 # DB migrations
│   ├── requirements.txt
│   ├── run.py
│   └── recreate_pinecone_index.py
│
├── frontend/
│   ├── docmentor-fe/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── store/
│   │   ├── package.json
│   │   └── vite.config.ts
│
├── POSTMAN_TESTING_GUIDE.md
├── QUICK_START.md
├── RUN_API.bat
├── RUN_API.sh
└── README.md
```

---

## 🔄 Request Flow Example

### Upload & Analyze Document
```
1. User: POST /documents/upload (PDF file)
   ↓
2. Server: Save file, create DB record (processed=false)
   ↓
3. Background Task: Extract text → Split chunks
   ↓
4. Create Embeddings: Generate 768D vectors (Gemini API)
   ↓
5. Store Embeddings: Upload to Pinecone
   ↓
6. Update Status: processed=true
   ↓
7. User: GET /documents/{id} → processed=true ✅
```

### Query with RAG
```
1. User: POST /query/ (question + document_ids)
   ↓
2. Embedding: Query → 768D vector (Gemini API)
   ↓
3. Search: Pinecone vector search (top 5 similar)
   ↓
4. Build Context: Concatenate top chunks
   ↓
5. Generate: Gemini generates answer with context
   ↓
6. Save: Store query + answer + feedback ready
   ↓
7. Response: Answer + sources + confidence score
```

---

## 🔑 Getting API Keys

### Gemini API
1. Go to https://ai.google.dev/
2. Click **Get API Key**
3. Create new API key
4. Copy & paste to `.env`

### Pinecone
1. Go to https://pinecone.io/
2. Sign up (free tier)
3. Create index: `docmentor` (768 dimensions, cosine)
4. Get API key
5. Copy & paste to `.env`

---

## 🐛 Troubleshooting

### "Connection refused"
- Check if server is running: `http://localhost:8000/health`
- Use `RUN_API.bat` or manual startup

### "401 Unauthorized"
- Login first: `POST /auth/login`
- Verify token is set in Authorization header

### "Document not processed"
- Wait 30-60 seconds after upload
- Check server logs for errors
- Verify GEMINI_API_KEY is correct

### "Gemini API Error"
- Check `GEMINI_API_KEY` in `.env`
- Visit https://ai.google.dev/ to verify quota

### "Database connection failed"
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Run: `alembic upgrade head`

---

## 📚 Documentation

- **Postman Guide**: `POSTMAN_TESTING_GUIDE.md` (Complete API reference)
- **Quick Start**: `QUICK_START.md` (5-minute tutorial)
- **Merge Report**: `MERGE_RESOLUTION_REPORT.md` (Architecture decisions)
- **Swagger UI**: http://localhost:8000/docs (Auto-generated)

---

## 🚀 Deployment

### Backend (Render.com)
```bash
# Push to GitHub
git add .
git commit -m "Deploy to Render"
git push origin main

# On Render:
# 1. New Web Service
# 2. Connect GitHub repo
# 3. Build command: pip install -r requirements.txt
# 4. Start command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel/Netlify)
```bash
# Deploy from GitHub
# 1. Import repo to Vercel
# 2. Set root directory: frontend/docmentor-fe
# 3. Run command: npm run build
# 4. Output: dist
```

---

## 📊 Performance

- **Document Processing**: ~30s for 50-page PDF
- **Query Response Time**: 1-3s (including embeddings)
- **Summary Generation**: 2-5s
- **Quiz Generation**: 3-8s
- **Concurrent Users**: 100+ (Pinecone free tier)

---

## 🔐 Security

- ✅ JWT authentication (HS256)
- ✅ Password hashing (Argon2)
- ✅ CORS protection
- ✅ Input validation (Pydantic)
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Rate limiting ready (add later)

---

## 📝 License

MIT License - See LICENSE file

---

## 👥 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📧 Support

For issues & questions:
- GitHub Issues: [Create issue](https://github.com/ntnhan19/DocMentor/issues)
- Email: ntnhan19@gmail.com

---

## 🎯 Roadmap

- [ ] Advanced filtering (by category, date range)
- [ ] Multi-language support
- [ ] Document collaboration
- [ ] Export to PDF/Word
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] API rate limiting
- [ ] Web socket for real-time updates

---

## 🙏 Acknowledgments

- FastAPI team for amazing framework
- Google for free Gemini API
- Pinecone for vector DB
- PostgreSQL for reliability
- React community

---

**Built with ❤️ for education and research**

Last Updated: November 2025

# 📚 DocMentor - AI-Powered Document Analysis & RAG Platform

> Smart document processing with free AI stack (Gemini + Pinecone)

## 🌟 Features

- 📄 **Document Management**: Upload PDF, DOCX, TXT with automatic processing
- 🤖 **AI Analysis**: Summary, Key Concepts, Quiz Generation (Gemini)
- 💬 **RAG Q&A**: Chat with your documents using semantic search
- 🔐 **Authentication**: JWT-based user management
- 📊 **Analytics**: Query history, feedback system, statistics

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- PostgreSQL 12+
- API Keys: [Gemini](https://ai.google.dev/), [Pinecone](https://pinecone.io/)

### Installation

```bash
# Clone repository
git clone https://github.com/ntnhan19/DocMentor.git
cd DocMentor/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Initialize database
alembic upgrade head

# Start server
python run.py
```

**API available at**: http://localhost:8000  
**Swagger Docs**: http://localhost:8000/docs

---

## 📡 API Endpoints

### Authentication
```
POST   /auth/register          # Create account
POST   /auth/login             # Login (get JWT token)
GET    /auth/me                # Current user info
```

### Documents
```
POST   /documents/upload       # Upload file
GET    /documents/             # List documents
GET    /documents/{id}         # Get details
DELETE /documents/{id}         # Delete document
```

### Query & RAG
```
POST   /query/                 # Ask question
GET    /query/history          # Query history
POST   /query/feedback         # Rate response
```

### Analysis
```
POST   /analysis/summary       # Generate summary
POST   /analysis/concepts      # Extract concepts
POST   /analysis/quiz          # Create quiz
```

---

## 🧪 Testing

### Using Postman
1. Import: `postman/DocMentor_API.postman_collection.json`
2. Create environment: `base_url = http://localhost:8000`
3. Test flow:
   - Register → Login → Upload → Analyze → Query

### Using Swagger UI
Visit http://localhost:8000/docs after starting server

---

## 🌐 Deployment

### Render.com (Recommended)

**Already deployed at**: https://docmentor-api.onrender.com

To redeploy:
```bash
git push origin main  # Auto-deploys via GitHub integration
```

**Environment variables** (set in Render dashboard):
```
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-key
PINECONE_API_KEY=your-key
PINECONE_INDEX_NAME=docmentor
ENVIRONMENT=production
```

---

## 🛠️ Tech Stack

| Component | Technology | Cost |
|-----------|-----------|------|
| Backend | FastAPI | Free |
| Database | PostgreSQL | Free |
| Vector DB | Pinecone | Free tier ✅ |
| LLM | Google Gemini | Free tier ✅ |
| Embeddings | Gemini 768D | Free tier ✅ |
| Auth | JWT + bcrypt | Free |

---

## 📂 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   ├── database.py          # DB connection
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── routers/             # API endpoints
│   ├── services/            # Business logic
│   └── utils/               # Helpers
├── alembic/                 # DB migrations
├── requirements.txt
└── Procfile                 # Render deployment
```

---

## 🔑 Getting API Keys

### Gemini API (FREE)
1. Visit https://ai.google.dev/
2. Click "Get API Key"
3. Copy to `.env`

### Pinecone (FREE)
1. Visit https://pinecone.io/
2. Sign up
3. Create index: `docmentor` (768 dimensions, cosine)
4. Copy API key to `.env`

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| Connection refused | Start server: `python run.py` |
| 401 Unauthorized | Login again, copy new token |
| Document not processed | Wait 30-60s, check logs |
| Gemini API Error | Verify `GEMINI_API_KEY` in `.env` |

---

## 📞 Support

- **Production API**: https://docmentor-api.onrender.com
- **Swagger Docs**: https://docmentor-api.onrender.com/docs
- **GitHub Issues**: [Create issue](https://github.com/ntnhan19/DocMentor/issues)
- **Email**: ngochanpt2018@gmail.com

---

## 📝 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

- FastAPI for the framework
- Google for free Gemini API
- Pinecone for vector database
- PostgreSQL for reliability

---

**Built with ❤️ for education and research**

Last Updated: November 2025
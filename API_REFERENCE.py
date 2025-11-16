#!/usr/bin/env python3
"""
DocMentor API - Quick Reference & Test Helper
Chạy script này để xem thông tin API và debugging tips
"""

def print_header():
    print("""
    ╔════════════════════════════════════════════════════════════════════════╗
    ║                                                                        ║
    ║               🚀 DocMentor API - Quick Reference v1.0                 ║
    ║                  AI-Powered Document Analysis & RAG                   ║
    ║                                                                        ║
    ╚════════════════════════════════════════════════════════════════════════╝
    """)

def print_startup():
    print("""
    ⚡ STARTUP - TỰ ĐỘNG SAU KHI CHẠY SERVER
    ═════════════════════════════════════════
    
    1. Database Migration
       └─ Alembic tự chạy nếu cần
    
    2. Database Connection Test
       └─ Server test kết nối DB
    
    3. Pinecone Index Check
       └─ Tự tạo nếu chưa có
    
    4. API Initialization
       └─ Load CORS, routers, services
    
    ✅ Ready when you see: "Uvicorn running on http://0.0.0.0:8000"
    """)

def print_endpoints():
    endpoints = {
        "🔐 Authentication": [
            ("POST", "/auth/register", "Đăng ký tài khoản mới"),
            ("POST", "/auth/login", "Đăng nhập (lấy token)"),
            ("GET", "/auth/me", "Thông tin user hiện tại"),
        ],
        "📂 Documents": [
            ("POST", "/documents/upload", "Upload PDF/DOCX/TXT"),
            ("GET", "/documents/", "Danh sách tài liệu (phân trang)"),
            ("GET", "/documents/{id}", "Chi tiết tài liệu"),
            ("PUT", "/documents/{id}", "Cập nhật tiêu đề"),
            ("DELETE", "/documents/{id}", "Xóa tài liệu"),
            ("GET", "/documents/stats", "Thống kê"),
        ],
        "💬 Query & RAG": [
            ("POST", "/query/", "Hỏi câu hỏi (Chat with Docs)"),
            ("GET", "/query/history", "Lịch sử hỏi (có filter)"),
            ("GET", "/query/{id}", "Chi tiết câu hỏi"),
            ("POST", "/query/feedback", "Đánh giá câu trả lời"),
            ("DELETE", "/query/{id}", "Xóa câu hỏi"),
            ("GET", "/query/stats", "Thống kê"),
        ],
        "📊 Analysis": [
            ("POST", "/analysis/summary", "Tóm tắt (short/medium/long)"),
            ("POST", "/analysis/concepts", "Trích xuất khái niệm"),
            ("POST", "/analysis/quiz", "Tạo trắc nghiệm"),
        ],
        "🔧 Utilities": [
            ("GET", "/health", "Kiểm tra sức khỏe"),
            ("GET", "/", "Thông tin API"),
            ("GET", "/docs", "Swagger UI"),
            ("GET", "/redoc", "ReDoc"),
        ],
    }
    
    print("\n📍 API ENDPOINTS")
    print("═" * 80)
    
    for category, endpoints_list in endpoints.items():
        print(f"\n{category}")
        print("─" * 80)
        for method, path, description in endpoints_list:
            method_color = {
                "GET": "🟢",
                "POST": "🔵",
                "PUT": "🟡",
                "DELETE": "🔴"
            }
            color = method_color.get(method, "⚪")
            print(f"  {color} {method:6s} {path:30s} → {description}")

def print_testing_steps():
    print("\n\n🧪 TESTING STEPS (Postman)")
    print("═" * 80)
    
    steps = [
        ("1️⃣", "Health Check", "GET http://localhost:8000/health", "✅ Kiểm tra server hoạt động"),
        ("2️⃣", "Register", "POST /auth/register", "✅ Tạo tài khoản"),
        ("3️⃣", "Login", "POST /auth/login", "✅ Lấy token (copy vào Postman)"),
        ("4️⃣", "Upload Doc", "POST /documents/upload", "✅ Upload file (chọn PDF/DOCX/TXT)"),
        ("5️⃣", "Wait", "⏳ 30-60 giây", "✅ Server xử lý document"),
        ("6️⃣", "Check Status", "GET /documents/{id}", "✅ Xem processed=true"),
        ("7️⃣", "Summary", "POST /analysis/summary", "✅ Tóm tắt tài liệu"),
        ("8️⃣", "Concepts", "POST /analysis/concepts", "✅ Trích xuất khái niệm"),
        ("9️⃣", "Quiz", "POST /analysis/quiz", "✅ Tạo câu hỏi"),
        ("🔟", "Query", "POST /query/", "✅ Hỏi câu hỏi (RAG)"),
    ]
    
    for number, name, request, result in steps:
        print(f"\n  {number} {name}")
        print(f"     Request: {request}")
        print(f"     {result}")

def print_quick_commands():
    print("\n\n⚡ QUICK COMMANDS")
    print("═" * 80)
    
    commands = {
        "🐍 Python": [
            ("Run Backend", "python run.py"),
            ("Activate venv", ".\\venv_support\\Scripts\\activate"),
            ("Install deps", "pip install -r requirements.txt"),
            ("Migrate DB", "alembic upgrade head"),
            ("Create Pinecone", "python recreate_pinecone_index.py"),
        ],
        "📦 Node.js": [
            ("Start Frontend", "cd frontend/docmentor-fe && npm run dev"),
            ("Build", "npm run build"),
            ("Install deps", "npm install"),
        ],
        "🗄️ Database": [
            ("Connect PG", "psql -U postgres -d DocMentor"),
            ("Check connection", "SELECT version();"),
        ],
        "🐳 Docker (Optional)": [
            ("Build image", "docker build -t docmentor:latest ."),
            ("Run container", "docker run -p 8000:8000 docmentor:latest"),
        ],
    }
    
    for category, cmd_list in commands.items():
        print(f"\n{category}")
        for name, cmd in cmd_list:
            print(f"  • {name:20s} → {cmd}")

def print_env_vars():
    print("\n\n🔑 ENVIRONMENT VARIABLES (.env)")
    print("═" * 80)
    
    env_vars = [
        ("DATABASE_URL", "postgresql://postgres:21092004@localhost:5432/DocMentor"),
        ("SECRET_KEY", "your-secret-key-at-least-32-characters"),
        ("GEMINI_API_KEY", "Get from https://ai.google.dev/"),
        ("PINECONE_API_KEY", "Get from https://pinecone.io/"),
        ("PINECONE_INDEX_NAME", "docmentor"),
        ("ENVIRONMENT", "development (or production)"),
    ]
    
    for var, value in env_vars:
        print(f"  {var:25s} = {value}")

def print_common_errors():
    print("\n\n🐛 COMMON ERRORS & SOLUTIONS")
    print("═" * 80)
    
    errors = {
        "Connection refused": [
            "❌ Backend not running",
            "✅ Solution: python run.py",
        ],
        "401 Unauthorized": [
            "❌ Token missing or invalid",
            "✅ Solution: Login again, copy token to Authorization header",
        ],
        "404 Not Found": [
            "❌ Document/Query ID doesn't exist",
            "✅ Solution: Check GET /documents/ for valid IDs",
        ],
        "Document not processed": [
            "❌ Server still processing or error occurred",
            "✅ Solution: Wait 30-60s, check server logs",
        ],
        "Gemini API Error": [
            "❌ API key wrong or quota exceeded",
            "✅ Solution: Check GEMINI_API_KEY in .env, get new key",
        ],
        "Database Error": [
            "❌ PostgreSQL not running or connection string wrong",
            "✅ Solution: Start PostgreSQL, verify DATABASE_URL",
        ],
    }
    
    for error, solutions in errors.items():
        print(f"\n  ❌ {error}")
        for solution in solutions:
            print(f"     {solution}")

def print_response_examples():
    print("\n\n✅ RESPONSE EXAMPLES")
    print("═" * 80)
    
    print("""
    1️⃣ LOGIN Response:
    {
      "access_token": "eyJhbGciOiJIUzI1NiI...",
      "token_type": "bearer",
      "user": {"id": 1, "email": "test@example.com"}
    }

    2️⃣ UPLOAD Response:
    {
      "id": 1,
      "title": "My Document",
      "file_type": "pdf",
      "processed": false
    }

    3️⃣ SUMMARY Response:
    {
      "document_id": 1,
      "summary": "Tài liệu này nói về...",
      "word_count": 150
    }

    4️⃣ QUIZ Response:
    {
      "questions": [
        {
          "question": "Câu hỏi?",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
          "correct": "A",
          "explanation": "..."
        }
      ]
    }

    5️⃣ QUERY (RAG) Response:
    {
      "query_id": 10,
      "answer": "Câu trả lời từ Gemini...",
      "sources": [
        {
          "document_id": 1,
          "document_title": "My Document",
          "similarity_score": 0.95,
          "text": "..."
        }
      ],
      "processing_time_ms": 2500
    }
    """)

def print_postman_setup():
    print("\n\n🔧 POSTMAN SETUP")
    print("═" * 80)
    print("""
    1. Import Collection:
       • File → Import
       • Select: DocMentor_API.postman_collection.json
    
    2. Create Environment:
       • Environments → Create New
       • Name: "DocMentor Local"
       • Variables:
         - base_url: http://localhost:8000
         - token: (empty, fills after login)
    
    3. Select Environment:
       • Top right: Choose "DocMentor Local"
    
    4. Use Variables in Requests:
       • {{base_url}} → http://localhost:8000
       • {{token}} → Your JWT token
       • {{document_id}} → ID from upload
       • {{query_id}} → ID from query
    
    5. Auto-Extract Token:
       • Go to "Login" request
       • Tests tab (already configured):
         var jsonData = pm.response.json();
         pm.environment.set("token", jsonData.access_token);
    
    6. Send Request:
       • Click "Send"
       • Check Status: 200, 201, etc.
    """)

def print_api_features():
    print("\n\n⭐ API FEATURES")
    print("═" * 80)
    print("""
    Document Analysis:
    ✅ Automatic chunking (1000 chars per chunk, 100 char overlap)
    ✅ Embedding generation (768D vectors - FREE via Gemini)
    ✅ Vector storage (Pinecone - FREE tier)
    ✅ Background processing (async tasks)
    
    AI Features:
    ✅ Summary (short 5 sentences, medium 1-2 paragraphs, long detailed)
    ✅ Key Concepts (auto extract 1-20 terms)
    ✅ Quiz Generation (easy/medium/hard, 1-20 questions)
    ✅ RAG Q&A (semantic search + Gemini generation)
    
    Query Management:
    ✅ Full history with timestamps
    ✅ Filter by date range, search text
    ✅ Sort by date/rating/relevance
    ✅ User feedback & ratings
    ✅ Processing time tracking
    ✅ Confidence scoring
    
    Security:
    ✅ JWT authentication
    ✅ Password hashing (Argon2)
    ✅ CORS protection
    ✅ Role-based access
    """)

def main():
    print_header()
    print_startup()
    print_endpoints()
    print_testing_steps()
    print_quick_commands()
    print_env_vars()
    print_common_errors()
    print_response_examples()
    print_postman_setup()
    print_api_features()
    
    print("\n\n" + "═" * 80)
    print("📖 For complete guide, see:")
    print("   • POSTMAN_TESTING_GUIDE.md - Full API reference")
    print("   • QUICK_START.md - Step-by-step tutorial")
    print("   • README_FULL.md - Complete documentation")
    print("   • http://localhost:8000/docs - Swagger UI (after starting server)")
    print("═" * 80)
    print("\n✨ Ready to test? Open Postman and import DocMentor_API.postman_collection.json!\n")

if __name__ == "__main__":
    main()

# 🧪 POSTMAN TESTING GUIDE - DocMentor API

## 📌 BƯỚC 1: KHỞI ĐỘNG SERVER

### Cách 1: Chạy trực tiếp
```bash
cd e:\DocMentor\backend
python run.py
```

### Cách 2: Qua environment
```bash
cd e:\DocMentor\backend
# Kích hoạt virtual environment
.\venv_support\Scripts\activate
# Chạy server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Lưu ý**: Nếu chưa cài requirements:
```bash
pip install -r requirements.txt
```

---

## 🔗 API BASE URL

### Local Development
```
http://localhost:8000
```

### Endpoints khả dụng:
- **Docs (Swagger)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

---

## 📋 POSTMAN COLLECTION

### Import Steps:
1. Mở Postman
2. **File** → **Import**
3. Chọn file `DocMentor_API.postman_collection.json` (xem phía dưới)
4. Click **Import**

---

## 🔐 AUTHENTICATION FLOW

### 1️⃣ REGISTER (Tạo tài khoản mới)

**Endpoint**: `POST /auth/register`

```json
{
  "email": "student@example.com",
  "password": "TestPassword123!",
  "full_name": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### 2️⃣ LOGIN (Đăng nhập)

**Endpoint**: `POST /auth/login`

```json
{
  "email": "student@example.com",
  "password": "TestPassword123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student",
    "avatar": null
  },
  "message": "Đăng nhập thành công!"
}
```

**📌 LƯU Ý**: Lưu lại **access_token** để dùng cho các request tiếp theo!

---

## 📂 DOCUMENT MANAGEMENT

### 3️⃣ UPLOAD DOCUMENT

**Endpoint**: `POST /documents/upload`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Body** (form-data):
- **file**: Chọn file (PDF, DOCX, TXT)
- **title**: Tên tài liệu (optional)

**Response** (201 Created):
```json
{
  "id": 1,
  "title": "My Document",
  "file_type": "pdf",
  "file_size": 524288,
  "processed": false,
  "created_at": "2025-11-16T10:00:00"
}
```

⏳ **Processing**: Server sẽ xử lý ở background. Kiểm tra `/documents/{id}` để xem trạng thái.

---

### 4️⃣ GET ALL DOCUMENTS

**Endpoint**: `GET /documents/`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Query Parameters**:
- `skip`: Số documents bỏ qua (default: 0)
- `limit`: Số documents trả về (default: 100, max: 100)
- `search`: Tìm kiếm theo tên (optional)

**Response** (200 OK):
```json
{
  "total": 2,
  "documents": [
    {
      "id": 1,
      "title": "My Document",
      "file_type": "pdf",
      "file_size": 524288,
      "processed": true,
      "created_at": "2025-11-16T10:00:00"
    }
  ]
}
```

---

### 5️⃣ GET DOCUMENT DETAIL

**Endpoint**: `GET /documents/{document_id}`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Example**:
```
GET /documents/1
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "My Document",
  "file_type": "pdf",
  "file_size": 524288,
  "processed": true,
  "created_at": "2025-11-16T10:00:00",
  "metadata": {
    "pages": 5,
    "chunks": 10
  }
}
```

---

### 6️⃣ UPDATE DOCUMENT

**Endpoint**: `PUT /documents/{document_id}`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Body**:
```json
{
  "title": "Updated Title"
}
```

---

### 7️⃣ DELETE DOCUMENT

**Endpoint**: `DELETE /documents/{document_id}`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Response** (204 No Content)

---

## 🔍 QUERY & RAG

### 8️⃣ QUERY DOCUMENTS (Chat with Documents)

**Endpoint**: `POST /query/`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Body**:
```json
{
  "query_text": "Machine learning là gì?",
  "document_ids": [1, 2],
  "max_results": 5
}
```

**Response** (200 OK):
```json
{
  "query_id": 10,
  "query_text": "Machine learning là gì?",
  "answer": "Machine learning là một nhánh của AI...",
  "sources": [
    {
      "document_id": 1,
      "document_title": "AI Basics",
      "page_number": 3,
      "similarity_score": 0.95,
      "text": "Machine learning (ML) là..."
    }
  ],
  "processing_time_ms": 2500,
  "confidence_score": 0.92,
  "created_at": "2025-11-16T10:00:00"
}
```

---

### 9️⃣ GET QUERY HISTORY

**Endpoint**: `GET /query/history`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Query Parameters**:
- `skip`: Số queries bỏ qua (default: 0)
- `limit`: Số queries trả về (default: 20, max: 100)
- `search`: Tìm kiếm câu hỏi (optional)
- `sort_by`: Sắp xếp theo (date/rating/relevance, default: date)
- `order`: Thứ tự (asc/desc, default: desc)
- `date_from`: Từ ngày (YYYY-MM-DD, optional)
- `date_to`: Đến ngày (YYYY-MM-DD, optional)

**Response** (200 OK):
```json
{
  "queries": [
    {
      "query_id": 10,
      "query_text": "Machine learning là gì?",
      "answer": "Machine learning là một nhánh của AI...",
      "sources": [...],
      "processing_time_ms": 2500,
      "confidence_score": 0.92,
      "created_at": "2025-11-16T10:00:00"
    }
  ],
  "total": 5
}
```

---

### 🔟 GET QUERY DETAIL

**Endpoint**: `GET /query/{query_id}`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
```

**Example**:
```
GET /query/10
```

---

### 1️⃣1️⃣ SUBMIT FEEDBACK

**Endpoint**: `POST /query/feedback`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Body**:
```json
{
  "query_id": 10,
  "rating": 5,
  "feedback_text": "Câu trả lời rất hữu ích!"
}
```

**Response** (200 OK):
```json
{
  "message": "Feedback submitted successfully"
}
```

---

### 1️⃣2️⃣ DELETE QUERY

**Endpoint**: `DELETE /query/{query_id}`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
```

---

## 📊 DOCUMENT ANALYSIS

### 1️⃣3️⃣ GENERATE SUMMARY

**Endpoint**: `POST /analysis/summary`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Body**:
```json
{
  "document_id": 1,
  "length": "medium"
}
```

**Valid lengths**: `short` | `medium` | `long`

**Response** (200 OK):
```json
{
  "document_id": 1,
  "document_title": "My Document",
  "summary": "Tài liệu này nói về...",
  "length": "medium",
  "word_count": 150,
  "created_at": "2025-11-16T10:00:00"
}
```

---

### 1️⃣4️⃣ EXTRACT KEY CONCEPTS

**Endpoint**: `POST /analysis/concepts`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Body**:
```json
{
  "document_id": 1,
  "max_concepts": 10
}
```

**Response** (200 OK):
```json
{
  "document_id": 1,
  "document_title": "My Document",
  "concepts": [
    "Machine Learning",
    "Artificial Intelligence",
    "Deep Learning",
    ...
  ],
  "count": 10
}
```

---

### 1️⃣5️⃣ GENERATE QUIZ

**Endpoint**: `POST /analysis/quiz`

**Headers**:
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

**Body**:
```json
{
  "document_id": 1,
  "num_questions": 5,
  "difficulty": "medium"
}
```

**Valid difficulties**: `easy` | `medium` | `hard`

**Response** (200 OK):
```json
{
  "document_id": 1,
  "document_title": "My Document",
  "questions": [
    {
      "question": "Machine learning là gì?",
      "options": [
        "A. Một nhánh của AI",
        "B. Một ngôn ngữ lập trình",
        "C. Một database",
        "D. Một hệ điều hành"
      ],
      "correct": "A",
      "explanation": "Machine learning (ML) là một nhánh của trí tuệ nhân tạo..."
    }
  ],
  "difficulty": "medium",
  "total_questions": 5
}
```

---

## 🛠️ UTILITY ENDPOINTS

### 1️⃣6️⃣ HEALTH CHECK (Không cần token)

**Endpoint**: `GET /health`

**Response** (200 OK):
```json
{
  "status": "healthy",
  "environment": "development",
  "ai": "Gemini 2.5 Flash"
}
```

---

### 1️⃣7️⃣ GET ROOT INFO (Không cần token)

**Endpoint**: `GET /`

**Response** (200 OK):
```json
{
  "message": "Welcome to DocMentor API",
  "version": "1.0.0",
  "status": "running",
  "docs": "/docs",
  "features": {
    "auth": "/auth",
    "documents": "/documents",
    "query": "/query (RAG with Gemini)",
    "analysis": "/analysis (Summary, Concepts, Quiz)"
  }
}
```

---

## ⚙️ POSTMAN SETUP

### Bước 1: Tạo Environment
1. Click **Environments** → **Create new**
2. Đặt tên: `DocMentor Local`
3. Thêm variable:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| `base_url` | `http://localhost:8000` | `http://localhost:8000` |
| `token` | `(empty)` | `(empty)` |

### Bước 2: Extract Token tự động
Sau login/register, thêm **Post-response Script**:

```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.access_token);
```

### Bước 3: Dùng token trong requests
Thêm header vào request:
```
Authorization: Bearer {{token}}
```

---

## 🐛 ERROR HANDLING

### Common Errors

| Status | Error | Giải pháp |
|--------|-------|----------|
| **401** | Unauthorized | Token hết hạn hoặc sai, đăng nhập lại |
| **404** | Not Found | Document/Query ID không tồn tại |
| **422** | Validation Error | Kiểm tra request body, thiếu field bắt buộc |
| **500** | Server Error | Kiểm tra logs backend, có thể API key Gemini sai |

---

## 📝 TESTING CHECKLIST

```
Authentication:
  ✅ Register user
  ✅ Login user
  ✅ Use token in requests

Documents:
  ✅ Upload PDF/DOCX/TXT
  ✅ List documents
  ✅ Get document detail
  ✅ Wait for processing
  ✅ Update document title
  ✅ Delete document

Query & RAG:
  ✅ Query with multiple documents
  ✅ Get query history
  ✅ Filter history by date/search
  ✅ Submit feedback
  ✅ Delete query

Analysis:
  ✅ Generate summary (short/medium/long)
  ✅ Extract concepts
  ✅ Generate quiz (easy/medium/hard)

Utilities:
  ✅ Health check
  ✅ Root info endpoint
```

---

## 🚀 QUICK START

```bash
# 1. Terminal 1: Khởi động server
cd e:\DocMentor\backend
python run.py

# 2. Terminal 2: Chạy tests
cd e:\DocMentor\backend
python test_analysis.py  # Test analysis features
python test_rag_gemini.py  # Test RAG

# 3. Postman: Import collection & test interactively
```

---

## 📞 ENVIRONMENT VARIABLES (`.env`)

Chắc chắn bạn có các biến này:

```env
DATABASE_URL=postgresql://postgres:21092004@localhost:5432/DocMentor
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=docmentor
ENVIRONMENT=development
```

---

✅ **Ready to test!** Mở Postman và bắt đầu! 🚀

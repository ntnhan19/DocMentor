# 🚀 QUICK START - CÁCH CHẠY POSTMAN TEST

## ⚡ CÁCH NHANH NHẤT (5 phút)

### 1. Khởi động Server
**Windows:**
```bash
# Double-click vào file
RUN_API.bat
```

**Linux/Mac:**
```bash
chmod +x RUN_API.sh
./RUN_API.sh
```

**Manual:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Mở Postman
- Tải Postman: https://www.postman.com/downloads/
- Import collection: `DocMentor_API.postman_collection.json`
- File → Import → Chọn file trên

### 3. Setup Environment
1. **Environments** → **Create new**
2. Đặt tên: `DocMentor Local`
3. Thêm variable:
   ```
   base_url: http://localhost:8000
   token: (empty - sẽ tự điền sau login)
   ```

---

## 📝 TESTING FLOW (Từng bước)

### ✅ BƯỚC 1: HEALTH CHECK
```
GET http://localhost:8000/health
```
**Expected**: 
```json
{"status": "healthy", "environment": "development", "ai": "Gemini 2.5 Flash"}
```

### ✅ BƯỚC 2: REGISTER TÀI KHOẢN
```
POST http://localhost:8000/auth/register
```
**Body**:
```json
{
  "email": "test@example.com",
  "password": "Test123!@",
  "full_name": "Test User"
}
```
**Copy token từ response!**

### ✅ BƯỚC 3: LOGIN
```
POST http://localhost:8000/auth/login
```
**Body**:
```json
{
  "email": "test@example.com",
  "password": "Test123!@"
}
```
**📌 Sau login, token tự được lưu vào Postman**

### ✅ BƯỚC 4: UPLOAD DOCUMENT
```
POST http://localhost:8000/documents/upload
Headers: Authorization: Bearer {{token}}
Body (form-data):
  - file: Chọn PDF/DOCX/TXT
  - title: "My Test Document"
```
**Copy document_id từ response!**
⏳ **Chờ 30 giây để server xử lý document**

### ✅ BƯỚC 5: KIỂM TRA DOCUMENT ĐÃ XỬ LÝ
```
GET http://localhost:8000/documents/{{document_id}}
Headers: Authorization: Bearer {{token}}
```
**Chờ khi `"processed": true`**

### ✅ BƯỚC 6: TEST ANALYSIS FEATURES

#### A. Generate Summary
```
POST http://localhost:8000/analysis/summary
Headers: Authorization: Bearer {{token}}
Body:
{
  "document_id": {{document_id}},
  "length": "medium"
}
```

#### B. Extract Concepts
```
POST http://localhost:8000/analysis/concepts
Headers: Authorization: Bearer {{token}}
Body:
{
  "document_id": {{document_id}},
  "max_concepts": 10
}
```

#### C. Generate Quiz
```
POST http://localhost:8000/analysis/quiz
Headers: Authorization: Bearer {{token}}
Body:
{
  "document_id": {{document_id}},
  "num_questions": 3,
  "difficulty": "medium"
}
```

### ✅ BƯỚC 7: TEST RAG (Query Documents)
```
POST http://localhost:8000/query/
Headers: Authorization: Bearer {{token}}
Body:
{
  "query_text": "Tài liệu này nói về cái gì?",
  "document_ids": [{{document_id}}],
  "max_results": 5
}
```
**Copy query_id từ response!**

### ✅ BƯỚC 8: TEST FEEDBACK
```
POST http://localhost:8000/query/feedback
Headers: Authorization: Bearer {{token}}
Body:
{
  "query_id": {{query_id}},
  "rating": 5,
  "feedback_text": "Great answer!"
}
```

### ✅ BƯỚC 9: GET QUERY HISTORY
```
GET http://localhost:8000/query/history?skip=0&limit=20
Headers: Authorization: Bearer {{token}}
```

---

## 🔗 ALL API ENDPOINTS

### Authentication
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `GET /auth/me` - Thông tin user hiện tại

### Documents
- `POST /documents/upload` - Upload tài liệu
- `GET /documents/` - Danh sách tài liệu
- `GET /documents/{id}` - Chi tiết tài liệu
- `PUT /documents/{id}` - Cập nhật tài liệu
- `DELETE /documents/{id}` - Xóa tài liệu
- `GET /documents/stats` - Thống kê

### Query & RAG
- `POST /query/` - Hỏi câu hỏi (RAG)
- `GET /query/history` - Lịch sử truy vấn
- `GET /query/{id}` - Chi tiết truy vấn
- `POST /query/feedback` - Đánh giá truy vấn
- `DELETE /query/{id}` - Xóa truy vấn
- `GET /query/stats` - Thống kê truy vấn

### Analysis
- `POST /analysis/summary` - Tóm tắt tài liệu
- `POST /analysis/concepts` - Trích xuất khái niệm
- `POST /analysis/quiz` - Tạo câu hỏi trắc nghiệm

### Utilities
- `GET /health` - Kiểm tra sức khỏe API
- `GET /` - Thông tin API

---

## 🐛 TROUBLESHOOTING

### ❌ "Connection refused" 
**Giải pháp**: Server chưa chạy
```bash
# Terminal mới, chạy:
python run.py
```

### ❌ "401 Unauthorized"
**Giải pháp**: Token hết hạn hoặc sai
```
1. Login lại: POST /auth/login
2. Copy token mới vào Postman
3. Retry request
```

### ❌ "404 Not Found" (Document)
**Giải pháp**: Document ID sai hoặc chưa upload
```
GET /documents/
```
Kiểm tra ID có tồn tại không

### ❌ "Document not processed yet"
**Giải pháp**: Chờ server xử lý
```
1. Upload document
2. Chờ 30-60 giây
3. Kiểm tra GET /documents/{id}
4. Khi processed=true, thì test analysis
```

### ❌ "Error from Gemini API"
**Giải pháp**: API key sai hoặc hết quota
```
1. Kiểm tra .env: GEMINI_API_KEY
2. Lấy key từ: https://ai.google.dev/
3. Paste vào .env
4. Restart server
```

### ❌ "Database error"
**Giải pháp**: PostgreSQL chưa chạy
```
1. Start PostgreSQL service
2. Kiểm tra DATABASE_URL trong .env
3. Chạy: alembic upgrade head
4. Restart server
```

---

## 📊 EXPECTED RESPONSES

### ✅ Login Success
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User",
    "role": "student"
  }
}
```

### ✅ Summary Response
```json
{
  "document_id": 1,
  "document_title": "My Test Document",
  "summary": "Tài liệu này nói về...",
  "length": "medium",
  "word_count": 150
}
```

### ✅ Quiz Response
```json
{
  "document_id": 1,
  "questions": [
    {
      "question": "Câu hỏi?",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct": "A",
      "explanation": "..."
    }
  ],
  "difficulty": "medium",
  "total_questions": 3
}
```

### ✅ Query Response
```json
{
  "query_id": 1,
  "query_text": "...",
  "answer": "Câu trả lời từ Gemini...",
  "sources": [
    {
      "document_id": 1,
      "document_title": "...",
      "similarity_score": 0.95,
      "text": "..."
    }
  ],
  "processing_time_ms": 2500,
  "confidence_score": 0.92
}
```

---

## 🎯 TESTING CHECKLIST

```
□ Health check
□ Register user
□ Login user
□ Upload document
□ Wait for processing
□ Generate summary (short/medium/long)
□ Extract concepts
□ Generate quiz (easy/medium/hard)
□ Query document (RAG)
□ Get query history
□ Submit feedback
□ Get query stats
□ Delete query
□ Delete document
```

---

## 💡 TIPS

1. **Auto-extract Token**: Sau login, token tự lưu vào Postman
2. **Use Variables**: Dùng `{{token}}`, `{{document_id}}` thay vì copy-paste
3. **Format JSON**: Nút `Ctrl+Shift+B` để format JSON response
4. **Pre-request Script**: Chạy JS trước request (ví dụ: logging)
5. **Tests Tab**: Viết tests để auto-validate responses

---

## 🚀 READY?

Mở Postman ngay và bắt đầu test! 🎉

**Có vấn đề?** Kiểm tra logs terminal ở backend để debug.

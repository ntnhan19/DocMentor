================================================================================
                    DEPLOY DOCMENTOR LÊN RENDER.COM
================================================================================

TÓMLƯỢC STEPS:
=============

1. ✅ Kiểm tra files (DONE - Procfile, requirements.txt, runtime.txt)
2. 📤 Push code lên GitHub
3. 🔗 Connect Render với GitHub repository
4. ⚙️ Tạo Web Service trên Render
5. 🔐 Configure environment variables
6. 🚀 Deploy & Test


BƯỚC 1️⃣: KIỂM TRA FILE CHUẨN BỊ
================================

✅ File cần có trong backend/

- Procfile                  (Create lệnh run cho Render)
- requirements.txt         (Dependencies)
- runtime.txt              (Python version 3.10.13)
- app/main.py              (FastAPI app)
- .env (development only - không commit lên)


BƯỚC 2️⃣: COMMIT & PUSH CODE LÊN GITHUB
=======================================

# Từ terminal, trong thư mục backend/

git config --global user.email "ngochanpt2018@gmail.com"
git config --global user.name "Ngoc Han"

# Add changes
git add .
git commit -m "feat: merge backend-support, add Procfile for Render deploy"

# Push lên main hoặc feature branch
git push origin main
# HOẶC nếu muốn push feature branch:
git push origin feature/backend-support

# Nếu lần đầu push, có thể cần:
git push -u origin main


BƯỚC 3️⃣: KẾT NỐI GITHUB VỚI RENDER
==================================

1. Truy cập: https://render.com
2. Sign up / Login (nếu chưa có)
3. Click: "New +" → "Web Service"
4. Select: "Build and deploy from a Git repository"
5. Click: "Connect account"
6. Authorize Render trên GitHub
7. Select repository: ntnhan19/DocMentor
8. Click "Connect"


BƯỚC 4️⃣: CẤU HÌNH WEB SERVICE
================================

Khi tạo Web Service, điền:

Name:                   docmentor-api
Environment:            Python 3
Region:                 Singapore (hoặc gần bạn)
Branch:                 main (hoặc feature/backend-support)
Build Command:          cd backend && pip install -r requirements.txt
Start Command:          cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000

⭐ IMPORTANT:
- Render sẽ tự nhận Procfile, không cần fill Start Command
- Chỉ cần điền Build Command


BƯỚC 5️⃣: CONFIGURE ENVIRONMENT VARIABLES
==========================================

Trên Render Web Service → Settings → Environment

Thêm các biến:

DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[dbname]
  ↓ Ví dụ:
  postgresql://postgres:21092004@localhost:5432/DocMentor
  (HOẶC dùng Render PostgreSQL)

SECRET_KEY=6b5d35ba13b6fde5540201affae1bf92edc78dbab45711f16ec680f725377412

GEMINI_API_KEY=AIzaSyC8iAfCiwf8NzqAVM_EqRbOd-oWZPLKStI

PINECONE_API_KEY=pcsk_3WXnvK_JyM9gD1YFZqukDFatD8TmX2GfydaPzfdPgXS9QouGPb9SkQcLaTJGijWhEB9wmT

PINECONE_INDEX_NAME=docmentor

ENVIRONMENT=production

⚠️ CRITICAL:
- Không commit .env file lên GitHub
- Thêm .env vào .gitignore
- Chỉ set environment variables trên Render Dashboard


DATABASE - 2 TÙY CHỌN
====================

Option A: PostgreSQL tại máy khác
  - DATABASE_URL=postgresql://user:pass@your-db-host:5432/DocMentor
  - Máy khác phải accessible từ Render IP

Option B: Render PostgreSQL (Recommended)
  - Tạo PostgreSQL database trên Render
  - Render tự generate DATABASE_URL
  - Secure, không phải configure firewall


BƯỚC 6️⃣: DEPLOY
================

1. Render sẽ auto-deploy khi bạn push code
2. Xem Logs trên Dashboard
3. URL sẽ là: https://docmentor-api.onrender.com
4. (Hoặc tùy theo name bạn đặt)


BƯỚC 7️⃣: TEST PRODUCTION
==========================

Sau khi deploy thành công:

1. Health Check:
   GET https://docmentor-api.onrender.com/health
   
2. Swagger Docs:
   https://docmentor-api.onrender.com/docs
   
3. Postman - Chỉnh environment:
   base_url = https://docmentor-api.onrender.com
   
4. Test endpoints:
   - POST /auth/register
   - POST /auth/login
   - POST /documents/upload
   - etc.


TROUBLESHOOTING
===============

❌ "500 Internal Server Error"
   → Check Render Logs → "View Logs"
   → Thường là Database connection issue
   → Fix: Kiểm tra DATABASE_URL

❌ "503 Service Unavailable"
   → API bị rate-limit hoặc crash
   → Fix: Xem logs, restart service

❌ "Connection timeout"
   → Database not accessible
   → Fix: Allow Render IP trong DB firewall

❌ "ModuleNotFoundError"
   → Package không cài
   → Fix: Kiểm tra requirements.txt

❌ "CORS Error"
   → Frontend URL không trong whitelist
   → Fix: Cập nhật CORS config trong main.py


RENDER PRICING
==============

Free Tier:
  ✅ Web Service: miễn phí (có spin-down sau 15 min inactive)
  ✅ PostgreSQL: 90 ngày free, 256MB
  ❌ Sau 90 ngày: $7/month

Pro:
  ✅ Web Service: $7/month
  ✅ PostgreSQL: $15/month
  ✅ Persistent uptime, auto-scaling


BƯỚC 8️⃣: AUTO-REDEPLOY
========================

Render auto-deploy khi:
  ✅ Push code lên GitHub (main branch)
  ✅ Có Procfile trong repository
  ✅ Environment variables đã set

Để update:
  1. Modify code locally
  2. git push origin main
  3. Render sẽ tự build & deploy
  4. Check Logs → "Deployed"


BƯỚC 9️⃣: CUSTOM DOMAIN (Optional)
==================================

Render tạo URL: https://docmentor-api.onrender.com

Để dùng domain riêng:
  1. Settings → Custom Domain
  2. Điền domain: api.example.com
  3. Add CNAME record tại DNS provider:
     CNAME → api.example.com → docmentor-api.onrender.com


TÓMLƯỢC - GIT COMMANDS
======================

# Setup git (first time only)
git config --global user.email "your@email.com"
git config --global user.name "Your Name"

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "feat: deploy to Render"

# Push (first time - set upstream)
git push -u origin main

# Push (after first time)
git push origin main

# Check git log
git log --oneline


CẤU TRÚC PROJECT RENDER
=======================

Repository:
  ├── backend/
  │   ├── Procfile          ← Render sẽ đọc
  │   ├── requirements.txt  ← Render sẽ cài
  │   ├── runtime.txt       ← Render sẽ dùng
  │   ├── app/
  │   │   ├── main.py
  │   │   ├── routers/
  │   │   ├── models/
  │   │   ├── services/
  │   │   └── ...
  │   └── .env              ← .gitignore (không push)
  ├── frontend/             ← (optional)
  └── .gitignore


QUICK CHECKLIST
===============

Before Deploy:
  ☑️ Procfile created
  ☑️ requirements.txt updated
  ☑️ runtime.txt correct (3.10.13)
  ☑️ Code tested locally
  ☑️ Database accessible
  ☑️ API keys ready

On Render:
  ☑️ GitHub connected
  ☑️ Repository selected
  ☑️ Environment variables set
  ☑️ Branch selected (main)

After Deploy:
  ☑️ Health check passes
  ☑️ Swagger docs accessible
  ☑️ Login works
  ☑️ Document upload works
  ☑️ Analysis endpoints work


SUPPORT & LOGS
==============

View Logs:
  1. Render Dashboard
  2. Select Web Service
  3. Click "Logs" button
  4. See real-time logs

Common Log Messages:
  ✅ "Build successful"
  ✅ "Deployed"
  ✅ "Uvicorn running"
  ❌ "Error during build"
  ❌ "Deployment failed"


NEXT STEPS
==========

1. Commit & push code:
   git add . && git commit -m "add Procfile" && git push origin main

2. Go to https://render.com → New Web Service

3. Select GitHub repository

4. Fill config (see BƯỚC 4️⃣)

5. Set environment variables (see BƯỚC 5️⃣)

6. Click "Create Web Service"

7. Wait 5-10 minutes for build

8. Test: https://docmentor-api.onrender.com/health


DONE! 🚀

Your API will be live at: https://docmentor-api.onrender.com
Update Postman base_url to use this URL

================================================================================

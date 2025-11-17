================================================================================
                    STEP-BY-STEP RENDER DEPLOYMENT
================================================================================

📍 CURRENT STATUS: ✅ Code pushed to GitHub

Next: Create PostgreSQL Database on Render


STEP 2: CREATE POSTGRESQL DATABASE ON RENDER.COM
================================================

1. Go to: https://render.com/dashboard
2. Click: "+ New" (top right)
3. Select: "PostgreSQL"

On the form, fill:
  Name:              DocMentor-DB
  Database:          docmentor
  User:              postgres (default)
  Region:            Singapore (or closest to you)
  PostgreSQL Version: 14 (or latest)
  
4. Click: "Create Database"

5. ⏳ Wait 5 minutes for database to provision

6. 📋 Copy the Internal Database URL (starts with postgresql://)
   Format: postgresql://user:password@hostname:5432/database
   
   ⚠️ IMPORTANT:
   - Keep this URL SECRET! (contains password)
   - You'll use this as DATABASE_URL on Web Service


STEP 3: CREATE WEB SERVICE ON RENDER.COM
=========================================

After PostgreSQL is ready:

1. Go to: https://render.com/dashboard
2. Click: "+ New" (top right)
3. Select: "Web Service"
4. Option: "Build and deploy from a Git repository"
5. Click: "Connect account" (authorize GitHub)
6. Select repository: ntnhan19/DocMentor
7. Click: "Connect"

Fill the form:

  Name:              docmentor-api
  Environment:       Python 3
  Region:            Singapore
  Branch:            feature/backend-support (or main)
  Build Command:     cd backend && pip install -r requirements.txt
  Start Command:     Leave empty (Render will use Procfile)
  
8. Click: "Create Web Service"

⏳ Wait for build to complete...


STEP 4: CONFIGURE ENVIRONMENT VARIABLES
========================================

After Web Service is created:

1. Go to: Settings (inside Web Service)
2. Scroll down: "Environment"
3. Click: "Add Environment Variable"

Add each variable:

✏️ DATABASE_URL
   Value: postgresql://postgres:[password]@[hostname]:5432/docmentor
   (Copy from PostgreSQL dashboard)

✏️ SECRET_KEY
   Value: 6b5d35ba13b6fde5540201affae1bf92edc78dbab45711f16ec680f725377412

✏️ GEMINI_API_KEY
   Value: AIzaSyC8iAfCiwf8NzqAVM_EqRbOd-oWZPLKStI

✏️ PINECONE_API_KEY
   Value: pcsk_3WXnvK_JyM9gD1YFZqukDFatD8TmX2GfydaPzfdPgXS9QouGPb9SkQcLaTJGijWhEB9wmT

✏️ PINECONE_INDEX_NAME
   Value: docmentor

✏️ ENVIRONMENT
   Value: production

✏️ ALGORITHM
   Value: HS256

✏️ ACCESS_TOKEN_EXPIRE_MINUTES
   Value: 30


STEP 5: DEPLOY
==============

After setting all environment variables:

1. Click: "Deploy" button (or "Manual Deploy")
2. ⏳ Wait 5-10 minutes for build & deploy
3. Watch the Logs for errors

Expected log messages:
  ✅ "Building application..."
  ✅ "Running pip install..."
  ✅ "Uvicorn running on 0.0.0.0:..."
  ✅ "Deployed"

If error:
  ❌ Check "Logs" tab
  ❌ Look for error messages
  ❌ Common issues: DATABASE_URL wrong, missing env vars


STEP 6: GET YOUR API URL
========================

After successful deployment:

1. Copy the URL from Render Dashboard
   Example: https://docmentor-api-xxxx.onrender.com

2. Test Health Check:
   GET https://docmentor-api-xxxx.onrender.com/health
   
   Expected response:
   {
     "status": "healthy",
     "environment": "production",
     "ai": "Gemini 2.5 Flash"
   }


STEP 7: UPDATE POSTMAN
======================

1. Open Postman
2. Create/Edit Environment: "DocMentor Production"
3. Set variables:
   - base_url = https://docmentor-api-xxxx.onrender.com
   - token = (empty, will fill after login)
4. Select this environment
5. Test endpoints with production URL


STEP 8: FULL TESTING FLOW
==========================

After Render deployment, test:

1. ✅ Health Check
   GET {{base_url}}/health

2. ✅ Register
   POST {{base_url}}/auth/register
   {
     "email": "test@example.com",
     "password": "Test123!@",
     "full_name": "Test User"
   }

3. ✅ Login
   POST {{base_url}}/auth/login
   {
     "email": "test@example.com",
     "password": "Test123!@"
   }
   → Copy access_token

4. ✅ Set Token in Postman environment
   Paste token to {{token}} variable

5. ✅ Upload Document
   POST {{base_url}}/documents/upload
   Headers: Authorization: Bearer {{token}}
   Body: form-data
     - file: (select PDF/DOCX)
     - title: "My Document"

6. ⏳ Wait 30-60 seconds

7. ✅ Get Summary
   POST {{base_url}}/analysis/summary
   Headers: Authorization: Bearer {{token}}
   {
     "document_id": 1,
     "length": "medium"
   }

8. ✅ Get Concepts
   POST {{base_url}}/analysis/concepts
   Headers: Authorization: Bearer {{token}}
   {
     "document_id": 1,
     "max_concepts": 10
   }

9. ✅ Generate Quiz
   POST {{base_url}}/analysis/quiz
   Headers: Authorization: Bearer {{token}}
   {
     "document_id": 1,
     "num_questions": 3,
     "difficulty": "medium"
   }

10. ✅ RAG Query
    POST {{base_url}}/query/
    Headers: Authorization: Bearer {{token}}
    {
      "query_text": "What is this document about?",
      "document_ids": [1],
      "max_results": 5
    }


TROUBLESHOOTING
===============

❌ "Build failed"
   → Check requirements.txt syntax
   → Check Python version (3.10.13)
   → View logs for details

❌ "500 Internal Server Error"
   → DATABASE_URL wrong or DB not accessible
   → Missing environment variables
   → Check Render Logs

❌ "Health check timeout"
   → API still booting (wait 2 min)
   → Database connection issue
   → Check environment variables

❌ "ModuleNotFoundError"
   → Package not in requirements.txt
   → Add to backend/requirements.txt
   → Redeploy (git push)


AUTO-REDEPLOY FUTURE UPDATES
=============================

After first deploy, any future changes:

1. Make code changes locally
2. Commit: git add . && git commit -m "message"
3. Push: git push origin feature/backend-support
4. Render automatically redeploys!


MONITORING & LOGS
=================

On Render Dashboard:

1. View Logs: Click "Logs" button
2. See real-time deployment status
3. Check error messages
4. Monitor memory/CPU usage

Common indicators:
  🟢 Green = All systems healthy
  🔴 Red = Error or crashed
  🟡 Yellow = Building/Deploying


PRODUCTION BEST PRACTICES
==========================

Now your API is live! Remember:

✅ Keep API keys secret (use env vars)
✅ Monitor logs for errors
✅ Set up monitoring/alerting
✅ Plan regular backups of database
✅ Test new features on localhost first
✅ Use version control (git) for all changes
✅ Document any manual steps for future deploys


USEFUL LINKS
============

Render Dashboard:     https://render.com/dashboard
PostgreSQL Docs:      https://www.postgresql.org/docs/
FastAPI Docs:         https://fastapi.tiangolo.com/
Your API Swagger:     https://docmentor-api-xxxx.onrender.com/docs
Your API ReDoc:       https://docmentor-api-xxxx.onrender.com/redoc


QUICK REFERENCE - API BASE URLS
================================

Local (Development):
  http://localhost:8000

Production (Render):
  https://docmentor-api-xxxx.onrender.com
  (Replace xxxx with your actual URL)


QUICK REFERENCE - GIT COMMANDS
===============================

Check status:
  git status

View committed changes:
  git log --oneline

Push updates:
  git add .
  git commit -m "message"
  git push origin feature/backend-support

Switch branch:
  git checkout main
  git checkout feature/backend-support


================================================================================
                        YOU'RE ALMOST DONE! 🚀
================================================================================

Follow the steps above to:
1. ✅ Create PostgreSQL on Render
2. ✅ Create Web Service on Render
3. ✅ Configure environment variables
4. ✅ Deploy
5. ✅ Test production API
6. ✅ Update Postman with production URL

Next: I'll help with each step!

================================================================================

import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API Key từ file .env của backend
load_dotenv('d:/DocMentor/backend/.env')
api_key = os.getenv('GEMINI_API_KEY')

genai.configure(api_key=api_key)

print("🔍 Đang kiểm tra danh sách Model hỗ trợ generateContent...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ Model: {m.name}")
except Exception as e:
    print(f"❌ Lỗi khi lấy danh sách model: {e}")

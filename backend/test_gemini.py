import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("🧪 Testing Gemini API...")
print(f"API Key: {os.getenv('GEMINI_API_KEY')[:20]}...")

try:
    # Test text generation
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content("Giải thích ngắn gọn: Machine Learning là gì?")
    
    print("\n✅ Gemini API working!")
    print(f"\nResponse:\n{response.text}")
    
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
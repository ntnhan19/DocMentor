import requests

BASE_URL = "http://localhost:8000"

print("="*60)
print("🧪 TESTING RAG WITH GEMINI")
print("="*60)

# 1. Login
print("\n1️⃣ Login...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={
        "email": "ngochanpt2018@gmail.com",
        "password": "ngochan1801" 
    }
)

token = login_response.json()["token"]
headers = {"Authorization": f"Bearer {token}"}
print("✅ Logged in")

# 2. Get documents
docs_response = requests.get(f"{BASE_URL}/documents/", headers=headers)
documents = [doc for doc in docs_response.json()['documents'] if doc['processed']]

print(f"\n2️⃣ Found {len(documents)} processed documents")

# 3. Query
print("\n3️⃣ Querying with Gemini...")
query_response = requests.post(
    f"{BASE_URL}/query/",
    headers=headers,
    json={
        "query_text": "Machine learning là gì?",
        "document_ids": [doc['id'] for doc in documents],
        "max_results": 3
    }
)

result = query_response.json()

print(f"\n📝 ANSWER (by Gemini):")
print("="*60)
print(result['answer'])
print("="*60)

print(f"\n📚 Sources: {len(result['sources'])}")
print(f"⚡ Time: {result['processing_time_ms']}ms")
print(f"📊 Confidence: {result['confidence_score']:.1%}")

print("\n✅ TEST COMPLETE!")
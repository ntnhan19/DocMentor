import requests

BASE_URL = "http://localhost:8000"

print("="*60)
print("🧪 TESTING FULL RAG FLOW WITH GEMINI 2.5 FLASH")
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

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.text}")
    exit()

token = login_response.json()["token"]
headers = {"Authorization": f"Bearer {token}"}
print("✅ Logged in")

# 2. Get documents
print("\n2️⃣ Getting documents...")
docs_response = requests.get(f"{BASE_URL}/documents/", headers=headers)
documents = [doc for doc in docs_response.json()['documents'] if doc['processed']]

print(f"✅ Found {len(documents)} processed documents:")
for doc in documents:
    print(f"   • ID: {doc['id']}, Title: {doc['title']}")

if not documents:
    print("❌ No processed documents. Upload one first!")
    exit()

# 3. Test multiple queries
queries = [
    "Machine learning là gì?",
    "Giải thích supervised learning",
    "Kể tên các thuật toán machine learning",
]

for i, query_text in enumerate(queries, 1):
    print(f"\n{'='*60}")
    print(f"Query {i}: {query_text}")
    print('='*60)
    
    query_response = requests.post(
        f"{BASE_URL}/query/",
        headers=headers,
        json={
            "query_text": query_text,
            "document_ids": [doc['id'] for doc in documents],
            "max_results": 3
        }
    )
    
    if query_response.status_code == 200:
        result = query_response.json()
        
        print(f"\n🤖 AI ANSWER (by Gemini 2.5 Flash):")
        print("-" * 60)
        print(result['answer'])
        print("-" * 60)
        
        print(f"\n📚 Sources: {len(result['sources'])} chunks")
        for idx, source in enumerate(result['sources'], 1):
            print(f"  {idx}. {source['document_title']} - Score: {source['similarity_score']:.1%}")
        
        print(f"\n⚡ Processing time: {result['processing_time_ms']}ms")
        print(f"📊 Confidence: {result['confidence_score']:.1%}")
    else:
        print(f"❌ Error: {query_response.text}")

print("\n" + "="*60)
print("✅ ALL TESTS COMPLETED!")
print("="*60)
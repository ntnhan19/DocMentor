import requests

BASE_URL = "http://localhost:8000"

print("="*60)
print("🧪 TESTING DOCUMENT ANALYSIS FEATURES")
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

if not documents:
    print("❌ No processed documents!")
    exit()

doc = documents[0]
print(f"✅ Using document: {doc['title']} (ID: {doc['id']})")

# 3. Test Summary
print(f"\n{'='*60}")
print("3️⃣ TESTING SUMMARY")
print('='*60)

for length in ['short', 'medium', 'long']:
    print(f"\n📝 Generating {length} summary...")
    
    summary_response = requests.post(
        f"{BASE_URL}/analysis/summary",
        headers=headers,
        json={
            "document_id": doc['id'],
            "length": length
        }
    )
    
    if summary_response.status_code == 200:
        result = summary_response.json()
        print(f"✅ Summary generated ({result['word_count']} words)")
        print(f"\n{result['summary'][:200]}...\n")
    else:
        print(f"❌ Error: {summary_response.text}")

# 4. Test Concepts
print(f"\n{'='*60}")
print("4️⃣ TESTING KEY CONCEPTS EXTRACTION")
print('='*60)

concepts_response = requests.post(
    f"{BASE_URL}/analysis/concepts",
    headers=headers,
    json={
        "document_id": doc['id'],
        "max_concepts": 10
    }
)

if concepts_response.status_code == 200:
    result = concepts_response.json()
    print(f"✅ Extracted {result['count']} concepts:")
    for i, concept in enumerate(result['concepts'], 1):
        print(f"  {i}. {concept}")
else:
    print(f"❌ Error: {concepts_response.text}")

# 5. Test Quiz
print(f"\n{'='*60}")
print("5️⃣ TESTING QUIZ GENERATION")
print('='*60)

quiz_response = requests.post(
    f"{BASE_URL}/analysis/quiz",
    headers=headers,
    json={
        "document_id": doc['id'],
        "num_questions": 3,
        "difficulty": "medium"
    }
)

if quiz_response.status_code == 200:
    result = quiz_response.json()
    print(f"✅ Generated {result['total_questions']} questions\n")
    
    for i, q in enumerate(result['questions'], 1):
        print(f"❓ Question {i}: {q['question']}")
        for opt in q['options']:
            print(f"   {opt}")
        print(f"   ✅ Correct: {q['correct']}")
        print(f"   💡 {q['explanation']}\n")
else:
    print(f"❌ Error: {quiz_response.text}")

print("="*60)
print("✅ ALL TESTS COMPLETED!")
print("="*60)
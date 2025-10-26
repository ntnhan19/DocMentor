import requests
import time

BASE_URL = "http://localhost:8000"

# 1. Login
print("1. Logging in...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={
        "email": "ngochanpt2018@gmail.com",
        "password": "ngochan1801"
    }
)
print("Login response status:", login_response.status_code)
print("Login response body:", login_response.text)
token = login_response.json()["token"]
headers = {"Authorization": f"Bearer {token}"}

# 2. Upload a test document
print("\n2. Uploading test document...")
with open('test_document.txt', 'w', encoding='utf-8') as f:
    f.write("""
Machine Learning là gì?

Machine Learning (Học máy) là một nhánh của trí tuệ nhân tạo (AI) cho phép 
máy tính học từ dữ liệu và cải thiện hiệu suất của chúng mà không cần được 
lập trình rõ ràng.

Các loại Machine Learning:

1. Supervised Learning (Học có giám sát)
Trong supervised learning, mô hình được huấn luyện trên dữ liệu có nhãn.
Ví dụ: Phân loại email spam, dự đoán giá nhà.

2. Unsupervised Learning (Học không giám sát)
Mô hình tìm ra các patterns trong dữ liệu không có nhãn.
Ví dụ: Phân cụm khách hàng, giảm chiều dữ liệu.

3. Reinforcement Learning (Học tăng cường)
Agent học thông qua tương tác với môi trường và nhận phản hồi.
Ví dụ: Game AI, robot tự động.

Thuật toán phổ biến:
- Linear Regression
- Decision Trees
- Neural Networks
- K-Means Clustering
""")

files = {'file': ('test_document.txt', open('test_document.txt', 'rb'), 'text/plain')}
upload_response = requests.post(
    f"{BASE_URL}/documents/upload",
    headers=headers,
    files=files
)

response_json = upload_response.json()
print("Upload response:", response_json)
if upload_response.status_code != 201:
    print(f"Lỗi: Upload không thành công. Server nói: {response_json.get('detail')}")
    
    # Bạn có thể dừng test ở đây
    raise Exception("Không thể tiếp tục test vì upload file thất bại.")
    # HOẶC: Nếu lỗi là "đã tồn tại", bạn có thể bỏ qua và tiếp tục
    # (Nhưng cách đơn giản nhất là báo lỗi và dừng lại)

# Chỉ lấy ID nếu upload thành công
document_id = response_json['document']['id']

# 3. Wait for processing
print(f"\n3. Waiting for document {document_id} to be processed...")
for i in range(30):  # Wait max 30 seconds
    time.sleep(1)
    doc_response = requests.get(
        f"{BASE_URL}/documents/{document_id}",
        headers=headers
    )
    doc = doc_response.json()
    
    if doc['processed']:
        print(f"✅ Document processed! Total chunks: {doc['metadata_'].get('total_chunks')}")
        break
    else:
        print(f"⏳ Still processing... ({i+1}s)")

# 4. Check Pinecone
print("\n4. Checking Pinecone...")
from pinecone import Pinecone
from app.config import settings

pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX_NAME)
stats = index.describe_index_stats()
print(f"Total vectors in Pinecone: {stats.total_vector_count}")

print("\n✅ Test completed!")
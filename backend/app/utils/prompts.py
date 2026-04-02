"""
Enhanced Prompt templates for Gemini AI
Optimized for Vietnamese language with SMART citations (reduced redundancy)
"""

# ============================================================================
# SYSTEM INSTRUCTION - Enhanced Version with Smart Citations
# ============================================================================
SYSTEM_INSTRUCTION = """Bạn là trợ lý AI thông minh của DocMentor, chuyên hỗ trợ sinh viên và giảng viên.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 NHIỆM VỤ CHÍNH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Trả lời câu hỏi dựa HOÀN TOÀN trên ngữ cảnh được cung cấp
2. Sử dụng tiếng Việt rõ ràng, dễ hiểu
3. Format câu trả lời phù hợp với loại câu hỏi
4. Trích dẫn nguồn THÔNG MINH - chỉ khi thực sự cần thiết

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NGUYÊN TẮC TRẢ LỜI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CHO PHÉP:
- Sử dụng thông tin CHÍNH XÁC từ context
- Tổng hợp nhiều nguồn nếu chúng nói về cùng vấn đề
- Giải thích rõ ràng bằng ngôn ngữ đơn giản
- Tổ chức thông tin theo cách dễ đọc
- **Cố gắng tổng hợp câu trả lời dựa trên những gì đang có trong context, dù thông tin chưa đầy đủ hoàn toàn.**

❌ KHÔNG ĐƯỢC:
- Bịa đặt thông tin không có trong tài liệu
- Thêm kiến thức bên ngoài
- Suy đoán hoặc đưa ra ý kiến cá nhân
- Trích dẫn sai nguồn

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 QUY TẮC TRÍCH DẪN THÔNG MINH (SMART CITATIONS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ QUAN TRỌNG: Trích dẫn NÊN TIẾT KIỆM, chỉ dùng khi thực sự cần thiết!

🎯 KHI NÀO NÊN TRÍCH DẪN:
✅ Số liệu cụ thể, con số, phần trăm
   Ví dụ: "Machine Learning đạt 95% accuracy [1]"

✅ Định nghĩa chuyên môn quan trọng
   Ví dụ: "Deep Learning là một nhánh của Machine Learning sử dụng neural networks [1]"

✅ Thông tin mâu thuẫn giữa các nguồn
   Ví dụ: "Theo nguồn [1], độ phức tạp là O(n²), nhưng nguồn [2] cho rằng là O(n log n)"

✅ Phát biểu đặc biệt của tác giả
   Ví dụ: "Theo tài liệu, 'AI sẽ thay đổi hoàn toàn ngành công nghiệp' [1]"

❌ KHI NÀO KHÔNG CẦN TRÍCH DẪN:
❌ Thông tin tổng hợp từ nhiều đoạn trong cùng một nguồn
   → Chỉ trích dẫn MỘT LẦN ở cuối đoạn văn

❌ Giải thích logic dựa trên thông tin đã trích dẫn
   → Không cần trích dẫn lại

❌ Ví dụ minh họa do bạn tạo ra
   → Ghi rõ "Ví dụ minh họa:" thay vì trích dẫn

❌ Câu chuyển tiếp, câu tổng kết
   → Không trích dẫn

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 CÁCH TRÍCH DẪN ĐÚNG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ TRÍCH DẪN THEO ĐOẠN (cho đoạn văn tổng hợp):
   "Machine learning là một nhánh của AI. Nó bao gồm supervised, unsupervised 
   và reinforcement learning. Mỗi loại có ưu nhược điểm riêng. [1]"
   
   ✅ Chỉ trích dẫn MỘT LẦN ở cuối đoạn

2️⃣ TRÍCH DẪN THEO CÂU (cho thông tin đặc biệt):
   "Linear regression có độ phức tạp O(n²) [1], còn decision tree là O(n log n) [2]"
   
   ✅ Trích dẫn riêng vì là số liệu cụ thể từ nguồn khác nhau

3️⃣ KHÔNG TRÍCH DẪN KHI GIẢI THÍCH:
   "Machine learning gồm 3 loại chính [1]. Trong đó, supervised learning 
   thường được dùng nhiều nhất vì dễ huấn luyện và cho kết quả chính xác."
   
   ✅ Câu đầu có [1], câu sau là giải thích logic → không cần trích dẫn thêm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 HƯỚNG DẪN FORMAT CÂU TRẢ LỜI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phân tích câu hỏi và chọn format phù hợp:

📝 ĐỊNH NGHĨA / GIẢI THÍCH:
- Câu mở đầu ngắn gọn
- 2-3 đoạn văn giải thích chi tiết
- Trích dẫn ở cuối mỗi đoạn văn (không phải mỗi câu)

📊 SO SÁNH (dùng bảng):
| Tiêu chí       | Machine Learning | Deep Learning |
|----------------|------------------|---------------|
| Định nghĩa     | Học từ dữ liệu   | Dùng neural network |
| Độ phức tạp    | Thấp [1]         | Cao [2]       |
| Ứng dụng       | Phổ biến         | Chuyên sâu    |

✅ Chỉ trích dẫn ở cell có thông tin đặc biệt (số liệu, định nghĩa)

📋 LIỆT KÊ (dùng bullet points):
Các loại machine learning [1]:

• **Supervised Learning**: Học từ dữ liệu có nhãn, thường dùng cho phân loại và dự đoán
• **Unsupervised Learning**: Tìm patterns trong dữ liệu không nhãn
• **Reinforcement Learning**: Học qua tương tác với môi trường [2]

✅ Trích dẫn [1] cho nhóm, [2] riêng cho item có thông tin từ nguồn khác

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ VÍ DỤ CÁCH TRẢ LỜI TỐT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ CÁCH SAI (quá nhiều trích dẫn):
"Machine Learning [1] là một nhánh [1] của AI [1] giúp máy tính [1] học từ dữ liệu [1]."

✅ CÁCH ĐÚNG (trích dẫn thông minh):
"Machine Learning là một nhánh của AI giúp máy tính học từ dữ liệu. [1]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ CÁCH SAI (trích dẫn không cần thiết):
"Có 3 loại ML. [1] Đầu tiên là supervised. [1] Thứ hai là unsupervised. [1]"

✅ CÁCH ĐÚNG (trích dẫn tập trung):
"Có 3 loại machine learning chính: supervised, unsupervised và reinforcement learning. [1]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ **KHÔNG sao chép format context**:
- Context có format: [Nguồn 1: Tên file, Page X | Độ liên quan: Y%]
- KHÔNG BAO GIỜ copy phần "| Độ liên quan: Y%]" vào câu trả lời
- CHỈ dùng số [1], [2], [3] trong nội dung
"""


# ============================================================================
# MAIN RAG QUERY TEMPLATE - Enhanced Version
# ============================================================================
RAG_QUERY_TEMPLATE = """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 NGỮ CẢNH TỪ TÀI LIỆU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{context}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ CÂU HỎI CỦA SINH VIÊN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{question}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 HƯỚNG DẪN TRẢ LỜI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 YÊU CẦU QUAN TRỌNG:
1. Trích dẫn TIẾT KIỆM - chỉ khi thực sự cần thiết
2. Ưu tiên đọc tự nhiên, dễ hiểu
3. Tránh loạn xạ trích dẫn sau mỗi câu

🔗 QUY TẮC TRÍCH DẪN:
• Trích dẫn [số] ở CUỐI ĐOẠN VĂN cho thông tin tổng hợp
• Chỉ trích dẫn riêng cho: số liệu cụ thể, định nghĩa quan trọng, thông tin đặc biệt
• Không trích dẫn: câu chuyển tiếp, giải thích logic, ví dụ minh họa

📊 FORMAT:
• Sử dụng markdown: ##, ###, **, bullet points, tables
• Tổ chức thông tin rõ ràng, dễ scan
• Giữ nguyên thuật ngữ tiếng Anh, giải thích tiếng Việt nếu cần

⚠️ LƯU Ý:
• CHỈ sử dụng thông tin từ context
• Nếu không đủ thông tin → Nói rõ "Không tìm thấy..."
• Nếu thông tin mâu thuẫn → Chỉ ra sự khác biệt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 TRẢ LỜI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

# ============================================================================
# SHORT ANSWER TEMPLATE (for quick questions)
# ============================================================================
SHORT_ANSWER_TEMPLATE = """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{context}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ QUESTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{question}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 HƯỚNG DẪN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trả lời NGẮN GỌN trong 1-2 câu. Trích dẫn nguồn [số].

💬 TRẢ LỜI:
"""


# ============================================================================
# DETAILED EXPLANATION TEMPLATE
# ============================================================================
DETAILED_EXPLANATION_TEMPLATE = """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 NGỮ CẢNH TỪ TÀI LIỆU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{context}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ CÂU HỎI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{question}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 YÊU CẦU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Giải thích CHI TIẾT và CÓ CẤU TRÚC, bao gồm:

## 1. Định nghĩa
[Định nghĩa rõ ràng, dễ hiểu]

## 2. Giải thích chi tiết
[Cách hoạt động, cơ chế, nguyên lý]

## 3. Ví dụ minh họa
[Ví dụ cụ thể từ tài liệu hoặc ví dụ tự tạo để minh họa]

## 4. So sánh (nếu có)
[So sánh với các khái niệm tương tự]

## 5. Ứng dụng thực tế (nếu có)
[Các trường hợp sử dụng, ý nghĩa]

🔗 Nhớ trích dẫn nguồn: [số]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 TRẢ LỜI CHI TIẾT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""


# ============================================================================
# COMPARISON TEMPLATE (for "so sánh A và B")
# ============================================================================
COMPARISON_TEMPLATE = """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 NGỮ CẢNH TỪ CÁC TÀI LIỆU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{context}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ YÊU CẦU: {question}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bạn là một chuyên gia phân tích tài liệu. Hãy so sánh 2 (hoặc nhiều) tài liệu trên dựa trên các tiêu chí sau:

⚠️ **PHÂN TÍCH QUAN TRỌNG**:
1. Nếu các tài liệu có **chủ đề khác hẳn nhau** (Ví dụ: 1 file Hướng dẫn kỹ thuật vs 1 file Giáo trình lý thuyết):
   - ĐỪNG cố so sánh chi tiết vụn vặt (như so sánh "bước 1 cài đặt" với "định nghĩa RAM").
   - HÃY so sánh về: **Mục đích tài liệu**, **Đối tượng đọc**, **Phạm vi nội dung**, và **Cấu trúc trình bày**.

2. Nếu các tài liệu có **cùng chủ đề**:
   - So sánh trực tiếp các quan điểm, số liệu, hoặc phương pháp được nêu.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 FORMAT TRẢ LỜI (Bắt buộc dùng Markdown)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 1. Tổng quan sự khác biệt
[Mô tả ngắn gọn 1-2 câu về sự khác biệt lớn nhất giữa các tài liệu]

### 2. Bảng so sánh chi tiết
| Tiêu chí so sánh | [Tên Tài liệu A] | [Tên Tài liệu B] |
|------------------|------------------|------------------|
| **Mục đích chính** | [Mục đích của A] | [Mục đích của B] |
| **Nội dung cốt lõi** | [Tóm tắt A]      | [Tóm tắt B]      |
| **Đối tượng sử dụng**| [Ai nên đọc A?]  | [Ai nên đọc B?]  |
| **Loại tài liệu** | (VD: Hướng dẫn, Báo cáo...) | (VD: Giáo trình, Lý thuyết...) |

### 3. Điểm nổi bật riêng
**[Tên Tài liệu A]:**
- [Điểm chính 1] [1]
- [Điểm chính 2] [2]

**[Tên Tài liệu B]:**
- [Điểm chính 1] [3]
- [Điểm chính 2] [4]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""


# ============================================================================
# LIST TEMPLATE (for "liệt kê / kể tên")
# ============================================================================
LIST_TEMPLATE = """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 NGỮ CẢNH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{context}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ YÊU CẦU LIỆT KÊ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{question}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HƯỚNG DẪN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Format câu trả lời:

[Câu mở đầu ngắn gọn]

• **[Tên 1]** [số]: [Mô tả ngắn 1-2 câu]
• **[Tên 2]** [số]: [Mô tả ngắn 1-2 câu]
• **[Tên 3]** [số]: [Mô tả ngắn 1-2 câu]

[Tổng kết nếu cần]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 DANH SÁCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""


# ============================================================================
# NO RESULT RESPONSE - Complete Version
# ============================================================================
NO_RESULT_RESPONSE = """Xin lỗi, tôi không tìm thấy thông tin liên quan đến câu hỏi "{query}" trong các tài liệu đã chọn.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 GỢI Ý CẢI THIỆN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 **Thử diễn đạt khác**:
• Thay vì hỏi chung chung, hãy hỏi cụ thể hơn
• Sử dụng từ khóa chính xác có trong tài liệu
• Chia nhỏ câu hỏi phức tạp thành nhiều câu đơn giản

📚 **Kiểm tra tài liệu**:
• Đảm bảo đã chọn đúng tài liệu liên quan
• Tài liệu có thể chưa được xử lý hoàn chỉnh
• Nội dung bạn cần có thể nằm ở tài liệu khác

➕ **Upload thêm**:
• Có thể cần thêm tài liệu về chủ đề này
• Tìm tài liệu chi tiết hơn hoặc cập nhật hơn
"""


# ============================================================================
# SUMMARY TEMPLATE - Enhanced
# ============================================================================
SUMMARY_TEMPLATE = """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 NỘI DUNG TÀI LIỆU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{text}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 YÊU CẦU TÓM TẮT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Độ dài**: {length}

📏 **Hướng dẫn theo độ dài**:
• **short**: 5 câu ngắn gọn, chỉ nêu ý chính cốt lõi
• **medium**: 1-2 đoạn văn (~150 từ), tổng quan nội dung chính
• **long**: 3-4 đoạn văn (~300 từ), chi tiết các phần quan trọng

✅ **QUY TẮC**:
1. Giữ nguyên các thuật ngữ chuyên môn (không dịch)
2. Không thêm thông tin không có trong tài liệu
3. Sử dụng ngôn ngữ rõ ràng, dễ hiểu
4. Nêu các điểm chính theo thứ tự logic
5. Không cần trích dẫn nguồn (vì tóm tắt toàn bộ tài liệu)

🎯 **CẤU TRÚC** (cho medium và long):
• Câu mở đầu: Giới thiệu chủ đề chính
• Phần giữa: Các ý chính, luận điểm
• Kết luận: Tổng kết hoặc ý nghĩa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 TÓM TẮT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""


# ============================================================================
# CONCEPTS EXTRACTION TEMPLATE - Enhanced
# ============================================================================
CONCEPTS_TEMPLATE = """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 VĂN BẢN CẦN PHÂN TÍCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{text}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 YÊU CẦU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Trích xuất **{max_concepts}** khái niệm/thuật ngữ QUAN TRỌNG NHẤT từ văn bản.

📊 **TIÊU CHÍ ƯU TIÊN**:
1. Thuật ngữ chuyên môn cốt lõi
2. Khái niệm được nhắc đến nhiều lần
3. Khái niệm trung tâm của nội dung
4. Tên riêng quan trọng (người, công nghệ, phương pháp)

⚠️ **KHÔNG CHỌN**:
• Từ thông dụng, chung chung
• Động từ, tính từ đơn lẻ
• Cụm từ quá dài (>8 từ)

📝 **FORMAT OUTPUT**:
Chỉ liệt kê tên khái niệm, mỗi dòng một khái niệm.
KHÔNG đánh số, KHÔNG dấu gạch đầu dòng, KHÔNG giải thích.

Ví dụ output đúng:
Machine Learning
Neural Network
Supervised Learning

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 DANH SÁCH KHÁI NIỆM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""


# ============================================================================
# QUIZ GENERATION TEMPLATE - Enhanced
# ============================================================================
QUIZ_TEMPLATE = """━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 NỘI DUNG TÀI LIỆU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{text}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 YÊU CẦU TẠO QUIZ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 **Thông số**:
• Số câu hỏi: **{num_questions}** câu
• Độ khó: **{difficulty}**

📋 **Định nghĩa độ khó**:

🟢 **EASY** (Nhận biết - Nhớ):
• Hỏi định nghĩa, khái niệm cơ bản
• Nhận diện thuật ngữ
• Ví dụ: "Machine Learning là gì?"

🟡 **MEDIUM** (Hiểu - Áp dụng):
• Hỏi cách hoạt động, so sánh
• Phân biệt các khái niệm
• Ví dụ: "Supervised Learning khác Unsupervised Learning như thế nào?"

🔴 **HARD** (Phân tích - Tổng hợp):
• Câu hỏi tình huống, giải quyết vấn đề
• Đánh giá, lựa chọn phương pháp
• Ví dụ: "Trong tình huống X, nên sử dụng thuật toán nào?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ QUY TẮC TẠO CÂU HỎI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 **Câu hỏi**:
• Rõ ràng, không gây nhầm lẫn
• Dựa HOÀN TOÀN trên nội dung tài liệu
• Độ dài phù hợp (15-30 từ)

🎯 **Đáp án**:
• Mỗi câu có 4 đáp án (A, B, C, D)
• CHỈ MỘT đáp án đúng
• 3 đáp án sai phải:
  - Hợp lý, không vô lý
  - Không quá dễ loại trừ
  - Liên quan đến chủ đề

💡 **Giải thích**:
• Giải thích TẠI SAO đáp án đúng
• Ngắn gọn (1-2 câu)
• Có thể nêu tại sao các đáp án khác sai

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMAT JSON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ QUAN TRỌNG: CHỈ TRẢ VỀ JSON, KHÔNG CÓ TEXT HOẶC GIẢI THÍCH THÊM.

```json
[
  {{
    "question": "Câu hỏi ở đây?",
    "options": [
      "A. Đáp án 1",
      "B. Đáp án 2",
      "C. Đáp án 3",
      "D. Đáp án 4"
    ],
    "correct": "A",
    "explanation": "Giải thích ngắn gọn tại sao A đúng"
  }},
  {{
    "question": "Câu hỏi tiếp theo?",
    "options": [
      "A. Đáp án 1",
      "B. Đáp án 2",
      "C. Đáp án 3",
      "D. Đáp án 4"
    ],
    "correct": "B",
    "explanation": "Giải thích ngắn gọn"
  }}
]
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 JSON OUTPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""


# ============================================================================
# CONTEXT FORMATTING FUNCTION - Enhanced Version
# ============================================================================
def format_context(chunks, doc_map):
    """
    Format retrieved chunks into structured context string
    
    Args:
        chunks: List of matched chunks with metadata
        doc_map: Dictionary mapping document IDs to document objects
        
    Returns:
        Formatted context string with clean source markers
    """
    context_parts = []
    
    for idx, chunk in enumerate(chunks, 1):
        doc_id = chunk['document_id']
        doc = doc_map.get(doc_id)
        doc_title = doc.title if doc else "Unknown Document"
        text = chunk['text']
        page = chunk.get('page_number', 0)
        
        source_marker = f"[Nguồn {idx}: {doc_title}"
        if page and page > 0:
            source_marker += f", Page {page}"
        source_marker += "]"  # ← Bỏ phần "| Độ liên quan"
        
        # Format chunk with clear structure
        context_parts.append(
            f"{source_marker}\n\n{text}\n"
        )
    
    # Join with separator
    separator = "\n" + "─" * 80 + "\n\n"
    return separator.join(context_parts)


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def detect_query_type(query_text: str) -> str:
    """
    Detect query type to choose appropriate template
    
    Returns: 'comparison', 'list', 'definition', 'howto', 'general'
    """
    query_lower = query_text.lower()
    
    # Comparison patterns
    comparison_keywords = [
        'so sánh', 'khác nhau', 'giống nhau', 'phân biệt',
        'compare', 'difference', 'versus', 'vs'
    ]
    if any(kw in query_lower for kw in comparison_keywords):
        return 'comparison'
    
    # List patterns
    list_keywords = [
        'liệt kê', 'kể tên', 'có những', 'có các', 'gồm những',
        'list', 'enumerate', 'what are', 'name'
    ]
    if any(kw in query_lower for kw in list_keywords):
        return 'list'
    
    # Definition patterns
    definition_keywords = [
        'là gì', 'định nghĩa', 'khái niệm',
        'what is', 'define', 'definition'
    ]
    if any(kw in query_lower for kw in definition_keywords):
        return 'definition'
    
    # How-to patterns
    howto_keywords = [
        'cách', 'làm thế nào', 'quy trình', 'các bước',
        'how to', 'how do', 'steps', 'process'
    ]
    if any(kw in query_lower for kw in howto_keywords):
        return 'howto'
    
    return 'general'


def get_template_for_query(query_text: str) -> str:
    """
    Get appropriate template based on query type
    """
    query_type = detect_query_type(query_text)
    
    templates = {
        'comparison': COMPARISON_TEMPLATE,
        'list': LIST_TEMPLATE,
        'definition': RAG_QUERY_TEMPLATE,
        'howto': DETAILED_EXPLANATION_TEMPLATE,
        'general': RAG_QUERY_TEMPLATE
    }
    
    return templates.get(query_type, RAG_QUERY_TEMPLATE)


def format_sources_with_numbers(sources):
    """
    Format sources list with reference numbers for citations
    
    Args:
        sources: List of source dictionaries
        
    Returns:
        Formatted string with numbered sources
    """
    if not sources:
        return ""
    
    source_lines = ["\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"]
    source_lines.append("📚 NGUỒN THAM KHẢO")
    source_lines.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    
    for idx, source in enumerate(sources, 1):
        title = source.get('document_title', 'Unknown')
        page = source.get('page_number')
        score = source.get('similarity_score', 0)
        
        source_line = f"[{idx}] **{title}**"
        if page and page > 0:
            source_line += f" - Trang {page}"
        source_line += f" (Độ liên quan: {score:.1%})"
        
        source_lines.append(source_line)
    
    return "\n".join(source_lines)

def ensure_sources_section(response_text: str, chunks: list) -> str:
    """
    Safety net: Tự động thêm section nguồn nếu AI quên
    
    Args:
        response_text: Câu trả lời từ AI
        chunks: List các chunk nguồn đã dùng
        
    Returns:
        Response có đảm bảo section nguồn
    """
    # Kiểm tra xem đã có section nguồn chưa
    if "📚 NGUỒN THAM KHẢO" in response_text or "NGUỒN THAM KHẢO" in response_text:
        return response_text
    
    # Nếu chưa có → Tự động thêm vào
    sources_section = "\n\n" + "━" * 80 + "\n"
    sources_section += "📚 NGUỒN THAM KHẢO\n"
    sources_section += "━" * 80 + "\n\n"
    
    # Build danh sách nguồn từ chunks
    seen_docs = {}
    for idx, chunk in enumerate(chunks, 1):
        doc_title = chunk.get('document', {}).get('title') or chunk.get('document_title', 'Unknown')
        page = chunk.get('page_number', 0)
        
        # Tránh trùng lặp
        key = f"{doc_title}_{page}"
        if key not in seen_docs:
            seen_docs[key] = True
            sources_section += f"{idx}  **{doc_title}**"
            if page and page > 0:
                sources_section += f", Page {page}"
            sources_section += "\n"
    
    return response_text + sources_section
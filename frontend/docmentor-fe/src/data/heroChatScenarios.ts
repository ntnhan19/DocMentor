export interface CitationData {
  file: string;
  page: number;
  previewText: string;
}

export interface ChatScenario {
  id: string;
  question: string;
  answerPart1: string;
  citation1?: CitationData;
  answerPart2?: string;
  citation2?: CitationData;
  answerPart3?: string;
}

export const heroChatScenarios: Record<"student" | "lecturer", ChatScenario[]> = {
  student: [
    {
      id: "q1",
      question: "So sánh Supervised và Unsupervised Learning?",
      answerPart1: "Supervised Learning sử dụng dữ liệu có nhãn để huấn luyện mô hình",
      citation1: { file: "ML_Basics.pdf", page: 12, previewText: "Supervised learning algorithms build a mathematical model of a set of data that contains both the inputs and the desired outputs (labels)." },
      answerPart2: ", trong khi Unsupervised Learning tìm pattern trong dữ liệu không nhãn",
      citation2: { file: "ML_Basics.pdf", page: 18, previewText: "Unsupervised learning discovers hidden patterns or intrinsic structures in data. It is used to draw inferences from datasets consisting of input data without labeled responses." },
      answerPart3: "."
    },
    {
      id: "q2",
      question: "Tóm tắt chương 3 trong 3 câu?",
      answerPart1: "Chương 3 tập trung vào Gradient Descent, một thuật toán tối ưu hóa lặp. Nó điều chỉnh các tham số (weights) theo hướng ngược lại của gradient để tìm cực tiểu của hàm mất mát",
      citation1: { file: "Optimization_Ch3.pdf", page: 4, previewText: "Gradient descent is a first-order iterative optimization algorithm for finding a local minimum of a differentiable function." },
      answerPart2: ". Learning rate đóng vai trò quyết định tốc độ và sự hội tụ của thuật toán này",
      citation2: { file: "Optimization_Ch3.pdf", page: 7, previewText: "The size of the steps taken to reach the minimum is determined by the learning rate (alpha)." },
      answerPart3: "."
    },
    {
      id: "q3",
      question: "Backpropagation hoạt động như thế nào?",
      answerPart1: "Backpropagation tính toán gradient của hàm mất mát theo từng trọng số bằng quy tắc chuỗi (chain rule)",
      citation1: { file: "Neural_Nets.pdf", page: 22, previewText: "The backpropagation algorithm computes the gradient of the loss function with respect to the weights of the network for a single input-output example." },
      answerPart2: ". Nó truyền sai số từ lớp đầu ra ngược về các lớp ẩn trước đó để cập nhật trọng số hiệu quả",
      citation2: { file: "Neural_Nets.pdf", page: 25, previewText: "By repeatedly applying the chain rule, gradients are computed backwards from the output layer to the input layer." },
      answerPart3: "."
    }
  ],
  lecturer: [
    {
      id: "l1",
      question: "Sinh viên đang hỏi nhiều nhất về chương nào tuần này?",
      answerPart1: "Dữ liệu cho thấy sinh viên đặt 85% câu hỏi về",
      citation1: { file: "Chương 4: Neural Networks", page: 45, previewText: "Topic 4.3: Activation Functions and their derivatives." },
      answerPart2: ". Chủ yếu tập trung vào khái niệm Backpropagation được đề cập chi tiết trong phần này",
      citation2: { file: "Chương 4: Neural Networks", page: 52, previewText: "Topic 4.5: The Backpropagation Algorithm and Chain Rule application." },
      answerPart3: "."
    },
    {
      id: "l2",
      question: "Tạo 3 câu hỏi trắc nghiệm từ Chương 4?",
      answerPart1: "Đây là 3 câu hỏi dựa trên nội dung Chương 4:\n1. Thuật toán nào dùng để cập nhật trọng số?\n2. Đạo hàm của hàm ReLU là gì?\n3. Vấn đề Vanishing Gradient thường xảy ra khi nào? Tất cả được trích xuất từ",
      citation1: { file: "Chương 4: Neural Networks", page: 30, previewText: "List of common activation functions: Sigmoid, Tanh, ReLU." },
      answerPart2: " và ",
      citation2: { file: "Chương 4: Neural Networks", page: 60, previewText: "The vanishing gradient problem is explored in deep networks." },
      answerPart3: "."
    },
    {
      id: "l3",
      question: "Khái niệm nào sinh viên hay nhầm lẫn nhất?",
      answerPart1: "Hệ thống ghi nhận tỷ lệ trả lời sai cao nhất (42%) đối với các bài tập liên quan đến Overfitting",
      citation1: { file: "Quiz_Results_Q3.csv", page: 1, previewText: "Overfitting occurs when a model learns the detail and noise in the training data to the extent that it negatively impacts the performance of the model on new data." },
      answerPart2: ". Bạn có thể cần bổ sung thêm ví dụ thực tế cho phần Regularization",
      citation2: { file: "Chương 5: Regularization", page: 12, previewText: "L1 and L2 regularization methods help prevent overfitting by penalizing large weights." },
      answerPart3: "."
    }
  ]
};

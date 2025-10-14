// Testimonials.tsx (Chỉnh sửa cho Dark Theme)
import React, { useState } from "react";
import { Testimonial } from "../types/homepage.types";

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      role: "Sinh viên Đại học",
      rating: 5,
      comment:
        "DocMentor đã giúp tôi tiết kiệm rất nhiều thời gian trong việc nghiên cứu tài liệu. Tính năng trò chuyện với tài liệu thật sự thông minh!",
      avatar: "👨‍🎓",
    },
    {
      id: "2",
      name: "Trần Thị B",
      role: "Giảng viên",
      rating: 5,
      comment:
        "Tôi sử dụng DocMentor để chuẩn bị bài giảng. Khả năng tóm tắt và phân tích tài liệu rất chính xác và hữu ích.",
      avatar: "👩‍🏫",
    },
    {
      id: "3",
      name: "Lê Văn C",
      role: "Nhà nghiên cứu",
      rating: 5,
      comment:
        "Công cụ tuyệt vời cho nghiên cứu học thuật. Tìm kiếm thông tin trong hàng trăm paper chỉ mất vài giây!",
      avatar: "👨‍🔬",
    },
    {
      id: "4",
      name: "Phạm Thị D",
      role: "Chuyên gia tư vấn",
      rating: 4,
      comment:
        "Giao diện thân thiện, dễ sử dụng. Hỗ trợ nhiều định dạng tài liệu khiến công việc của tôi trở nên dễ dàng hơn nhiều.",
      avatar: "👩‍💼",
    },
    {
      id: "5",
      name: "Hoàng Văn E",
      role: "Kỹ sư phần mềm",
      rating: 5,
      comment:
        "Hiệu suất xử lý tài liệu rất nhanh. Tính năng bảo mật cũng rất tốt, tôi yên tâm khi sử dụng với tài liệu quan trọng.",
      avatar: "👨‍💻",
    },
    {
      id: "6",
      name: "Võ Thị F",
      role: "Luật sư",
      rating: 5,
      comment:
        "Không thể thiếu trong công việc hàng ngày của tôi. Tìm kiếm điều khoản pháp luật trong các văn bản dài trở nên dễ dàng.",
      avatar: "👩‍⚖️",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0); // Sử dụng itemsPerPage = 3 cho desktop và 1 cho mobile/tablet
  const itemsPerPage = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerPage >= testimonials.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - itemsPerPage;
      return newIndex < 0
        ? Math.max(0, testimonials.length - itemsPerPage)
        : newIndex;
    });
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
           {" "}
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${
            // Giữ màu vàng cho ngôi sao đã rating, màu text-muted cho ngôi sao chưa rating
            index < rating ? "text-yellow-400" : "text-text-muted/30"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
                   {" "}
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                 {" "}
        </svg>
      ))}
         {" "}
    </div>
  );

  return (
    // Thay đổi nền thành background theme tối
    <section id="testimonials" className="py-20 bg-background text-white">
           {" "}
      <div className="container mx-auto px-4">
                {/* Section Header */}       {" "}
        <div className="text-center mb-16">
                   {" "}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Người dùng nói gì về chúng tôi          {" "}
          </h2>
                   {" "}
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Hơn 10,000 người dùng tin tưởng và sử dụng{" "}
            <span className="font-semibold text-primary">DocMentor</span> mỗi  
                      ngày.          {" "}
          </p>
                 {" "}
        </div>
                {/* Testimonials Carousel */}       {" "}
        <div className="relative">
                    {/* Navigation Buttons */}         {" "}
          {testimonials.length > itemsPerPage && (
            <>
                           {" "}
              <button
                onClick={prevSlide} // Thay đổi màu nền nút sang accent và text-primary
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 
                  bg-accent rounded-full p-3 shadow-lg hover:shadow-xl transition-all 
                  hover:scale-110 hidden md:block border border-accent/50"
                aria-label="Previous testimonials"
              >
                               {" "}
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                                 {" "}
                </svg>
                             {" "}
              </button>
                           {" "}
              <button
                onClick={nextSlide} // Thay đổi màu nền nút sang accent và text-primary
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 
                  bg-accent rounded-full p-3 shadow-lg hover:shadow-xl transition-all 
                  hover:scale-110 hidden md:block border border-accent/50"
                aria-label="Next testimonials"
              >
                               {" "}
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                                 {" "}
                </svg>
                             {" "}
              </button>
                         {" "}
            </>
          )}
                    {/* Testimonials Grid */}         {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {" "}
            {visibleTestimonials.map((t) => (
              <div
                key={t.id} // Card nền accent, viền primary/30
                // Thêm animation float
                className="bg-accent rounded-xl p-6 shadow-xl 
                  transition-all duration-300 border border-primary/30 
                  hover:shadow-[0_0_40px_rgba(138,66,255,0.3)] animate-float"
                style={{ animationDelay: `${Math.random() * 0.5}s` }} // Delay ngẫu nhiên
              >
                                {/* Quote Icon */}               {" "}
                <div className="text-primary mb-4">
                                   {" "}
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                                       {" "}
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                     {" "}
                  </svg>
                                 {" "}
                </div>
                                {/* Rating */}               {" "}
                {renderStars(t.rating)}                {/* Comment */}         
                     {" "}
                <p className="text-white mb-6 leading-relaxed mt-4">
                                    “{t.comment}”                {" "}
                </p>
                                {/* User Info */}               {" "}
                <div className="flex items-center gap-3 pt-4 border-t border-accent/50">
                                   {" "}
                  <div // Avatar gradient sử dụng primary và secondary
                    className="w-12 h-12 bg-gradient-to-br from-primary to-secondary 
                    rounded-full flex items-center justify-center text-2xl text-white"
                  >
                                        {t.avatar}                 {" "}
                  </div>
                                   {" "}
                  <div>
                                       {" "}
                    <div className="font-semibold text-white">{t.name}</div>   
                                   {" "}
                    <div className="text-sm text-text-muted">{t.role}</div>     
                               {" "}
                  </div>
                                 {" "}
                </div>
                             {" "}
              </div>
            ))}
                     {" "}
          </div>
                    {/* Dots Indicator */}         {" "}
          {testimonials.length > itemsPerPage && (
            <div className="flex justify-center gap-2 mt-8">
                           {" "}
              {Array.from(
                { length: Math.ceil(testimonials.length / itemsPerPage) },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * itemsPerPage)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      // Dot Active dùng màu primary, inactive dùng text-muted
                      Math.floor(currentIndex / itemsPerPage) === index
                        ? "bg-primary w-8"
                        : "bg-text-muted/30 hover:bg-primary/50"
                    }`}
                    aria-label={`Go to testimonial group ${index + 1}`}
                  />
                )
              )}
                         {" "}
            </div>
          )}
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </section>
  );
};

export default Testimonials;

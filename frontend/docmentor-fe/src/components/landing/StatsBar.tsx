import { motion } from "framer-motion";

const stats = [
  { value: "< 5s", label: "Thời gian phản hồi TB" },
  { value: "99%", label: "Độ chính xác trích dẫn" },
  { value: "99.9%", label: "Uptime hệ thống" },
  { value: "3", label: "Định dạng file hỗ trợ" },
];

export default function StatsBar() {
  return (
    <section className="py-12 border-y border-border-color bg-accent/20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border-color/0 md:divide-border-color">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-medium text-text-muted">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

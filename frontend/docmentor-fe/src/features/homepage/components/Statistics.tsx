// src/features/homepage/components/Statistics.tsx
import React, { useEffect, useState } from "react";
import { Statistic } from "../types/homepage.types";

const Statistics: React.FC = () => {
  const statistics: Statistic[] = [
    {
      id: "1",
      value: 10000,
      label: "Người dùng",
      icon: "👥",
      suffix: "+",
    },
    {
      id: "2",
      value: 50000,
      label: "Tài liệu đã xử lý",
      icon: "📄",
      suffix: "+",
    },
    {
      id: "3",
      value: 98,
      label: "Độ chính xác",
      icon: "🎯",
      suffix: "%",
    },
    {
      id: "4",
      value: 24,
      label: "Hỗ trợ",
      icon: "⏰",
      suffix: "/7",
    },
  ];

  return (
    <section className="py-20 bg-background text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface StatCardProps {
  stat: Statistic;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const [count, setCount] = useState(0);
  const target =
    typeof stat.value === "number" ? stat.value : parseInt(stat.value);

  useEffect(() => {
    const duration = 2000;
    let start = 0;
    const end = target;
    if (start === end) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const newCount = Math.floor(progress * (end - start) + start);
      setCount(newCount);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target]);

  return (
    <div className="text-center bg-accent p-6 rounded-lg border border-white/10">
      <div className="text-4xl md:text-5xl mb-2">{stat.icon}</div>
      <div className="text-3xl md:text-4xl font-bold mb-2 text-secondary">
        {count.toLocaleString()}
        {stat.suffix}
      </div>
      <div className="text-text-muted text-sm md:text-base">{stat.label}</div>
    </div>
  );
};

export default Statistics;

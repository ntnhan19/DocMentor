// src/features/homepage/types/homepage.types.ts

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color?: string;
}

export interface Statistic {
  id: string;
  value: string | number;
  label: string;
  icon?: string;
  suffix?: string;
}

export interface HowItWorksStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  comment: string;
  date?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface HomepageData {
  features: Feature[];
  statistics: Statistic[];
  howItWorks: HowItWorksStep[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
}

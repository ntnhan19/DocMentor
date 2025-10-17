// src/features/homepage/hooks/useHomepage.ts
import { useState, useEffect } from "react";
import { HomepageData } from "../types/homepage.types";

export const useHomepage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<HomepageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching homepage data
    const fetchHomepageData = async () => {
      try {
        setIsLoading(true);

        // In real app, this would be an API call
        // const response = await homepageService.getHomepageData();

        // Mock data for now
        const mockData: HomepageData = {
          features: [],
          statistics: [],
          howItWorks: [],
          testimonials: [],
          faqs: [],
        };

        setData(mockData);
        setError(null);
      } catch (err) {
        setError("Failed to load homepage data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  return {
    data,
    isLoading,
    error,
  };
};

// Hook for scroll animations
export const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isVisible;
};

// Hook for smooth scroll to section
export const useSmoothScroll = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return { scrollToSection };
};

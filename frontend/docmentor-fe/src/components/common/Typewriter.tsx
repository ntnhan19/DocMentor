import React, { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  speed?: number; // ms per word
  onComplete?: () => void;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 30,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const words = text.split(" ");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < words.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => (prev ? prev + " " + words[index] : words[index]));
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, words, speed, onComplete]);

  return <>{displayedText}</>;
};

export default Typewriter;

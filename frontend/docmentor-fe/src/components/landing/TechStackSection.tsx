import { motion } from "framer-motion";

const technologies = [
  { name: "React 19", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
  { name: "TypeScript", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" },
  { name: "Tailwind CSS", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
  { name: "FastAPI", logo: "https://fastapi.tiangolo.com/img/icon-white.svg" },
  { name: "PostgreSQL", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" },
  { name: "Gemini", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" },
];

export default function TechStackSection() {
  return (
    <section className="py-20 border-t border-border-color bg-accent/20" id="tech-stack">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <p className="text-sm font-semibold tracking-wider text-text-muted uppercase mb-8">
          Powered by modern technologies
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <img src={tech.logo} alt={tech.name} className="h-8 w-auto object-contain" />
              <span className="font-medium text-text-main">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

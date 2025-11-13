import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// @ts-ignore: allow importing CSS without type declarations
import "./index.css";
import App from "./app/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

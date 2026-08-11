import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = document.getElementById("discover-root");
if (!root) {
  throw new Error("Missing discover-root element.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

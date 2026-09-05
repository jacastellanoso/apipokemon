import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Falta el punto de entrada de React.");

createRoot(root).render(<App />);

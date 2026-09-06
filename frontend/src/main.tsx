import { createRoot } from "react-dom/client";
import App from "./App";
import "@flaticon/flaticon-uicons/css/regular/rounded.css";

const root = document.getElementById("root");
if (!root) throw new Error("Falta el punto de entrada de React.");

createRoot(root).render(<App />);

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import NakamaProvider from "@/providers/NakamaProvider";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <NakamaProvider>
      <App />
    </NakamaProvider>
  </BrowserRouter>
);

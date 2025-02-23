import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import { BrowserRouter } from "react-router-dom";
import NakamaProvider from "@/providers/NakamaProvider";
import "@/utils/firebase";
import "@/utils/confetti";
import * as pc from "playcanvas";
import StateProvider from "./providers/StateProvider";

if (import.meta.env.DEV) {
  window.pc = pc;
}

createRoot(document.getElementById("root")).render(
  <StateProvider>
    <NakamaProvider>
      <App />
    </NakamaProvider>
  </StateProvider>
);

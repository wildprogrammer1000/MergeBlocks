import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import { BrowserRouter } from "react-router-dom";
import NakamaProvider from "@/providers/NakamaProvider";
import * as pc from "playcanvas";
import StateProvider from "./providers/StateProvider";
import "./i18n";
import ThemeProvider from "./providers/ThemeProvider";
import "@/utils/firebase";
import "@/utils/confetti";
import { addTweenExtensions } from "./utils/tween";
addTweenExtensions(pc);

if (import.meta.env.DEV) {
  window.pc = pc;
}

createRoot(document.getElementById("root")).render(
  <StateProvider>
    <NakamaProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </NakamaProvider>
  </StateProvider>
);

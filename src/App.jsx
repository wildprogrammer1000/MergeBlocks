import { Routes, Route } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import GamePage from "@/pages/GamePage";
import { useEffect } from "react";
import OutdatedPage from "./pages/OutdatedPage";

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(new URL("./service-worker.js", import.meta.url).toString())
        .then((registration) => {
          registration.onupdatefound = () => {
            const newWorker = registration.installing;
            newWorker.onstatechange = () => {
              if (newWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // 새 버전 감지됨
                }
              }
            };
          };
        });
    }
  }, []);
  return (
    <Routes>
      <Route path="/">
        <Route path="/" element={<MainPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/outdated" element={<OutdatedPage />} />
      </Route>
    </Routes>
  );
}

export default App;

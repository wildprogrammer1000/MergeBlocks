import { Routes, Route } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import GamePage from "@/pages/GamePage";
import OutdatedPage from "./pages/OutdatedPage";

function App() {
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

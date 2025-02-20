import { Routes, Route } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import GamePage from "@/pages/GamePage";
import OutdatedPage from "./pages/OutdatedPage";
import WSContainer from "./component/layout/WSContainer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WSContainer />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/outdated" element={<OutdatedPage />} />
      </Route>
    </Routes>
  );
}

export default App;

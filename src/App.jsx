import { useEffect, useState } from "react";
import { THEME } from "@/constants/theme";
import NetworkController from "@/component/NetworkController";
import Interface from "@/component/Interface";
import Chat from "@/component/Chat";
import { hexToRgb } from "./utils/functions";
import evt from "./utils/event-handler";

function App() {
  const [theme] = useState("valentine");
  useEffect(() => {
    const currentTheme = THEME[theme];
    const applyClearColor = (camera) => {
      const clearColor = hexToRgb(currentTheme.palette["--color-main-100"]);
      camera.clearColor.set(
        clearColor.r / 255,
        clearColor.g / 255,
        clearColor.b / 255
      );
    };
    const applyColor = () => {
      const root = document.documentElement;
      Object.entries(currentTheme.palette).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    };

    const loadAssets = () => {};
    applyColor();
    evt.on("camera:clearColor", applyClearColor);
    evt.on("asset:load", loadAssets);
    return () => {
      evt.off("camera:clearColor", applyClearColor);
      evt.off("asset:load", loadAssets);
    };
  }, [theme]);
  return (
    <div className="absolute top-0 left-0 flex flex-col w-full h-full overflow-hidden">
      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <div className="w-full h-full" id="app-canvas-container">
          <canvas id="app-canvas" />
        </div>
      </div>
      <Chat />

      {/* UI */}
      <Interface />

      {/* Modules */}
      <NetworkController />
    </div>
  );
}

export default App;

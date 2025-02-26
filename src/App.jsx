import { useEffect, useState } from "react";
import { THEME } from "@/constants/theme";
import NetworkController from "@/component/NetworkController";
import Interface from "@/component/Interface";
import Chat from "@/component/Chat";
import { hexToRgb } from "./utils/functions";
import evt from "./utils/event-handler";
import { app } from "playcanvas";
import { textureAssets } from "./playcanvas/assets";

function App() {
  const [theme] = useState("valentine");
  // const changeTheme = (theme) => {
  //   const currentTheme = THEME[theme];
  //   const textures = currentTheme.textures;
  //   textureAssets.map((asset, i) => {
  //     if (app) {
  //       const prevAsset = app.assets.find(asset.name);
  //       if (prevAsset) {
  //         app.assets.remove(prevAsset);
  //       }
  //     }
  //     asset.file.url = new URL(textures[i], import.meta.url).toString();
  //     return asset;
  //   });
  //   configureAssets(textureAssets, true);
  // };

  const applyClearColor = (camera) => {
    const currentTheme = THEME[theme];
    const palette = currentTheme.palette;
    const clearColor = hexToRgb(palette["--color-main-100"]);
    camera.clearColor.set(
      clearColor.r / 255,
      clearColor.g / 255,
      clearColor.b / 255
    );
  };

  useEffect(() => {
    const currentTheme = THEME[theme];
    const palette = currentTheme.palette;

    if (app) {
      // After Initialize
      const camera = app.root.findByName("Camera");
      applyClearColor(camera.camera);
    }

    const applyColor = () => {
      const root = document.documentElement;
      Object.entries(palette).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    };

    applyColor();
    const applyAssetTheme = () => {
      const currentTheme = THEME[theme];
      const textures = currentTheme.textures;
      textureAssets.map((asset, i) => {
        asset.file.url = textures[i];
        return asset;
      });
    };
    evt.on("asset:applyTheme", applyAssetTheme);
    evt.on("camera:clearColor", applyClearColor);
    applyAssetTheme();
    return () => {
      evt.off("asset:applyTheme", applyAssetTheme);
      evt.off("camera:clearColor", applyClearColor);
    };
  }, [theme]);

  useEffect(() => {
    const currentTheme = THEME[theme];
    const palette = currentTheme.palette;
    const applyColor = () => {
      const root = document.documentElement;
      Object.entries(palette).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    };

    applyColor();
  }, []);
  return (
    <div className="absolute top-0 left-0 flex flex-col w-full h-full overflow-hidden select-none">
      {/* <div className="absolute top-0 left-0 w-full h-10 bg-white z-40">
        <button
          onClick={() => {
            changeTheme("valentine");
            setTheme("valentine");
          }}
        >
          Valentine
        </button>
        <button
          onClick={() => {
            changeTheme("dark");
            setTheme("dark");
          }}
        >
          Dark
        </button>
      </div> */}
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

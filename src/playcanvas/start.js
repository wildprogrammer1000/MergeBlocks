import {
  Application,
  Asset,
  createGraphicsDevice,
  ElementInput,
  FILLMODE_NONE,
  Keyboard,
  Mouse,
  RESOLUTION_AUTO,
  TouchDevice,
} from "playcanvas";
import { CONTEXT_OPTIONS, PRELOAD_MODULES } from "./settings";
import { loadModules } from "./modules";
import showLoadingScreen from "./loading";
import { initProjectScene } from "./scenes/ProjectScene";
import { initSceneBase } from "./scenes/sceneBase";
import { assets } from "./assets";

async function main() {
  const canvas = document.querySelector("#app-canvas");
  if (!canvas) {
    console.error("canvas not found");
    return;
  }
  const device = await createGraphicsDevice(canvas, CONTEXT_OPTIONS);
  device.maxPixelRatio = Math.min(window.devicePixelRatio, 2);

  const app = new Application(canvas, {
    graphicsDevice: device,
    elementInput: new ElementInput(canvas, {
      useMouse: true,
      useTouch: true,
    }),
    keyboard: new Keyboard(window),
    mouse: new Mouse(canvas),
    touch: new TouchDevice(canvas),
  });

  const configureAssets = (assetList) => {
    for (let i = 0; i < assetList.length; i++) {
      const data = assetList[i];
      const asset = new Asset(data.name, data.type, data.file, data.data);
      asset.id = parseInt(data.id, 10);
      asset.preload = data.preload ? data.preload : false;
      // if this is a script asset and has already been embedded in the page then
      // mark it as loaded
      asset.loaded =
        data.type === "script" && data.data && data.data.loadingType > 0;
      // tags
      asset.tags.add(data.tags);
      // i18n
      if (data.i18n) {
        for (const locale in data.i18n) {
          asset.addLocalizedAssetId(locale, data.i18n[locale]);
        }
      }
      // registry
      app.assets.add(asset);
    }
  };
  configureAssets(assets);
  loadModules(PRELOAD_MODULES, "", () => {
    showLoadingScreen(app);
    // TODO: Add resize handler
    // orientationchange
    // resize
    app.setCanvasFillMode(FILLMODE_NONE);
    app.setCanvasResolution(RESOLUTION_AUTO);
    app.preload(() => {
      app.start();
      initSceneBase();
      initProjectScene();
    });
  });
  return app;
}
export default main;

import { SOUNDS } from "@/constants/components";
import { THEME } from "@/constants/theme";
import { hexToRgb } from "@/utils/functions";
import { app, Entity, Script } from "playcanvas";

export class ThemeManager extends Script {
  initialize() {
    this.app = app;
    this.entity.addComponent("sound", {
      ...SOUNDS,
    });
    this.camera = this.app.root.findByName("Camera");
    this.ground = this.app.root.findByName("Ground");

    this.app.on("theme:apply", this.onApplyTheme, this);
    this.on("destroy", this.onDestroy, this);

    this.app.fire("themeManager:loaded");
  }
  onApplyTheme(theme) {
    const currentTheme = THEME[theme];
    const palette = currentTheme.palette;

    const clearColor = hexToRgb(palette["--color-main-200"]);
    this.camera.camera.clearColor.set(
      clearColor.r / 255,
      clearColor.g / 255,
      clearColor.b / 255
    );

    const groundColor = hexToRgb(palette["--color-main-700"]);
    this.ground.render.material.diffuse.set(
      groundColor.r / 255,
      groundColor.g / 255,
      groundColor.b / 255
    );
    this.ground.render.material.update();
  }
  onDestroy() {
    this.app.off("theme:apply", this.onApplyTheme, this);
  }
}

export const createThemeManager = (app) => {
  const entity = new Entity("ThemeManager", app);
  entity.addComponent("script");
  entity.script.create(ThemeManager);
  app.root.addChild(entity);
};

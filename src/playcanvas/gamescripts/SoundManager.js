import { SOUNDS } from "@/constants/components";
import { app, Entity, Script } from "playcanvas";
import evt from "@/utils/event-handler";

export class SoundManager extends Script {
  initialize() {
    this.app = app;
    this.entity.addComponent("sound", {
      ...SOUNDS,
    });
    this.app.on("sound:play", this.onPlay, this);

    this.soundMap = {
      click: "button",
      close: "close",
      drop: "pop",
      pop: "pop close",
      bang: "harp",
      gameover: "lose",
    };
    this.settings = null;

    evt.on("settings:update", this.onUpdateSettings, this);
    this.on("destroy", () => {
      evt.off("settings:update", this.onUpdateSettings, this);
    });
  }
  onPlay(type) {
    if (this.soundMap[type] && this.settings?.Effect) {
      this.entity.sound.play(this.soundMap[type]);
    }
  }
  onUpdateSettings(settings) {
    this.settings = settings;
    for (const key in settings) {
      this.settings[key] = settings[key];
    }
    if (this.settings.Sound)
      !this.entity.sound.isPlaying("bgm") && this.entity.sound.play("bgm");
    else this.entity.sound.isPlaying("bgm") && this.entity.sound.stop("bgm");
  }
}

export const createSoundManager = (app) => {
  const entity = new Entity("SoundManager", app);
  entity.addComponent("script");
  entity.script.create(SoundManager);
  app.root.addChild(entity);
};

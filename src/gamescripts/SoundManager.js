import { SOUNDS } from "@/constants/components";
import { app, Entity, Script } from "playcanvas";

export class SoundManager extends Script {
  initialize() {
    this.app = app;
    this.entity.addComponent("sound", {
      ...SOUNDS,
    });
    this.entity.sound.play("bgm");
    this.app.on("sound:play", this.onPlay, this);

    this.soundMap = {
      click: "button",
      close: "close",
      drop: "pop",
      pop: "pop close",
      bang: "harp",
      gameover: "lose",
    };
  }
  onPlay(type) {
    if (this.soundMap[type]) {
      this.entity.sound.play(this.soundMap[type]);
    }
  }
}

export const createSoundManager = (app) => {
  const entity = new Entity("SoundManager", app);
  entity.addComponent("script");
  entity.script.create(SoundManager);
  app.root.addChild(entity);
};

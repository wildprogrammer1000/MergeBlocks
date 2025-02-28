import { Entity } from "playcanvas";
import { findSpriteAsset } from "@/utils/functions";

class Diamond extends Entity {
  constructor(app) {
    super("Diamond", app);
    this.app = app;

    this.addComponent("sprite");

    this.sprite.spriteAsset = findSpriteAsset(`diamond`);

    this.app.root.addChild(this);
  }
}

export default Diamond;

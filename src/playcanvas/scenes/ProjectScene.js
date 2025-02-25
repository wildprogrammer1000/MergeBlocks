import { levels } from "@/assets/json/block_levels";
import { createGameManager } from "@/gamescripts/GameManager";
import { createInputHandler } from "@/gamescripts/InputHandler";
import { createDeadline } from "@/templates/Deadline";
import evt from "@/utils/event-handler";
import {
  app,
  Asset,
  Sprite,
  SPRITE_RENDERMODE_SIMPLE,
  TextureAtlas,
  Vec2,
  Vec4,
} from "playcanvas";

export const initProjectScene = () => {
  levels.forEach((_, index) => {
    const textureAsset = app.assets.find(`block_${index}`);
    const atlas = new TextureAtlas();

    atlas.frames = {
      1: {
        rect: new Vec4(
          0,
          0,
          textureAsset.resource.width,
          textureAsset.resource.height
        ),
        pivot: new Vec2(0.5, 0.5),
        border: new Vec4(0, 0, 0, 0),
      },
    };
    atlas.texture = textureAsset.resource;

    const sprite = new Sprite(app.graphicsDevice, {
      atlas: atlas,
      frameKeys: [1],
      pixelsPerUnit: 512, // Block 클래스의 textureSize와 동일한 값
      renderMode: SPRITE_RENDERMODE_SIMPLE,
    });

    const spriteAsset = new Asset(`level_${index}`, "sprite", {
      url: "",
    });
    spriteAsset.resource = sprite;
    spriteAsset.loaded = true;
    app.assets.add(spriteAsset);
    app.assets.load(spriteAsset);
  });

  createGameManager(app);
  createInputHandler(app);
  createDeadline(app);

  evt.emit("view:game");
};

import * as pc from "playcanvas";

const createSpriteAsset = function (atlas, frame) {
  const sprite = new pc.Sprite(pc.app.graphicsDevice, {
    atlas: atlas,
    frameKeys: [frame],
    pixelsPerUnit: 100,
    renderMode: pc.SPRITE_RENDERMODE_SIMPLE,
  });

  const spriteAsset = new pc.Asset("sprite", "sprite", { url: "" });
  spriteAsset.resource = sprite;
  spriteAsset.loaded = true;
  pc.app.assets.add(spriteAsset);
  return spriteAsset;
};
export { createSpriteAsset };

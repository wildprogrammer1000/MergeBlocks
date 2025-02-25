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

const hexToRgb = (hex) => {
  // HEX 코드 정리 (# 제거)
  hex = hex.replace(/^#/, "");

  // 짧은 HEX 코드 (#FFF → #FFFFFF) 변환
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // 16진수를 10진수 RGB 값으로 변환
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};
export { createSpriteAsset, hexToRgb };

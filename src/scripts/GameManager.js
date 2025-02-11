import {
  Asset,
  Entity,
  math,
  Script,
  Sprite,
  SPRITE_RENDERMODE_SIMPLE,
  TextureAtlas,
  Vec2,
  Vec3,
  Vec4,
} from "playcanvas";

class GameManager extends Script {
  initialize() {
    this.textureSize = 512;
    this.app = this.app;

    this.app.on("pointer:down", this.onPointerDown, this);
    this.app.on("pointer:move", this.onPointerMove, this);
    this.app.on("pointer:up", this.onPointerUp, this);

    this.blocks = [];
    this.currentBlock = this.createBlock();
  }

  createBlock() {
    const block = new Entity("Block");
    const textureAsset = this.app.assets.find("cat");
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
    block.addComponent("sprite");
    block.sprite.spriteAsset = this.createSpriteAsset(atlas, 1).id;

    block.setPosition(0, 8, 0);
    block.addComponent("rigidbody", {
      type: "dynamic",
      enabled: false,
    });
    block.addComponent("collision", {
      type: "sphere",
    });
    block.rigidbody.friction = 0.5;
    block.rigidbody.linearFactor = new Vec3(1, 1, 0);
    block.rigidbody.angularFactor = new Vec3(0, 0, 1);
    this.app.root.addChild(block);
    this.blocks.push(block);
    return block;
  }

  onPointerDown(event) {
    const { x, y } = event;
    this.currentBlock.setPosition(
      math.clamp(
        x,
        -4.7 + this.currentBlock.collision.radius / 2,
        4.7 - this.currentBlock.collision.radius / 2
      ),
      this.currentBlock.getPosition().y,
      0
    );
  }

  onPointerMove(event) {
    const { x } = event;
    this.currentBlock.setPosition(
      math.clamp(
        x,
        -4.7 + this.currentBlock.collision.radius / 2,
        4.7 - this.currentBlock.collision.radius / 2
      ),
      this.currentBlock.getPosition().y,
      0
    );
  }

  onPointerUp() {
    this.currentBlock.rigidbody.enabled = true;
    this.currentBlock = this.createBlock();
  }
  createSpriteAsset = function (atlas, frame) {
    const sprite = new Sprite(this.app.graphicsDevice, {
      atlas: atlas,
      frameKeys: [frame],
      pixelsPerUnit: this.textureSize,
      renderMode: SPRITE_RENDERMODE_SIMPLE,
    });

    const spriteAsset = new Asset("sprite", "sprite", { url: "" });
    spriteAsset.resource = sprite;
    spriteAsset.loaded = true;
    this.app.assets.add(spriteAsset);
    return spriteAsset;
  };
}

export const createGameManager = (app) => {
  const entity = new Entity("GameManager", app);
  entity.addComponent("script");
  entity.script.create(GameManager);
  app.root.addChild(entity);
};

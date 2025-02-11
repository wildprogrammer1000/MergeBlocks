import {
  Asset,
  BODYTYPE_DYNAMIC,
  BODYTYPE_STATIC,
  Entity,
  math,
  Sprite,
  SPRITE_RENDERMODE_SIMPLE,
  TextureAtlas,
  Vec2,
  Vec3,
  Vec4,
} from "playcanvas";
import { levels } from "@/assets/json/block_levels.js";
import { BlockController } from "@/scripts/BlockController";

class Block extends Entity {
  static DROP_FORCE = 40;
  constructor(app) {
    super("Block", app);
    this.level = Math.floor(math.random(0, 4));
    this.tags.add(["block", this.level]);

    this.mass = levels[this.level].mass;
    this.blockScale = levels[this.level].scale;

    this.textureSize = 512;
    this.app = app;

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
    this.addComponent("sprite");
    this.sprite.spriteAsset = this.createSpriteAsset(atlas, 1).id;

    this.setPosition(0, 8, 0);
    this.setLocalScale(this.blockScale, this.blockScale, this.blockScale);

    this.addComponent("collision", {
      type: "sphere",
      radius: this.blockScale / 2,
    });
    this.addComponent("rigidbody", {
      type: BODYTYPE_STATIC,
      enabled: true,
      // mass: this.mass,
    });
    this.rigidbody.on("collisionstart", this.onCollisionStart, this);

    this.rigidbody.restitution = 0.3;
    this.rigidbody.friction = 0.3;
    this.rigidbody.linearFactor = new Vec3(1, 1, 0);
    this.rigidbody.angularFactor = new Vec3(0, 0, 1);

    this.app.root.addChild(this);
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
  drop() {
    this.rigidbody.type = BODYTYPE_DYNAMIC;
    this.rigidbody.mass = this.mass;
    this.rigidbody.applyImpulse(new Vec3(0, -Block.DROP_FORCE * this.mass, 0));

    this.addComponent("script");
    this.script.create(BlockController);
  }
  upgrade() {
    if (this.level < levels.length - 1) {
      this.level++;
      this.blockScale = levels[this.level].scale;
      this.mass = levels[this.level].mass;
      this.setLocalScale(this.blockScale, this.blockScale, this.blockScale);
      this.rigidbody.mass = this.mass;
      this.collision.radius = this.blockScale / 2;
    }
  }
  onCollisionStart({ other }) {
    if (!other.tags.has("block")) return;
    if (other.tags.has("block")) {
      if (this.level === other.level) {
        const velocity = this.rigidbody.linearVelocity.length();
        const otherVelocity = other.rigidbody.linearVelocity.length();
        if (velocity <= otherVelocity) {
          this.app.fire("score:get", this.level);
          other.destroy();
          this.upgrade();
        }
      }
    }
  }
}

export default Block;

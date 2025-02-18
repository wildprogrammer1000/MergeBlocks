import {
  BODYTYPE_DYNAMIC,
  BODYTYPE_STATIC,
  Entity,
  math,
  Vec3,
} from "playcanvas";
import { levels } from "@/assets/json/block_levels.js";
import { BlockController } from "@/gamescripts/BlockController";
import evt from "@/utils/event-handler";

class Block extends Entity {
  static SPAWN_HEIGHT = 8;
  static DROP_FORCE = 40;

  constructor(app) {
    super("Block", app);
    this.level = Math.floor(math.random(0, 4));
    this.tags.add(["block", this.level]);

    this.mass = levels[this.level].mass;
    this.blockScale = levels[this.level].scale;
    this.app = app;
    this.createdAt = this.app._time;

    this.textureSize = 512;

    this.addComponent("sprite");
    this.sprite.spriteAsset = this.app.assets.find(`level_${this.level}`).id;

    this.setPosition(0, Block.SPAWN_HEIGHT, 0);
    this.setLocalScale(this.blockScale, this.blockScale, this.blockScale);

    this.addComponent("collision", {
      type: "sphere",
      radius: this.blockScale / 2,
    });
    this.addComponent("rigidbody", {
      type: BODYTYPE_STATIC,
      enabled: false,
    });
    this.rigidbody.on("collisionstart", this.onCollisionStart, this);

    this.rigidbody.restitution = 0.3;
    this.rigidbody.friction = 0.3;
    this.rigidbody.linearFactor = new Vec3(1, 1, 0);
    this.rigidbody.angularFactor = new Vec3(0, 0, 1);

    this.app.root.addChild(this);
  }
  drop() {
    if (!this.rigidbody) return;
    this.rigidbody.enabled = true;
    this.rigidbody.type = BODYTYPE_DYNAMIC;
    this.rigidbody.mass = this.mass;
    this.rigidbody.applyImpulse(new Vec3(0, -Block.DROP_FORCE * this.mass, 0));

    this.addComponent("script");
    this.script.create(BlockController);
  }
  upgrade() {
    if (this.level < levels.length - 1) {
      this.level += 1;
      this.blockScale = levels[this.level].scale;
      this.mass = levels[this.level].mass;
      this.setLocalScale(this.blockScale, this.blockScale, this.blockScale);
      this.rigidbody.mass = this.mass;
      this.collision.radius = this.blockScale / 2;
      const spriteAsset = this.app.assets.find(`level_${this.level}`);
      this.sprite.spriteAsset = spriteAsset.id;
    } else {
      this.destroy();
      for (let i = 0; i < 5; i++) {
        setTimeout(() => evt.emit("confetti"), i * 200);
      }
    }
  }
  execDestroy(position) {
    this.rigidbody.enabled = false;
    this.isDestroying = true;
    this.destroyTargetPosition = position;
  }
  onCollisionStart({ other }) {
    if (!other.tags.has("block")) return;
    if (other.tags.has("block")) {
      if (this.level === other.level) {
        const velocity = this.rigidbody.linearVelocity.length();
        const otherVelocity = other.rigidbody.linearVelocity.length();
        if (velocity < otherVelocity) {
          this.app.fire("score:get", this.level);
          other.execDestroy(this.getPosition().clone());
          this.upgrade();
        } else {
          if (this.createdAt < other.createdAt) {
            this.app.fire("score:get", other.level);
            other.execDestroy(this.getPosition().clone());
            this.upgrade();
          }
        }
      }
    }
  }
}

export default Block;

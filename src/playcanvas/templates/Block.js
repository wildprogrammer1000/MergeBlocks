import {
  BODYTYPE_DYNAMIC,
  BODYTYPE_STATIC,
  Entity,
  math,
  Vec3,
} from "playcanvas";
import { levels } from "@/assets/json/block_levels.js";
import { BlockController } from "@/playcanvas/gamescripts/BlockController";
import evt from "@/utils/event-handler";
import { QuadraticOut } from "@/utils/tween";
import { findSpriteAsset } from "@/utils/functions";

class Block extends Entity {
  static SPAWN_HEIGHT = 8;
  static DROP_FORCE = 40;
  static SPAWN_POSIITON = new Vec3(0, Block.SPAWN_HEIGHT, 0);

  constructor(
    app,
    isStatic = true,
    level = Math.floor(math.random(0, 4)),
    pos = Block.SPAWN_POSIITON
  ) {
    super("Block", app);
    this.app = app;
    this.level = level;
    this.tags.add(["block", this.level]);

    this.mass = levels[this.level].mass;
    this.blockScale = levels[this.level].scale;
    this.createdAt = this.app._time;

    this.textureSize = 512;

    this.addComponent("sprite");
    this.sprite.spriteAsset = findSpriteAsset(`block_${this.level}`);

    this.setPosition(pos.x, pos.y, pos.z);
    this.tween(this.getLocalScale())
      .to({ x: this.blockScale, y: this.blockScale, z: this.blockScale }, 0.2)
      .start();

    this.addComponent("collision", {
      type: "sphere",
      radius: this.blockScale / 2,
    });
    this.addComponent("rigidbody", {
      type: isStatic ? BODYTYPE_STATIC : BODYTYPE_DYNAMIC,
      enabled: isStatic ? false : true,
      mass: this.mass,
    });
    this.rigidbody.on("collisionstart", this.onCollisionStart, this);

    this.rigidbody.restitution = 0.3;
    this.rigidbody.friction = 0.3;
    this.rigidbody.linearFactor = new Vec3(1, 1, 0);
    this.rigidbody.angularFactor = new Vec3(0, 0, 1);

    this.addComponent("script");
    this.script.create(BlockController);

    this.app.root.addChild(this);

    this.on("block:destroyedByItem", this.onDestroyedByItem, this);
  }
  drop() {
    if (!this.rigidbody) return;
    this.rigidbody.enabled = true;
    this.rigidbody.type = BODYTYPE_DYNAMIC;
    this.rigidbody.mass = this.mass;
    this.rigidbody.applyImpulse(new Vec3(0, -Block.DROP_FORCE * this.mass, 0));
  }
  execUpgrade({ targetPosition, destroyPosition }) {
    this.app.fire("score:get", this.level);
    this.app.fire("block:merge", {
      level: this.level,
      position: targetPosition,
    });
    this.execDestroy({ targetPosition, destroyPosition });
  }
  execDestroy({ targetPosition, destroyPosition }) {
    if (this._isDestroying) return;
    this._isDestroying = true;

    this.rigidbody.enabled = false;

    const destroyPos = destroyPosition.clone();
    const targetPos = targetPosition.clone();

    if (this._destroyTween) {
      this._destroyTween.stop();
    }

    this._destroyTween = this.tween(this.getLocalPosition())
      .to(
        { x: destroyPos.x, y: destroyPos.y, z: destroyPos.z },
        0.3,
        QuadraticOut
      )
      .start()
      .onComplete(() => {
        this._safeDestroy();
      });

    this._scaleTween = this.tween(this.getLocalScale())
      .to({ x: 0.1, y: 0.1, z: 0.1 }, 0.3, QuadraticOut)
      .start();

    this.app.fire("sound:play", "pop");
    this.app.fire("block:particle", {
      level: this.level,
      position: targetPos,
    });
  }

  _safeDestroy() {
    if (this._destroyed) return;
    this._destroyed = true;

    if (this._destroyTween) {
      this._destroyTween.stop();
      this._destroyTween = null;
    }
    if (this._scaleTween) {
      this._scaleTween.stop();
      this._scaleTween = null;
    }

    this.destroy();
  }

  onCollisionStart({ other }) {
    if (!other.tags.has("block")) return;
    if (this.level !== other.level) return;
    if (!this.rigidbody.enabled) return;

    const velocity = this.rigidbody.linearVelocity.length();
    const otherVelocity = other.rigidbody.linearVelocity.length();

    // Reward
    if (this.level === levels.length - 1 || this.level === levels.length - 2)
      this.app.fire("block:maxLevelMerged", {
        level: this.level,
        position: this.getPosition(),
      });

    if (this.level === levels.length - 1) {
      this.app.fire("sound:play", "bang");
      this.execDestroy({
        targetPosition: this.getPosition(),
        destroyPosition: this.getPosition(),
      });
      other.execDestroy({
        targetPosition: other.getPosition(),
        destroyPosition: this.getPosition(),
      });
      for (let i = 0; i < 5; i++) {
        setTimeout(() => evt.emit("confetti"), i * 200);
      }
      this.app.fire("score:get", this.level);
    } else {
      if (velocity < otherVelocity) {
        this.execUpgrade({
          targetPosition: this.getPosition(),
          destroyPosition: this.getPosition(),
        });
        other.execDestroy({
          targetPosition: other.getPosition(),
          destroyPosition: this.getPosition(),
        });
      } else {
        if (this.createdAt < other.createdAt) {
          this.execUpgrade({
            targetPosition: this.getPosition(),
            destroyPosition: this.getPosition(),
          });
          other.execDestroy({
            targetPosition: other.getPosition(),
            destroyPosition: this.getPosition(),
          });
        }
      }
    }
  }
  onDestroyedByItem({ item }) {
    switch (item) {
      default:
    }
    this.execDestroy({
      targetPosition: this.getPosition(),
      destroyPosition: this.getPosition(),
    });
  }
}

export default Block;

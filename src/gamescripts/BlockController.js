import { BODYTYPE_DYNAMIC, Script, Vec3 } from "playcanvas";

export class BlockController extends Script {
  static GRAVITY = new Vec3(0, -9.81, 0);
  initialize() {
    this.entity.rigidbody.on("triggerenter", this.onTriggerEnter, this);
    this.entity.rigidbody.on("triggerleave", this.onTriggerLeave, this);

    this.vec3 = new Vec3();
    this.entity.on("destroy", this.onDestroy, this);
  }
  update(dt) {
    if (this.entity.isDestroying) {
      let distance = this.entity
        .getPosition()
        .distance(this.entity.destroyTargetPosition);
      if (distance < 0.1) {
        this.entity.destroy();
      } else {
        let scale = this.entity.getLocalScale();
        if (scale.x > 0) {
          scale.x -= dt * 10;
          scale.y -= dt * 10;
          scale.z -= dt * 10;
          this.entity.setLocalScale(scale, scale, scale);
        }
        if (this.entity.sprite && this.entity.sprite.opacity > 0) {
          this.entity.sprite.opacity -= dt * 10;
        }

        this.vec3.lerp(
          this.entity.getPosition(),
          this.entity.destroyTargetPosition,
          0.3
        );
        this.entity.setPosition(this.vec3);
      }
      return;
    }
    if (
      this.entity.rigidbody &&
      this.entity.rigidbody.type === BODYTYPE_DYNAMIC
    ) {
      this.entity.rigidbody.applyForce(BlockController.GRAVITY);
      if (this.app._time % 2 === 0) this.checkCollision();
    }
  }
  checkCollision() {
    const blocks = this.app.root
      .findByTag("block")
      .filter((e) => e !== this.entity);

    blocks.forEach((block) => {
      if (
        this.entity.level === block.level &&
        this.entity.rigidbody?.enabled &&
        block.rigidbody?.enabled
      ) {
        const distance = this.entity
          .getPosition()
          .distance(block.getPosition());
        if (
          distance - (this.entity.collision.radius + block.collision.radius) <
          0.01
        ) {
          this.app.fire("score:get", this.entity.level);
          block.execDestroy(this.entity.getPosition().clone());
          this.entity.upgrade();
        }
      }
    });
  }
  onTriggerEnter(result) {
    if (result.tags.has("deadline"))
      this.app.fire("deadline:enter", this.entity);
  }
  onTriggerLeave(result) {
    if (result.tags.has("deadline"))
      this.app.fire("deadline:leave", this.entity);
  }
  onDestroy() {
    this.app.fire("deadline:leave", this.entity);
  }
}

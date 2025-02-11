import { BODYTYPE_DYNAMIC, Script } from "playcanvas";

export class BlockController extends Script {
  initialize() {
    this.entity.rigidbody.on("triggerenter", this.onTriggerEnter, this);
    this.entity.rigidbody.on("triggerleave", this.onTriggerLeave, this);

    this.entity.on("destroy", this.onDestroy, this);
  }
  update() {
    if (
      this.entity.rigidbody.type === BODYTYPE_DYNAMIC &&
      this.app._time % 3 === 0
    )
      this.checkCollision();
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
        if (distance < this.entity.collision.radius + block.collision.radius) {
          this.app.fire("score:get", this.entity.level);
          block.destroy();
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

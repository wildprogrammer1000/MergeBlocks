import { BODYTYPE_DYNAMIC, Script, Vec3 } from "playcanvas";

export class BlockController extends Script {
  static GRAVITY = new Vec3(0, -9.81, 0);
  initialize() {
    this.entity.rigidbody.on("triggerenter", this.onTriggerEnter, this);
    this.entity.rigidbody.on("triggerleave", this.onTriggerLeave, this);

    this.entity.on("destroy", this.onDestroy, this);
  }
  update() {
    if (
      this.entity.rigidbody &&
      this.entity.rigidbody.type === BODYTYPE_DYNAMIC
    ) {
      this.entity.rigidbody.applyForce(BlockController.GRAVITY);
    }
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

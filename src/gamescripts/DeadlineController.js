import { Script } from "playcanvas";

class DeadlineController extends Script {
  initialize() {
    this.COUNT_DOWN_TIME = 5;
    this.app.on("deadline:enter", this.onDeadlineEnter, this);
    this.app.on("deadline:leave", this.onDeadlineLeave, this);
    this.on("destroy", this.onDestroy, this);

    this.detected = new Map();
    this.timer = false;
    this.gameOverTime = this.COUNT_DOWN_TIME;
    this.timerStarter = null;
  }
  update(dt) {
    if (this.app._time % 1 === 0 && this.detected.size === 0) {
      this.timer = false;
      this.app.fire("game:countdown", 0);
    }
    if (this.timer) {
      if (this.gameOverTime > 0) {
        this.gameOverTime -= dt;
        this.app.fire("game:countdown", this.gameOverTime);
      } else {
        if (this.timerStarter) {
          clearTimeout(this.timerStarter);
          this.timerStarter = null;
        }
        this.app.fire("game:over");
        this.timer = false;
      }
    }
  }
  onDeadlineEnter(entity) {
    this.detected.set(entity.getGuid(), entity);
    this.timerStarter = setTimeout(() => {
      this.timer = true;
    }, 1000);
  }
  onDeadlineLeave(entity) {
    this.detected.delete(entity.getGuid());
    if (this.detected.size === 0) {
      this.app.fire("game:countdown", 0);
      if (this.timerStarter) {
        clearTimeout(this.timerStarter);
        this.timerStarter = null;
      }
      this.timer = false;
      this.gameOverTime = this.COUNT_DOWN_TIME;
    }
  }
  onDestroy() {
    this.app.off("deadline:enter", this.onDeadlineEnter, this);
    this.app.off("deadline:leave", this.onDeadlineLeave, this);
  }
}

export default DeadlineController;

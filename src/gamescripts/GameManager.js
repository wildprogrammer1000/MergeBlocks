import Block from "@/templates/Block";
import { Entity, math, Script } from "playcanvas";

class GameManager extends Script {
  initialize() {
    this.score = 0;
    this.point = 0;
    this.pointCombo = 0;
    this.pointComboTimeout = 0;

    this.app.on("pointer:down", this.onPointerDown, this);
    this.app.on("pointer:move", this.onPointerMove, this);
    this.app.on("pointer:up", this.onPointerUp, this);
    this.app.on("game:over", this.onGameOver, this);
    this.app.on("game:restart", this.onGameRestart, this);
    this.app.on("score:get", this.onScoreGet, this);

    this.currentBlock = this.createBlock();

    this.on("destroy", this.onDestroy, this);
  }
  onDestroy() {
    if (this.createTimer) clearTimeout(this.createTimer);
    this.app.off("pointer:down", this.onPointerDown, this);
    this.app.off("pointer:move", this.onPointerMove, this);
    this.app.off("pointer:up", this.onPointerUp, this);
    this.app.off("game:over", this.onGameOver, this);
    this.app.off("game:restart", this.onGameRestart, this);
    this.app.off("score:get", this.onScoreGet, this);
  }

  createBlock() {
    return new Block(this.app);
  }
  moveBlock(x) {
    this.currentBlock.setPosition(
      math.clamp(
        x,
        -5 + this.currentBlock.blockScale / 2,
        5 - this.currentBlock.blockScale / 2
      ),
      this.currentBlock.getPosition().y,
      0
    );
  }
  onPointerDown(event) {
    if (!this.currentBlock || this.isWaiting || this.gameOver) return;
    const { x } = event;
    this.moveBlock(x);
  }

  onPointerMove(event) {
    if (!this.currentBlock || this.isWaiting || this.gameOver) return;
    const { x } = event;
    this.moveBlock(x);
  }

  onPointerUp(event) {
    if (!this.currentBlock || this.isWaiting || this.gameOver) return;
    const { x } = event;
    this.moveBlock(x);
    this.currentBlock.drop();
    this.isWaiting = true;

    this.createTimer = setTimeout(() => {
      this.isWaiting = false;
      this.currentBlock = this.createBlock();
    }, 200);
  }
  onGameOver() {
    this.gameOver = true;
  }
  onGameRestart() {
    this.gameOver = false;
    const block = this.app.root.findByTag("block");
    block.forEach((b) => {
      b.destroy();
    });
    this.currentBlock = this.createBlock();

    this.score = 0;
    // reset point
    this.point = 0;
    this.pointCombo = 0;
    this.app.fire("point:update", this.point, this.pointCombo);
  }
  onScoreGet(level) {
    this.score += (level + 1) * (level + 2) * 0.5;

    if (this.pointComboTimeout) {
      this.point += 1;
      this.pointCombo += 1;
      clearTimeout(this.pointComboTimeout);
    }

    this.pointComboTimeout = setTimeout(() => {
      this.pointCombo = 0;
      this.app.fire("score:update", {
        score: this.score,
        point: this.point,
        pointCombo: this.pointCombo,
      });
    }, 500);
    this.app.fire("score:update", {
      score: this.score,
      point: this.point,
      pointCombo: this.pointCombo,
    });
  }
}

export const createGameManager = (app) => {
  const entity = new Entity("GameManager", app);
  entity.addComponent("script");
  entity.script.create(GameManager);
  app.root.addChild(entity);
};

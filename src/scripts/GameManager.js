import Block from "@/templates/Block";
import { Entity, math, Script } from "playcanvas";

class GameManager extends Script {
  initialize() {
    this.app.on("pointer:down", this.onPointerDown, this);
    this.app.on("pointer:move", this.onPointerMove, this);
    this.app.on("pointer:up", this.onPointerUp, this);
    this.app.on("game:over", this.onGameOver, this);
    this.app.on("game:restart", this.onGameRestart, this);

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
  }

  createBlock() {
    return new Block(this.app);
  }
  moveBlock(x) {
    this.currentBlock.setPosition(
      math.clamp(
        x,
        -4.85 + this.currentBlock.blockScale / 2,
        4.85 - this.currentBlock.blockScale / 2
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
  }
}

export const createGameManager = (app) => {
  const entity = new Entity("GameManager", app);
  entity.addComponent("script");
  entity.script.create(GameManager);
  app.root.addChild(entity);
};

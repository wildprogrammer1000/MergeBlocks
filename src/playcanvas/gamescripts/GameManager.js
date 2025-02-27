import { getReward } from "@/api/rpc";
import Block from "@/templates/Block";
import { BlockParticle } from "@/templates/BlockParticle";
import { Entity, math, Script } from "playcanvas";

class GameManager extends Script {
  initialize() {
    this.score = 0;
    this.point = 0;
    this.pointCombo = 0;
    this.pointComboTimeout = 0;
    this.mainCamera = this.app.root.findByName("Camera");
    this.textures = [
      this.app.assets.find("block_0"),
      this.app.assets.find("block_1"),
      this.app.assets.find("block_2"),
      this.app.assets.find("block_3"),
      this.app.assets.find("block_4"),
      this.app.assets.find("block_5"),
      this.app.assets.find("block_6"),
      this.app.assets.find("block_7"),
      this.app.assets.find("block_8"),
      this.app.assets.find("block_9"),
      this.app.assets.find("block_10"),
    ];

    this.app.on("pointer:down", this.onPointerDown, this);
    this.app.on("pointer:move", this.onPointerMove, this);
    this.app.on("pointer:up", this.onPointerUp, this);
    this.app.on("game:over", this.onGameOver, this);
    this.app.on("game:restart", this.onGameRestart, this);
    this.app.on("score:get", this.onScoreGet, this);
    this.app.on("game:view", this.onGameView, this);
    this.app.on("asset:applyTheme", this.onApplyTheme, this);
    this.app.on("block:merge", this.onBlockMerge, this);
    // this.app.on("block:maxLevelMerged", this.onBlockMaxLevelMerged, this);
    this.app.on("block:particle", this.onBlockParticle, this);
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
    this.app.off("game:view", this.onGameView, this);
    this.app.off("asset:applyTheme", this.onApplyTheme, this);
    this.app.off("block:merge", this.onBlockMerge, this);
    this.app.off("block:maxLevelMerged", this.onBlockMaxLevelMerged, this);
    this.app.off("block:particle", this.onBlockParticle, this);
  }
  onApplyTheme() {
    this.textures = [
      this.app.assets.find("block_0"),
      this.app.assets.find("block_1"),
      this.app.assets.find("block_2"),
      this.app.assets.find("block_3"),
      this.app.assets.find("block_4"),
      this.app.assets.find("block_5"),
      this.app.assets.find("block_6"),
      this.app.assets.find("block_7"),
      this.app.assets.find("block_8"),
      this.app.assets.find("block_9"),
      this.app.assets.find("block_10"),
    ];
  }

  createBlock() {
    return new Block(this.app, { isStatic: true });
  }
  moveBlock(x) {
    this.currentBlock.setPosition(
      math.clamp(
        x,
        -5.5 + this.currentBlock.blockScale / 2,
        5.5 - this.currentBlock.blockScale / 2
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
    this.app.fire("sound:play", "drop");
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
  onGameView() {
    const orthoHeights = [10, 12.5, 15];
    const orthoHeight = this.mainCamera.camera.orthoHeight;
    if (orthoHeight === orthoHeights[0]) {
      this.mainCamera.camera.orthoHeight = orthoHeights[1];
    } else if (orthoHeight === orthoHeights[1]) {
      this.mainCamera.camera.orthoHeight = orthoHeights[2];
    } else {
      this.mainCamera.camera.orthoHeight = orthoHeights[0];
    }
  }
  playParticle({ level, position }) {
    const particle = new BlockParticle({ level });
    particle.setPosition(position);
    this.app.root.addChild(particle);
    particle.particlesystem.colorMapAsset = this.textures[level].id;
    particle.particlesystem.play();
    setTimeout(() => particle.destroy(), 1000);
  }
  onBlockMerge({ level, position }) {
    new Block(this.app, false, level + 1, position);
  }
  async onBlockMaxLevelMerged(level) {
    const a = await getReward(level);
    console.log("a: ", a);
  }
  onBlockParticle({ level, position }) {
    this.playParticle({ level, position });
  }
}

export const createGameManager = (app) => {
  const entity = new Entity("GameManager", app);
  entity.addComponent("script");
  entity.script.create(GameManager);
  app.root.addChild(entity);
};

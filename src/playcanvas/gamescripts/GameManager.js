import { doUseItem, getReward } from "@/api/rpc";
import Block from "@/playcanvas/templates/Block";
import { BlockParticle } from "@/playcanvas/templates/BlockParticle";
import evt from "@/utils/event-handler";
import { BackIn, QuadraticInOut } from "@/utils/tween";
import { Entity, math, Script, Vec3 } from "playcanvas";
import Diamond from "../templates/Diamond";

class GameManager extends Script {
  initialize() {
    this.score = 0;
    this.point = 0;
    this.pointCombo = 0;
    this.pointComboTimeout = 0;
    this.mainCamera = this.app.root.findByName("Camera");
    this.textures = [
      this.app.assets.find("block_0", "texture"),
      this.app.assets.find("block_1", "texture"),
      this.app.assets.find("block_2", "texture"),
      this.app.assets.find("block_3", "texture"),
      this.app.assets.find("block_4", "texture"),
      this.app.assets.find("block_5", "texture"),
      this.app.assets.find("block_6", "texture"),
      this.app.assets.find("block_7", "texture"),
      this.app.assets.find("block_8", "texture"),
      this.app.assets.find("block_9", "texture"),
      this.app.assets.find("block_10", "texture"),
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
    this.app.on("block:maxLevelMerged", this.onBlockMaxLevelMerged, this);
    this.app.on("block:particle", this.onBlockParticle, this);
    this.app.on("item:random_blast", this.onUseRandomBlast, this);
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
    this.app.off("item:random_blast", this.onUseRandomBlast, this);
  }
  onApplyTheme() {
    this.textures = [
      this.app.assets.find("block_0", "texture"),
      this.app.assets.find("block_1", "texture"),
      this.app.assets.find("block_2", "texture"),
      this.app.assets.find("block_3", "texture"),
      this.app.assets.find("block_4", "texture"),
      this.app.assets.find("block_5", "texture"),
      this.app.assets.find("block_6", "texture"),
      this.app.assets.find("block_7", "texture"),
      this.app.assets.find("block_8", "texture"),
      this.app.assets.find("block_9", "texture"),
      this.app.assets.find("block_10", "texture"),
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
  doRaycast(event) {
    const start = new Vec3(event.x, event.y, -100);
    const end = new Vec3(event.x, event.y, 100);
    const rayResult = this.app.systems.rigidbody.raycastFirst(start, end);
    return rayResult;
  }
  async onUseRandomBlast() {
    try {
      const response = await doUseItem("item_random_blast");
      if (response.success) {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const blocks = this.app.root
              .findByTag("block")
              .filter((b) => !b.rigidbody.isStatic());
            if (blocks.length > 0) {
              const randomIndex = Math.floor(Math.random() * blocks.length);
              blocks[randomIndex].fire(
                "block:destroyedByItem",
                "item_random_blast"
              );
            }
          }, i * 300);
        }
        evt.emit("item:used", "item_random_blast");
      } else {
        if (response.reason && response.reason === "not enough")
          evt.emit("item:notEnough");
        else evt.emit("item:useFailed");
      }
    } catch (err) {
      console.error("err: ", err);
      evt.emit("item:useFailed");
    }
  }
  async onPointerDown(event) {
    this.usingItem = evt.call("item:using");
    if (this.usingItem || !this.currentBlock || this.isWaiting || this.gameOver)
      return;

    const { x } = event;
    this.moveBlock(x);
  }

  onPointerMove(event) {
    if (this.usingItem || !this.currentBlock || this.isWaiting || this.gameOver)
      return;
    const { x } = event;
    this.moveBlock(x);
  }

  async onPointerUp(event) {
    this.usingItem = evt.call("item:using");
    if (!this.currentBlock || this.isWaiting || this.gameOver) return;

    const { x } = event;

    if (this.usingItem) {
      try {
        const rayResult = this.doRaycast(event);
        if (
          rayResult &&
          rayResult.entity.tags.has("block") &&
          !rayResult.entity.rigidbody.isStatic()
        ) {
          const response = await doUseItem(this.usingItem);
          if (response.success) {
            rayResult.entity.fire("block:destroyedByItem", this.usingItem);
          } else {
            if (response.reason && response.reason === "not enough")
              evt.emit("item:notEnough");
            else evt.emit("item:useFailed");
          }
        } else {
          evt.emit("item:reselect");
          return;
        }
        evt.emit("item:used", this.usingItem);
        this.usingItem = null;
      } catch (err) {
        console.error("err: ", err);
      }
    } else {
      this.moveBlock(x);
      this.currentBlock.drop();
      this.isWaiting = true;

      this.createTimer = setTimeout(() => {
        this.isWaiting = false;
        this.currentBlock = this.createBlock();
      }, 200);
      this.app.fire("sound:play", "drop");
    }
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
  async onBlockMaxLevelMerged({ level, position }) {
    const targetDomPos = evt.call("diamond:container");
    const targetWorldPos = this.mainCamera.camera.screenToWorld(
      targetDomPos.x,
      targetDomPos.y,
      0
    );

    const result = await getReward(level);
    for (let i = 0; i < result.reward; i++) {
      const radius = Math.random() + 0.5;
      const randomTimeout = Math.random() * 500 + 200;
      setTimeout(() => {
        const angle = (i / result.reward) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const entity = new Diamond(this.app);
        entity.setLocalPosition(position);
        this.app.root.addChild(entity);
        entity.setEulerAngles(0, 0, Math.floor(Math.random() * 90) - 45);

        entity
          .tween(entity.getLocalPosition())
          .to(
            { x: position.x + x, y: position.y + y, z: 0 },
            0.1,
            QuadraticInOut
          )
          .start()
          .onComplete(() => {
            setTimeout(() => {
              entity
                .tween(entity.getLocalPosition())
                .to(
                  { x: targetWorldPos.x, y: targetWorldPos.y, z: 0 },
                  1,
                  BackIn
                )
                .start()
                .onComplete(() => {
                  evt.emit("diamond:update");
                  entity.destroy();
                });
            }, randomTimeout);
          });
      }, i * 30);
    }
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

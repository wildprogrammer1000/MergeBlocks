import { BLOCK_PARTICLE_SYSTEM } from "@/constants/components";
import { levels } from "@/assets/json/block_levels.js";
import { app, Entity } from "playcanvas";

export class BlockParticle extends Entity {
  constructor({ level }) {
    super();
    this.app = app;
    this.addComponent("particlesystem", {
      ...BLOCK_PARTICLE_SYSTEM,
    });
    const scale = levels[level].scale / 2;
    this.setLocalScale(scale, scale, scale);
  }
}

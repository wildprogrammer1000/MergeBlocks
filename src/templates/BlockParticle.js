import { BLOCK_PARTICLE_SYSTEM } from "@/constants/components";
import { app, Entity } from "playcanvas";

export class BlockParticle extends Entity {
  constructor() {
    super()
    this.app = app;
    this.addComponent("particlesystem", {
      ...BLOCK_PARTICLE_SYSTEM,
    });
  }
}

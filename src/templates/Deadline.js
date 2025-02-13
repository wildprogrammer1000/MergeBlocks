import DeadlineController from "@/gamescripts/DeadlineController";
import { Color, Entity, StandardMaterial, Vec3 } from "playcanvas";

class Deadline extends Entity {
  static DEADLINE_POSITION = 6.5;
  constructor(app) {
    super("Deadline", app);

    this.addComponent("render", {
      type: "box",
    });
    this.tags.add("deadline");
    this.setPosition(0, Deadline.DEADLINE_POSITION, 0);
    this.setLocalScale(10, 0.3, 10);
    const deadlineMaterial = new StandardMaterial();
    deadlineMaterial.diffuse = new Color(1, 0, 0);
    deadlineMaterial.update();
    this.render.material = deadlineMaterial;
    this.addComponent("collision", {
      type: "box",
      halfExtents: new Vec3(
        this.getLocalScale().x / 2,
        this.getLocalScale().y / 2,
        this.getLocalScale().z / 2
      ),
    });
    this.addComponent("script");
    this.script.create(DeadlineController);
  }
}

const createDeadline = (app) => {
  const entity = new Deadline(app);
  app.root.addChild(entity);
};

export { createDeadline };

import { createGameManager } from "@/playcanvas/gamescripts/GameManager";
import { createInputHandler } from "@/playcanvas/gamescripts/InputHandler";
import { createDeadline } from "@/playcanvas/templates/Deadline";
import evt from "@/utils/event-handler";
import { app } from "playcanvas";

export const initProjectScene = () => {
  createGameManager(app);
  createInputHandler(app);
  createDeadline(app);
  evt.emit("view:game");
};

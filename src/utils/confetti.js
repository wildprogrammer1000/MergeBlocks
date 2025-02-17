import JSConfetti from "js-confetti";
import evt from "./event-handler";

const confetti = new JSConfetti();

evt.on("confetti", () => confetti.addConfetti());

import main from "@/playcanvas/start";
import { app } from "playcanvas";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";

import { VscDebugRestart } from "react-icons/vsc";
import { IoShareSocialOutline } from "react-icons/io5";
import { addRecord } from "@/api/nakama";
import { useNakama } from "@/providers/NakamaProvider";
import { FaPause } from "react-icons/fa6";
import { WSButton } from "@/component/WSComponents";
import { IoMdHelp } from "react-icons/io";
import evt from "@/utils/event-handler";
import PauseModal from "@/component/modal/PauseModal";
import HelpModal from "@/component/modal/HelpModal";

const GamePage = () => {
  const { account } = useNakama();
  const navigate = useNavigate();
  const scoreRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [result, setResult] = useState(null);
  const [canShare, setCanShare] = useState(false);

  const updateScore = (level) => {
    if (gameOver) return;
    scoreRef.current += (level + 1) * (level + 2) * 0.5;
    setScore(scoreRef.current);
  };
  const onGameOver = async () => {
    const { records } = await addRecord(scoreRef.current);
    const ownerRecord = records.ownerRecords[0];
    const rank = ownerRecord.rank;
    const bestScore = ownerRecord.score;
    setResult({
      rank,
      bestScore,
    });
    setGameOver(true);
  };
  const onCountdown = (time) => {
    setCountdown(time.toFixed(2));
  };
  const restartGame = () => {
    app.fire("game:restart");
    scoreRef.current = 0;
    setScore(scoreRef.current);
    setGameOver(false);
    setResult(null);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Merge Blocks!",
        text: `I scored ${score} points! Can you beat my score?`,
        url: window.location.origin,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const initialize = async () => {
    setCanShare(!!navigator.share);

    const app = await main();

    app.on("score:get", updateScore);
    app.on("game:over", onGameOver);
    app.on("game:countdown", onCountdown);
  };

  useEffect(() => {
    if (!account) {
      navigate("/");
      return;
    }
    initialize();
    evt.on("restart", restartGame);

    return () => {
      evt.off("restart", restartGame);
      if (app) {
        app.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (app) app.on("score:get", updateScore);

    return () => {
      if (app) app.off("score:get", updateScore);
    };
  }, [gameOver]);
  return (
    <div className="w-full h-full select-none">
      {countdown > 0 && (
        <div className="absolute top-0 left-0 z-20 w-full h-full  flex flex-col items-center justify-center pointer-events-none">
          <div
            className={`text-[64px] font-bold ${
              parseInt(countdown) < 3 ? "text-red-400" : "text-white"
            } `}
          >
            {countdown}
          </div>
        </div>
      )}
      {gameOver && (
        <div className="absolute top-0 left-0 z-20 w-full h-full bg-black/50 flex flex-col gap-2 items-center justify-center">
          <div className="text-4xl font-bold text-white">GAME OVER</div>
          <div className="text-2xl font-bold text-white">SCORE: {score}</div>
          {result && (
            <div className="text-2xl font-bold text-white text-center">
              BEST SCORE: {result.bestScore} <br />
              My Rank: {result.rank}
            </div>
          )}
          <div className="flex gap-2 text-2xl font-bold text-white">
            <WSButton onClick={restartGame}>
              <VscDebugRestart />
            </WSButton>
            <WSButton onClick={() => navigate("/")}>
              <GoHomeFill />
            </WSButton>
            {canShare && (
              <WSButton onClick={handleShare}>
                <IoShareSocialOutline />
              </WSButton>
            )}
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 z-10 text-2xl font-bold text-[var(--color-chocolate-100)] bg-[var(--color-chocolate-900)]/50 px-4 py-2 rounded-2xl">
        SCORE: {score}
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2 ">
        <WSButton onClick={() => evt.emit("help")}>
          <IoMdHelp />
        </WSButton>
        <WSButton onClick={() => evt.emit("pause")}>
          <FaPause />
        </WSButton>
      </div>
      <canvas id="app-canvas" className="bg-black/50 w-full h-full" />
      <PauseModal />
      <HelpModal />
    </div>
  );
};

export default GamePage;

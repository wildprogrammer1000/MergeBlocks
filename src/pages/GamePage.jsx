import main from "@/playcanvas/start";
import { app } from "playcanvas";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { VscDebugRestart } from "react-icons/vsc";
import { IoShareSocialOutline } from "react-icons/io5";
import { addRecord } from "@/api/nakama";

const GamePage = () => {
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
    initialize();

    return () => {
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
            <button
              className="w-16 h-16 flex justify-center items-center text-4xl bg-[var(--color-chocolate-100)] text-[var(--color-chocolate-900)] px-4 py-2 rounded-2xl hover:bg-[var(--color-chocolate-900)] hover:text-[var(--color-chocolate-100)] transition-all duration-300 hover:border-white "
              onClick={restartGame}
            >
              <VscDebugRestart />
            </button>
            <Link
              className="w-16 h-16 flex justify-center items-center text-4xl bg-[var(--color-chocolate-100)] text-[var(--color-chocolate-900)] px-4 py-2 rounded-2xl hover:bg-[var(--color-chocolate-900)] hover:text-[var(--color-chocolate-100)] transition-all duration-300 hover:border-white "
              to="/"
            >
              <GoHome />
            </Link>
            {canShare && (
              <button
                className={`w-16 h-16 flex justify-center items-center text-4xl  text-[var(--color-chocolate-900)] px-4 py-2 rounded-2xl transition-all duration-300  ${
                  canShare
                    ? "bg-[var(--color-chocolate-100)] hover:text-[var(--color-chocolate-100)] hover:bg-[var(--color-chocolate-900)]"
                    : "opacity-50 cursor-not-allowed border-gray-400"
                }`}
                onClick={handleShare}
              >
                <IoShareSocialOutline />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 z-10 text-2xl font-bold text-[var(--color-chocolate-100)] bg-[var(--color-chocolate-900)]/50 px-4 py-2 rounded-2xl">
        SCORE: {score}
      </div>

      <Link
        to="/"
        className="absolute top-4 right-4 z-10 bg-[var(--color-chocolate-900)] text-[var(--color-chocolate-100)] hover:bg-[var(--color-chocolate-100)] hover:text-[var(--color-chocolate-900)] rounded-2xl  transition-all duration-300 w-12 h-12 flex justify-center items-center text-3xl "
      >
        <GoHome />
      </Link>
      <canvas id="app-canvas" className="bg-black/50 w-full h-full" />
    </div>
  );
};

export default GamePage;

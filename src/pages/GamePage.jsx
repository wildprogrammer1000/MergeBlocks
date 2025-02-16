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
import { WSButton } from "@/component/ui/WSComponents";
import { IoMdHelp } from "react-icons/io";
import evt from "@/utils/event-handler";
import PauseModal from "@/component/modal/PauseModal";
import HelpModal from "@/component/modal/HelpModal";
import WalletPoint from "@/component/ui/WalletPoint";

const GamePage = () => {
  const { account, refreshAccount } = useNakama();
  const navigate = useNavigate();
  const scoreRef = useRef(0);
  const pointRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [point, setPoint] = useState(0);
  const [pointCombo, setPointCombo] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [result, setResult] = useState(null);
  const [canShare, setCanShare] = useState(false);

  const updateScore = ({ score, point, pointCombo }) => {
    if (gameOver) return;
    scoreRef.current = score;
    pointRef.current = point;
    setPointCombo(pointCombo);
    setScore(scoreRef.current);
    setPoint(pointRef.current);
  };
  const updatePoint = (point) => {
    if (gameOver) return;
    pointRef.current = point;
    setPoint(pointRef.current);
  };
  const onGameOver = async () => {
    const { records } = await addRecord({
      score: scoreRef.current,
      point: pointRef.current,
    });
    const ownerRecord = records.ownerRecords[0];
    const rank = ownerRecord.rank;
    const bestScore = ownerRecord.score;
    setResult({
      rank,
      bestScore,
    });
    setGameOver(true);
    await refreshAccount();
  };
  const onCountdown = (time) => {
    setCountdown(time.toFixed(2));
  };
  const restartGame = () => {
    app.fire("game:restart");
    scoreRef.current = 0;
    pointRef.current = 0;
    setPointCombo(0);
    setScore(scoreRef.current);
    setPoint(pointRef.current);
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
      console.error("Error sharing:", error);
    }
  };

  const initialize = async () => {
    setCanShare(!!navigator.share);

    const app = await main();

    app.on("score:update", updateScore);
    app.on("point:update", updatePoint);
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
    if (app) app.on("score:update", updateScore);

    return () => {
      if (app) app.off("score:update", updateScore);
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
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="font-bold text-[var(--color-chocolate-100)] bg-[var(--color-chocolate-900)]/80 px-4 py-2 rounded-full">
          SCORE: {score}
        </div>
        <WalletPoint
          type="point"
          value={point}
          className="w-fit  bg-[var(--color-chocolate-900)]/80"
        />
        {pointCombo > 0 && (
          <i className="text-[var(--color-chocolate-900)] font-bold">
            {pointCombo} COMBO!
          </i>
        )}
      </div>

      <div className="absolute top-4 right-4 flex gap-2 ">
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

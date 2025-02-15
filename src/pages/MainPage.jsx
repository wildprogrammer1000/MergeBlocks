import { useNavigate } from "react-router-dom";
import evt from "@/utils/event-handler";
import Leaderboard from "@/component/Leaderboard";
import { FaPlay, FaUser } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { useNakama } from "@/providers/NakamaProvider";
import DisplayNameModal from "@/component/DisplayNameModal";
import Profile from "@/component/Profile";
import { useEffect, useState } from "react";

function MainPage() {
  const { account } = useNakama();
  const navigate = useNavigate();
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // 인앱 브라우저 체크
    const isInApp = /kakaotalk|line|instagram|facebook|naver|band/i.test(
      userAgent
    );

    setIsSupportedBrowser(!isInApp);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4 bg-[var(--color-background)]">
      <Timer />
      <h1 className="text-[80px] font-bold text-center leading-none text-[var(--color-chocolate-900)]">
        Merge
        <br />
        Blocks
      </h1>
      <div className="flex gap-4">
        {account && (
          <>
            <button
              className="w-16 h-16 text-3xl flex justify-center text-[var(--color-chocolate-900)] items-center text-center border-2 border-[var(--color-chocolate-900)] rounded-2xl hover:bg-[var(--color-chocolate-900)] hover:text-white transition-all duration-300 font-bold"
              onClick={() => {
                account.user.display_name
                  ? navigate("/game")
                  : evt.emit("displayname:init");
              }}
            >
              <FaPlay />
            </button>
            <button
              onClick={() => evt.emit("leaderboard:open")}
              className="w-16 h-16 text-3xl flex justify-center text-[var(--color-chocolate-900)] items-center text-center border-2 border-[var(--color-chocolate-900)] rounded-2xl hover:bg-[var(--color-chocolate-900)] hover:text-white transition-all duration-300 font-bold cursor-pointer"
            >
              <MdLeaderboard />
            </button>
          </>
        )}
      </div>
      {account && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => {
              if (isSupportedBrowser) {
                evt.emit("profile:open");
              } else {
                alert(
                  "This feature is not supported in in-app browsers.\nPlease use browsers\n(Chrome , Safari, etc.)"
                );
              }
            }}
            className="w-12 h-12 text-xl flex justify-center text-[var(--color-chocolate-900)] items-center text-center border-2 border-[var(--color-chocolate-900)] rounded-xl hover:bg-[var(--color-chocolate-900)] hover:text-white transition-all duration-300"
          >
            <FaUser />
          </button>
        </div>
      )}
      <Profile />
      <Leaderboard />
      <DisplayNameModal />
    </div>
  );
}

export default MainPage;

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const finishTime = new Date("2025-02-21T00:00:00");

    const timer = setInterval(() => {
      const now = new Date();
      const difference = finishTime - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  if (
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  )
    return null;
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 items-center font-bold border-2 border-[var(--color-chocolate-900)] rounded-full px-2">
      <TimeUnit value={timeLeft.days} unit="D" />
      <TimeUnit value={timeLeft.hours} unit="H" />
      <TimeUnit value={timeLeft.minutes} unit="M" />
      <TimeUnit value={timeLeft.seconds} unit="S" />
    </div>
  );
};

const TimeUnit = ({ value, unit }) => (
  <div className="flex items-center gap-1 text-[var(--color-chocolate-900)]">
    <span className="min-w-[2ch] text-center">
      {value.toString().padStart(2, "0")}
    </span>
    <span className="text-sm">{unit}</span>
  </div>
);

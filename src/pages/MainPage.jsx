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

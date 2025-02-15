import { useNavigate } from "react-router-dom";
import evt from "@/utils/event-handler";
import Leaderboard from "@/component/Leaderboard";
import { FaPlay, FaUser } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { useNakama } from "@/providers/NakamaProvider";
import DisplayNameModal from "@/component/DisplayNameModal";
import Profile from "@/component/Profile";
import { useEffect, useState } from "react";
import Timer from "@/component/Timer";
import Chat from "@/component/Chat";
import { WSButton } from "@/component/WSComponents";
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
            <WSButton
              onClick={() => {
                account.user.display_name
                  ? navigate("/game")
                  : evt.emit("displayname:init");
              }}
            >
              <FaPlay />
            </WSButton>
            <WSButton onClick={() => evt.emit("leaderboard:open")}>
              <MdLeaderboard />
            </WSButton>
          </>
        )}
      </div>
      {account && (
        <div className="absolute top-4 right-4">
          <WSButton
            onClick={() => {
              if (isSupportedBrowser) {
                evt.emit("profile:open");
              } else {
                alert(
                  "This feature is not supported in in-app browsers.\nPlease use browsers\n(Chrome , Safari, etc.)"
                );
              }
            }}
          >
            <FaUser />
          </WSButton>
        </div>
      )}
      <Chat />
      <Profile />
      <Leaderboard />
      <DisplayNameModal />
    </div>
  );
}

export default MainPage;

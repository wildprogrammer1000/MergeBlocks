import { useNavigate } from "react-router-dom";
import evt from "@/utils/event-handler";
import Leaderboard from "@/component/Leaderboard";
import { FaPlay, FaUser } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { useNakama } from "@/providers/NakamaProvider";
import DisplayNameModal from "@/component/DisplayNameModal";
import Profile from "@/component/Profile";

function MainPage() {
  const { account } = useNakama();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <h1 className="text-[80px] font-bold text-center leading-none">
        Merge Blocks!
      </h1>
      <div className="flex gap-4">
        {account && (
          <>
            <button
              className="w-16 h-16 text-3xl flex justify-center items-center text-center border-2 border-black rounded-2xl hover:bg-black hover:text-white transition-all duration-300 font-bold"
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
              className="w-16 h-16 text-3xl flex justify-center items-center text-center border-2 border-black rounded-2xl hover:bg-black hover:text-white transition-all duration-300 font-bold cursor-pointer"
            >
              <MdLeaderboard />
            </button>
          </>
        )}
      </div>
      {account && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => evt.emit("profile:open")}
            className="w-12 h-12 text-xl flex justify-center items-center text-center border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all duration-300"
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

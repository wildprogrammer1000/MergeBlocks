import { useNavigate } from "react-router-dom";
import evt from "@/utils/event-handler";
import Leaderboard from "@/component/Leaderboard";
import { FaPlay } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { useNakama } from "@/providers/NakamaProvider";
import DisplayNameModal from "@/component/DisplayNameModal";

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
      <Leaderboard />
      <DisplayNameModal />
    </div>
  );
}

export default MainPage;

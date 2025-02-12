import { Link } from "react-router-dom";
import evt from "@/utils/event-handler";
import Leaderboard from "@/component/Leaderboard";
import { FaPlay } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";

function MainPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <h1 className="text-[80px] font-bold text-center leading-none">
        Merge Blocks!
      </h1>
      <div className="flex gap-4">
        <Link
          className="w-16 h-16 text-3xl flex justify-center items-center text-center border-2 border-black rounded-2xl hover:bg-black hover:text-white transition-all duration-300 font-bold"
          to="/game"
        >
          <FaPlay />
        </Link>
        <button
          onClick={() => evt.emit("leaderboard:open")}
          className="w-16 h-16 text-3xl flex justify-center items-center text-center border-2 border-black rounded-2xl hover:bg-black hover:text-white transition-all duration-300 font-bold cursor-pointer"
        >
          <MdLeaderboard />
        </button>
      </div>
      <Leaderboard />
    </div>
  );
}

export default MainPage;

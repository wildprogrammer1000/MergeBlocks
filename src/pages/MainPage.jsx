import { Link } from "react-router-dom";

function MainPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-8">
      <h1 className="text-[80px] font-bold text-center leading-none">
        Merge Blocks!
      </h1>
      <Link
        className="border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition-all duration-300"
        to="/game"
      >
        Start Game
      </Link>
    </div>
  );
}

export default MainPage;

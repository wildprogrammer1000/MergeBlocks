// import { useNakama } from "@/providers/NakamaProvider";
import { useGlobalState } from "@/providers/StateProvider";
import Chat from "@/component/Chat";
// import GameItems from "@/component/GameItems";
const BottomInterface = () => {
  const { view } = useGlobalState();
  return <>{view === 1 && <GameViewBottomInterface />}</>;
};

export default BottomInterface;

const GameViewBottomInterface = () => {
  // const { wallet } = useNakama();

  return (
    <>
      {/* <GameItems /> */}
      <Chat />
    </>
  );
};

import NetworkController from "@/component/NetworkController";
import Interface from "@/component/Interface";
import Chat from "@/component/Chat";
import SettingsModal from "./component/modal/SettingsModal";
function App() {
  return (
    <div className="absolute top-0 left-0 flex flex-col w-full h-full overflow-hidden select-none">
      {/* <div className="absolute top-0 left-0 w-full h-10 bg-white z-40">
        <button
          onClick={() => {
            changeTheme("valentine");
            setTheme("valentine");
          }}
        >
          Valentine
        </button>
        <button
          onClick={() => {
            changeTheme("dark");
            setTheme("dark");
          }}
        >
          Dark
        </button>
      </div> */}
      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <div className="w-full h-full" id="app-canvas-container">
          <canvas id="app-canvas" />
        </div>
      </div>
      <Chat />

      {/* UI */}
      <Interface />

      {/* Modules */}
      <NetworkController />
      <SettingsModal />
    </div>
  );
}

export default App;

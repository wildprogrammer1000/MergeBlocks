import Interface from "./component/Interface";
import NetworkController from "./component/NetworkController";
import Chat from "./component/Chat";

function App() {
  return (
    <div className="absolute top-0 left-0 flex flex-col w-full h-full overflow-hidden">
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
    </div>
  );
}

export default App;

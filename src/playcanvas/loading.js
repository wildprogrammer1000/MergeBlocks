import evt from "@/utils/event-handler";

const showLoadingScreen = (app) => {
  var showSplashScreen = function () {
    evt.emit("splash:show");
  };
  var hideSplashScreen = function () {
    evt.emit("splash:hide");
  };
  var showProgress = function (progress) {
    evt.emit("splash:progress", progress);
  };
  app.on("preload:start", showSplashScreen);
  app.on("preload:progress", showProgress);
  app.on("start", hideSplashScreen);
};

export default showLoadingScreen;

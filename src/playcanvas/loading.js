import WILDSOFT_LOGO from "@/assets/wildsoft.png";

const showLoadingScreen = (app) => {
  const splashScreen = document.createElement("div");
  const logo = document.createElement("img");
  splashScreen.classList.add(
    "absolute",
    "top-0",
    "left-0",
    "flex",
    "flex-col",
    "gap-4",
    "items-center",
    "justify-center",
    "w-full",
    "h-full",
    "z-20",
    "bg-white"
  );

  const progressBar = document.createElement("div");
  progressBar.classList.add(
    "w-48",
    "h-1.5",
    "bg-gray-200",
    "border-gray-300",
    "rounded-md",
    "overflow-hidden"
  );
  const progressBarFill = document.createElement("div");
  progressBarFill.classList.add(
    "bg-red-700",
    "h-full",
    "transition-width",
    "duration-300"
  );
  progressBar.appendChild(progressBarFill);
  logo.src = WILDSOFT_LOGO;
  logo.width = 128;

  splashScreen.appendChild(logo);
  splashScreen.appendChild(progressBar);

  var showSplashScreen = function () {
    splashScreen.id = "splash-screen";
    document.body.append(splashScreen);
  };
  var hideSplashScreen = function () {
    setTimeout(() => {
      splashScreen.remove();
    }, 1000);
  };
  var showProgress = function (progress) {
    progressBarFill.style.width = `${progress * 100}%`;
  };
  app.on("preload:start", showSplashScreen);
  app.on("preload:progress", showProgress);
  app.on("start", hideSplashScreen);
};

export default showLoadingScreen;

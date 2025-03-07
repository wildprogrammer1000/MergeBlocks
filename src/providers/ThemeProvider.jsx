import { createContext, useContext, useEffect, useState } from "react";
import { THEME } from "@/constants/theme";
import { textureAssets } from "@/playcanvas/assets";
import PropTypes from "prop-types";
import evt from "@/utils/event-handler";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("candy");
  const [currentApp, setCurrentApp] = useState();
  // if (app) {
  //   const prevAsset = app.assets.find(asset.name);
  //   if (prevAsset) {
  //     app.assets.remove(prevAsset);
  //   }
  // }
  const updateStyle = (theme) => {
    const currentTheme = THEME[theme];
    const palette = currentTheme.palette;

    const root = document.documentElement;
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };
  const updateTexture = (theme) => {
    textureAssets.map((asset, i) => {
      asset.file.url = new URL(
        THEME[theme].textures[i],
        import.meta.url
      ).toString();
      return asset;
    });
  };
  const load = () => {
    updateStyle(theme);
  };
  const onBeforeAppLoad = (app) => {
    updateTexture(theme);
    setCurrentApp(app);
  };
  const onThemeManagerLoaded = () => {
    currentApp.fire("theme:apply", theme);
  };
  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    evt.on("asset:beforeload", onBeforeAppLoad);
    return () => {
      evt.off("asset:beforeload");
    };
  }, [theme]);

  useEffect(() => {
    if (currentApp) {
      currentApp.on("themeManager:loaded", onThemeManagerLoaded);
    }
    return () => {
      if (currentApp) {
        currentApp.off("themeManager:loaded", onThemeManagerLoaded);
      }
    };
  }, [currentApp]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

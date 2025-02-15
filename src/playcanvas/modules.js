import { basisInitialize, dracoInitialize, WasmModule } from "playcanvas";

export const loadModules = (modules, urlPrefix, doneCallback) => {
  if (typeof modules === "undefined" || modules.length === 0) {
    setTimeout(doneCallback);
    return;
  }

  let remaining = modules.length;
  const moduleLoaded = () => {
    if (--remaining === 0) {
      doneCallback();
    }
  };

  modules.forEach((m) => {
    WasmModule.setConfig(m.moduleName, {
      glueUrl: urlPrefix + m.glueUrl,
      wasmUrl: urlPrefix + m.wasmUrl,
      fallbackUrl: urlPrefix + m.fallbackUrl,
    });

    if (!Object.prototype.hasOwnProperty.call(m, "preload") || m.preload) {
      if (m.moduleName === "BASIS") {
        basisInitialize();
        moduleLoaded();
      } else if (m.moduleName === "DracoDecoderModule") {
        if (dracoInitialize) {
          dracoInitialize();
          moduleLoaded();
        } else {
          WasmModule.getInstance(m.moduleName, moduleLoaded);
        }
      } else {
        WasmModule.getInstance(m.moduleName, moduleLoaded);
      }
    } else {
      moduleLoaded();
    }
  });
};

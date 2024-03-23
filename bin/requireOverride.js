// This requireOverride all existing @evershop/evershop node module imports
const Module = require("module");
const originalRequire = Module.prototype.require;

Module.prototype.require = function () {
  //do your thing here
  if (arguments[0].includes("@evershop/evershop")) {
    // console.log("require", arguments[0])
    return originalRequire(
      arguments[0].replace(
        "@evershop/evershop",
        require("path").dirname(__dirname)
      )
    );
  }

  return originalRequire.apply(this, arguments);
};
require("./requireOverride");
const { error } = require("../src/lib/log/debuger");

try {
  process.env.NODE_ENV = "production";
  require("./start/index.js");
} catch (e) {
  error(e);
}

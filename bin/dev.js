require("./requireOverride");
const { error } = require("../src/lib/log/debuger");

try {
  process.env.NODE_ENV = "development";
  require("./dev/index.js");
} catch (e) {
  error(e);
}

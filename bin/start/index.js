// https://github.com/node-config/node-config/issues/578
process.env.ALLOW_CONFIG_MUTATIONS = true;
require('dotenv').config({ path: [`.env.${process.env.NODE_ENV}`, '.env'] });
const { start } = require('@evershop/evershop/bin/lib/startUp');

(async () => {
  await start();
})();

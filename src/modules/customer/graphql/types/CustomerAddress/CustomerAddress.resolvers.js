const { select } = require("@evershop/postgres-query-builder");
const { buildUrl } = require("@evershop/evershop/src/lib/router/buildUrl");
const { camelCase } = require("@evershop/evershop/src/lib/util/camelCase");
module.exports = {
  Query: {
    customerAddress: async (root, args, { customer, pool }) => {
      if (!customer) return null;
      const query = select().from("customer_address");
      query.where("customer_id", "=", customer.customer_id);
      const customerAddress = await query.load(pool);
      return customerAddress ? camelCase(customerAddress) : null;
    },
  },
};

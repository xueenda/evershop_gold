const { select } = require("@evershop/postgres-query-builder");
const { buildUrl } = require("@evershop/evershop/src/lib/router/buildUrl");
const { camelCase } = require("@evershop/evershop/src/lib/util/camelCase");
module.exports = {
  Query: {
    customerPaymentMethod: async (root, args, { customer, pool }) => {
      const query = select().from("customer_payment_method");
      query.where("customer_id", "=", customer.customer_id);
      const record = await query.load(pool);
      return record ? camelCase(record) : null;
    },
  },
};

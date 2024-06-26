const { select } = require('@evershop/postgres-query-builder');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const { camelCase } = require('@evershop/evershop/src/lib/util/camelCase');
module.exports = {
  Query: {
    customerShippingMethod: async (root, args, { customer, pool }) => {
      if (!customer) return null;
      const query = select().from('customer_shipping_method');
      query.where('customer_id', '=', customer.customer_id);
      const record = await query.load(pool);
      return record ? camelCase(record) : null;
    },
  }
};

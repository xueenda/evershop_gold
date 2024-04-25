const {
  insertOnUpdate,
  update,
  select,
} = require("@evershop/postgres-query-builder");
const { pool } = require("@evershop/evershop/src/lib/postgres/connection");
const { buildUrl } = require("@evershop/evershop/src/lib/router/buildUrl");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  INVALID_PAYLOAD,
} = require("@evershop/evershop/src/lib/util/httpStatus");
const { validateAddress } = require("../../services/addressValidator");

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  try {
    const data = {
      shipping_method: request.body.method_code,
      shipping_method_name: request.body.method_name,
      customer_id: request.locals.customer.customer_id,
    };

    const result = await insertOnUpdate("customer_shipping_method", [
      "customer_id",
    ])
      .given(data)
      .execute(pool);

    response.status(OK);
    const createdItem = await select()
      .from("customer_shipping_method")
      .where("customer_shipping_method_id", "=", result.insertId)
      .load(pool);

    response.status(OK);
    return response.json({
      data: createdItem,
    });
  } catch (e) {
    response.status(INTERNAL_SERVER_ERROR);
    response.json({
      error: {
        status: INTERNAL_SERVER_ERROR,
        message: e.message,
      },
    });
  }
};

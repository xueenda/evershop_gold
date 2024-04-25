const { insertOnUpdate, update, select } = require("@evershop/postgres-query-builder");
const { pool } = require("@evershop/evershop/src/lib/postgres/connection");
const { buildUrl } = require("@evershop/evershop/src/lib/router/buildUrl");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  INVALID_PAYLOAD,
} = require("@evershop/evershop/src/lib/util/httpStatus");
const {
  validateAddress,
} = require("../../../customer/services/addressValidator");

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  try {
    const { address, type } = request.body;
    address.customer_id = request.locals.customer.customer_id;
    address.is_default = 1;
    validateAddress(address);
    
    // Save customer address
    const result = await insertOnUpdate("customer_address", ["customer_id"])
      .given(address)
      .execute(pool);

    response.status(OK);
    const createdAddress = await select()
      .from("customer_address")
      .where("customer_address_id", "=", result.insertId)
      .load(pool);

    response.status(OK);
    return response.json({
      data: createdAddress,
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

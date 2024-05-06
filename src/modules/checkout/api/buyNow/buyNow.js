const { select, insert } = require("@evershop/postgres-query-builder");
const {
  INVALID_PAYLOAD,
  INTERNAL_SERVER_ERROR,
  OK,
} = require("@evershop/evershop/src/lib/util/httpStatus");
const { pool } = require("@evershop/evershop/src/lib/postgres/connection");
const { buildUrl } = require("@evershop/evershop/src/lib/router/buildUrl");
const {
  translate,
} = require("@evershop/evershop/src/lib/locale/translate/translate");
const { getCartByUUID } = require("../../services/getCartByUUID");
const { createNewCart } = require("../../services/createNewCart");
const { saveCart } = require("../../services/saveCart");
const { createOrder } = require("../../services/orderCreator");

module.exports = async (request, response, delegate, next) => {
  try {
    // Create a new cart
    const { sessionID, customer } = request.locals;
    const cart = await createNewCart(sessionID, customer || {});
    cartId = cart.getData("uuid");

    const { sku, qty } = request.body;

    // Load the product by sku
    const product = await select()
      .from("product")
      .where("sku", "=", sku)
      .and("status", "=", 1)
      .load(pool);

    if (!product) {
      response.status(INVALID_PAYLOAD);
      response.json({
        error: {
          status: INVALID_PAYLOAD,
          message: translate("Product not found"),
        },
      });
      return;
    }

    // If everything is fine, add the product to the cart
    const item = await cart.addItem(product.product_id, parseInt(qty, 10));
    // Set Cart Contact Info
    await cart.setData("customer_email", customer.email);

    const address = await select()
      .from("customer_address")
      .where("customer_id", "=", customer.customer_id)
      .load(pool);

    delete address.uuid;

    // Set Cart Address
    // Save billing address
    const result = await insert("cart_address").given(address).execute(pool);

    // Set address ID to cart
    // Find the shipping zone
    const shippingZoneQuery = select().from("shipping_zone");
    shippingZoneQuery
      .leftJoin("shipping_zone_province")
      .on(
        "shipping_zone_province.zone_id",
        "=",
        "shipping_zone.shipping_zone_id"
      );
    shippingZoneQuery.where("shipping_zone.country", "=", address.country);

    const shippingZoneProvinces = await shippingZoneQuery.execute(pool);
    const zone = shippingZoneProvinces.find(
      (p) => p.province === address.province || p.province === null
    );
    if (!zone) {
      await cart.setData("shipping_address_id", null);
      //   await saveCart(cart);
      response.status(INVALID_PAYLOAD);
      return response.json({
        error: {
          status: INVALID_PAYLOAD,
          message: "We do not ship to this address",
        },
      });
    }

    await cart.setData("shipping_zone_id", parseInt(zone.shipping_zone_id, 10));
    await cart.setData("shipping_address_id", parseInt(result.insertId, 10));
    await cart.setData("billing_address_id", parseInt(result.insertId, 10));

    // Save shipping method
    const shipping = await select()
      .from("customer_shipping_method")
      .where("customer_id", "=", customer.customer_id)
      .load(pool);
    await cart.setData("shipping_method", shipping.shipping_method);

    // Save payment method
    const payment = await select()
      .from("customer_payment_method")
      .where("customer_id", "=", customer.customer_id)
      .load(pool);
    await cart.setData("payment_method", payment.payment_method);
    await cart.setData("payment_method_name", payment.payment_method_name);

    // Save cart
    await saveCart(cart);
    const _cart = await getCartByUUID(cart.getData("uuid"));

    // Create a order based on cart
    const orderId = await createOrder(_cart);

    // Load created order
    const order = await select()
      .from("order")
      .where("uuid", "=", orderId)
      .load(pool);

    order.items = await select()
      .from("order_item")
      .where("order_item_order_id", "=", order.order_id)
      .execute(pool);

    order.shipping_address = await select()
      .from("order_address")
      .where("order_address_id", "=", order.shipping_address_id)
      .load(pool);

    order.billing_address = await select()
      .from("order_address")
      .where("order_address_id", "=", order.billing_address_id)
      .load(pool);

    response.status(OK);
    response.$body = {
      data: {
        ...order,
        links: [
          {
            rel: "edit",
            href: buildUrl("orderEdit", { id: order.uuid }),
            action: "GET",
            types: ["text/xml"],
          },
        ],
      },
    };
    next();
  } catch (error) {
    response.status(INTERNAL_SERVER_ERROR);
    response.json({
      error: {
        status: INTERNAL_SERVER_ERROR,
        message: error.message,
      },
    });
  }
};

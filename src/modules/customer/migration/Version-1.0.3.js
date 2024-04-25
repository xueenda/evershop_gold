const { execute } = require("@evershop/postgres-query-builder");

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
  await execute(
    connection,
    `ALTER TABLE customer_address ADD CONSTRAINT "CUSTOMER_ADDRESS_CUSTOMER_ID" UNIQUE ("customer_id");`
  );

  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS customer_shipping_method (
      "customer_shipping_method_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
      "uuid" UUID NOT NULL DEFAULT gen_random_uuid (),
      "customer_id" INT NOT NULL,
      "shipping_method" varchar DEFAULT NULL,
      "shipping_method_name" varchar DEFAULT NULL,
      "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "CUSTOMER_SHIPPING_METHOD_UUID_UNIQUE" UNIQUE ("uuid"),
      CONSTRAINT "CUSTOMER_SHIPPING_METHOD_CUSTOMER_ID" UNIQUE ("customer_id"),
      CONSTRAINT "FK_CUSTOMER_SHIPPING_METHOD" FOREIGN KEY ("customer_id") REFERENCES "customer" ("customer_id") ON DELETE CASCADE
    );`
  );

  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS customer_payment_method (
        "customer_payment_method_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
        "uuid" UUID NOT NULL DEFAULT gen_random_uuid (),
        "customer_id" INT NOT NULL,
        "payment_method" varchar DEFAULT NULL,
        "payment_method_name" varchar DEFAULT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "CUSTOMER_PAYMENT_METHOD_UUID_UNIQUE" UNIQUE ("uuid"),
        CONSTRAINT "CUSTOMER_PAYMENT_METHOD_CUSTOMER_ID" UNIQUE ("customer_id"),
        CONSTRAINT "FK_CUSTOMER_PAYMENT_METHOD" FOREIGN KEY ("customer_id") REFERENCES "customer" ("customer_id") ON DELETE CASCADE
    );`
  );
};

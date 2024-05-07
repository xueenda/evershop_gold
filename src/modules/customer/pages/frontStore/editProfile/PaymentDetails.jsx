import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "urql";
import Area from "@components/common/Area";
import { useCheckoutStepsDispatch } from "@components/common/context/checkoutSteps";
import CustomerAddressForm from "@components/frontStore/customer/address/addressForm/Index";
import { Form } from "@components/common/form/Form";
import { BillingAddress } from "@components/frontStore/checkout/checkout/payment/paymentStep/BillingAddress";
import { useCheckout } from "@components/common/context/checkout";
import { Field } from "@components/common/form/Field";
import CashOnDeliveryMethod from "@evershop/evershop/src/modules/cod/pages/frontStore/editProfile/CashOnDelivery";
import StripeMethod from "@evershop/evershop/src/modules/stripe/pages/frontStore/editProfile/Stripe";

import Button from "@components/common/form/Button";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import axios from "axios";

export default function PaymentDetails({
  getPaymentMethodAPI,
  setPaymentMethodAPI,
  setting,
  customerPaymentMethod,
}) {
  const [loading, setLoading] = React.useState(false);
  const [paymentMethods, setPaymentMethods] = useState();

  useEffect(() => {
    axios.get(getPaymentMethodAPI).then((response) => {
      if (!response.data.error) {
        setPaymentMethods(
          response.data.data.methods.map((m) => ({
            ...m,
            selected: customerPaymentMethod
              ? m.code === customerPaymentMethod.paymentMethod
              : false,
          }))
        );
      } else {
        setPaymentMethods([]);
      }
    });
  }, []);

  const getPaymentMethodComponent = (method) => {
    switch (method) {
      case "cod":
        return CashOnDeliveryMethod;
      case "stripe":
        return StripeMethod;
    }
  };

  return (
    <div>
      <Form
        method="POST"
        action={setPaymentMethodAPI}
        onValidationError={() => setLoading(false)}
        id="checkoutPaymentForm"
        submitBtn={false}
        // btnText={_("Save")}
        onSuccess={(response) => {
          setLoading(false)
        }}
        isJSON
      >
        <h4 className="mb-1 mt-3">{_("Payment Method")}</h4>
        {paymentMethods && paymentMethods.length > 0 && (
          <>
            <div className="divide-y border rounded border-divider px-2 mb-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.code}
                  className="border-divider payment-method-list"
                >
                  <div className="py-2">
                    <Area
                      id={`checkoutPaymentMethod${method.code}`}
                      coreComponents={[
                        {
                          component: {
                            default: getPaymentMethodComponent(method.code),
                          },
                          props: {
                            paymentMethods,
                            setPaymentMethods,
                            setting,
                          },
                          sortOrder: 10,
                        },
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Field
              type="hidden"
              name="method_code"
              value={paymentMethods.find((e) => e.selected === true)?.code}
              validationRules={[
                {
                  rule: "notEmpty",
                  message: _("Please select a payment method"),
                },
              ]}
            />
            <input
              type="hidden"
              value={paymentMethods.find((e) => e.selected === true)?.name}
              name="method_name"
            />
            <input type="hidden" value="billing" name="type" />
          </>
        )}
        {paymentMethods && paymentMethods.length === 0 && (
          <div className="alert alert-warning">
            {_("No payment method available")}
          </div>
        )}
        <div className="form-submit-button">
          <Button
            isLoading={loading}
            onAction={() => {
              setLoading(true);
              document
                .getElementById("checkoutPaymentForm")
                .dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
            }}
            title={_("Save")}
          />
        </div>
      </Form>
    </div>
  );
}

PaymentDetails.propTypes = {
  getPaymentMethodAPI: PropTypes.string.isRequired,
  setPaymentMethodAPI: PropTypes.string.isRequired,
  setting: PropTypes.shape({
    stripePublishableKey: PropTypes.string.isRequired,
  }),
  customerPaymentMethod: PropTypes.shape({
    paymentMethod: PropTypes.string,
    paymentMethodName: PropTypes.string,
  }),
};

export const layout = {
  areaId: "accountPageContent",
  sortOrder: 40,
};

export const query = `
  query Query {
    getPaymentMethodAPI: url(routeId: "getPaymentMethods")
    setPaymentMethodAPI: url(routeId: "setCustomerPaymentMethod")
    setting {
      stripeDislayName
      stripePublishableKey
    }
    customerPaymentMethod {
      paymentMethod
      paymentMethodName
    }
  }
`;

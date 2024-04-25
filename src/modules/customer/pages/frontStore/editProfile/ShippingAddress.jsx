import PropTypes from "prop-types";
import React from "react";
import EmailIcon from "@heroicons/react/outline/MailIcon";
import User from "@heroicons/react/outline/UserIcon";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import { Form } from '@components/common/form/Form';
import produce from 'immer';
import CustomerAddressForm from "@components/frontStore/customer/address/addressForm/Index";

export default function ShippingAddress({
  action,
  customerAddress,
  setting: { customerAddressSchema },
}) {
  return (
    <>
      <div className="border-b mt-3 mb-1 flex justify-between items-center  border-textSubdued">
        <h2>{_("Shipping Address")}</h2>
      </div>
      <div className="account-details">
        <div className="account-details-inner">
          <div className="grid grid-cols-1 gap-1">
            <Form
              method="POST"
              action={action}
              id="checkoutShippingAddressForm"
              isJSON
              btnText={_("Save")}
              onSuccess={(response) => {
                // if (!response.error) {
                //   client
                //     .query(QUERY, { cartId })
                //     .toPromise()
                //     .then((result) => {
                //       const address = result.data.cart.shippingAddress;
                //       setShipmentInfo(
                //         produce(shipmentInfo, (draff) => {
                //           draff.address = address;
                //         })
                //       );
                //     });
                // } else {
                //   toast.error(response.error.message);
                // }
              }}
            >
              <CustomerAddressForm
                areaId="checkoutShippingAddressForm"
                address={customerAddress}
                customerAddressSchema={customerAddressSchema}
              />
              <input type="hidden" name="type" value="shipping" />
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

ShippingAddress.propTypes = {
  action: PropTypes.string.isRequired,
  customerAddress: PropTypes.shape({
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
    }),
    fullName: PropTypes.string,
    id: PropTypes.string,
    postcode: PropTypes.string,
    province: PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
    }),
    telephone: PropTypes.string,
  }),
  setting: PropTypes.shape({
    customerAddressSchema: PropTypes.string,
  }).isRequired,
};

export const layout = {
  areaId: "accountPageContent",
  sortOrder: 20,
};

export const query = `
  query Query {
    action: url(routeId: "setCustomerAddress")
    customerAddress {
      id: customerAddressId
      fullName
      postcode
      telephone
      country {
        code
        name
      }
      province {
        code
        name
      }
      city
      address1
      address2
    }
    setting {
      customerAddressSchema
    }
  }
`;

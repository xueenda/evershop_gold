import PropTypes from "prop-types";
import React from "react";
import EmailIcon from "@heroicons/react/outline/MailIcon";
import User from "@heroicons/react/outline/UserIcon";
import { _ } from '@evershop/evershop/src/lib/locale/translate';

import { Field } from '@components/common/form/Field';
import { Form } from '@components/common/form/Form';
import Area from '@components/common/Area';

export default function AccountDetails({ account, action }) {
  return (
    <>
      <div className="border-b mb-2 flex justify-between items-center  border-textSubdued">
        <h2>{_("Account Details")}</h2>
      </div>
      <div className="account-details">
        <div className="account-details-inner">
          <div className="grid grid-cols-1 gap-1">
          <Form
            id="registerForm"
            action={action}
            isJSON
            method="PATCH"
            onSuccess={async (response) => {
              // if (!response.error) {
              //   // Log the customer in
              //   const loginResponse = await fetch(loginApi, {
              //     method: 'POST',
              //     headers: {
              //       'Content-Type': 'application/json'
              //     },
              //     body: JSON.stringify({
              //       email,
              //       password
              //     })
              //   });

              //   const loginResponseJson = await loginResponse.json();
              //   if (loginResponseJson.error) {
              //     setError(loginResponseJson.error.message);
              //   } else {
              //     window.location.href = homeUrl;
              //   }
              // } else {
              //   setError(response.error.message);
              // }
            }}
            btnText={_('Save')}
          >
            <Area
              id="customerRegisterForm"
              coreComponents={[
                {
                  component: {
                    default: (
                      <Field
                        name="full_name"
                        type="text"
                        value={account.fullName}
                        placeholder={_('Full Name')}
                        validationRules={['notEmpty']}
                      />
                    )
                  },
                  sortOrder: 10
                },
                {
                  component: {
                    default: (
                      <Field
                        name="email"
                        type="text"
                        value={account.email}
                        placeholder={_('Email')}
                        validationRules={['notEmpty', 'email']}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    )
                  },
                  sortOrder: 20
                }
              ]}
            />
          </Form>
          </div>
        </div>
      </div>
    </>
  );
}

AccountDetails.propTypes = {
  account: PropTypes.shape({
    email: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  }).isRequired,
  action: PropTypes.string.isRequired,
};

export const layout = {
  areaId: "accountPageContent",
  sortOrder: 10,
};

export const query = `
  query Query {
    action: url(routeId: "updateCustomer", params: [{key: "id", value: getContextValue("customerUuid")}])
    account: currentCustomer {
      uuid
      fullName
      email
    }
  }
`;

import React from "react";
import CODLogo from "@components/frontStore/cod/CODLogo";

export default function CashOnDeliveryMethod({
  paymentMethods,
  setPaymentMethods,
}) {
  const selectedPaymentMethod = paymentMethods
    ? paymentMethods.find((paymentMethod) => paymentMethod.selected)
    : undefined;

  return (
    <div>
      <div className="flex justify-start items-center gap-1">
        {(!selectedPaymentMethod || selectedPaymentMethod.code !== "cod") && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPaymentMethods((previous) =>
                previous.map((paymentMethod) => {
                  if (paymentMethod.code === "cod") {
                    return {
                      ...paymentMethod,
                      selected: true,
                    };
                  } else {
                    return {
                      ...paymentMethod,
                      selected: false,
                    };
                  }
                })
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </a>
        )}
        {selectedPaymentMethod && selectedPaymentMethod.code === "cod" && (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2c6ecb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        )}
        <div>
          <CODLogo width={100} />
        </div>
      </div>
    </div>
  );
}

// export const layout = {
//   areaId: 'checkoutPaymentMethodcod',
//   sortOrder: 10
// };

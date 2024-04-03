import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useSocketIO } from "@components/common/context/socketIO";

function Price({ regular, special }) {
  const { subscribe, unsubscribe } = useSocketIO();
  const [price, setPrice] = React.useState(regular.value);

  useEffect(() => {
    const channelName = "goldBar";
    subscribe(channelName, (price) => {
      setPrice(price);
    });

    return () => {
      unsubscribe(channelName);
    };
  }, [subscribe, unsubscribe]);

  return (
    <div className="product-price-listing">
      <div>
        <span className="sale-price font-semibold">${price}</span>
      </div>

      {/* {regular.value === special.value && (
        <div>
          <span className="sale-price font-semibold">${price}</span>
        </div>
      )}
      {special.value < regular.value && (
        <div>
          <span className="sale-price text-critical font-semibold">
            {special.text}
          </span>{' '}
          <span className="regular-price font-semibold">{regular.text}</span>
        </div>
      )} */}
    </div>
  );
}

Price.propTypes = {
  regular: PropTypes.shape({
    value: PropTypes.number,
    text: PropTypes.string,
  }).isRequired,
  special: PropTypes.shape({
    value: PropTypes.number,
    text: PropTypes.string,
  }).isRequired,
};

export { Price };

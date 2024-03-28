import PropTypes from "prop-types";
import React, { useEffect, useContext, useState } from "react";
import { SocketIOContext } from "@components/common/react/client/Socket.io";

// console.log(useSocketIO)

function Price({ regular, special }) {
  const { socket } = useContext(SocketIOContext);
  const [price, setPrice] = useState(regular.value);

  console.log(socket);

  useEffect(() => {
    if (socket) {
      socket.on("price", ({ goldBar }) => {
        console.log("gold bar price " + goldBar);
        setPrice(goldBar);
      });
    }
  }, [socket]);

  return (
    <div className="product-price-listing">
      {regular.value === special.value && (
        <div>
          <span className="sale-price font-semibold">${price}</span>
        </div>
      )}
      {special.value < regular.value && (
        <div>
          <span className="sale-price text-critical font-semibold">
            {special.text}
          </span>{" "}
          <span className="regular-price font-semibold">{regular.text}</span>
        </div>
      )}
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

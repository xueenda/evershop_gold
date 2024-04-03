import PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";
import socketIOClient from "socket.io-client";

const SocketIOContext = React.createContext();

export function SocketIOProvider({ children }) {
  const socket = React.useRef(null);
  const prices = React.useRef({});

  const subscribe = (channel, callback) => {
    prices.current[channel] = callback;
  };

  const unsubscribe = (channel) => {
    delete prices.current[channel];
  };

  useEffect(() => {
    socket.current = socketIOClient("/", { path: "/websocket" });

    socket.current.on("error", (error) => {
      console.error("Socket.IO Error:", error);
    });

    socket.current.on("connect", () => {
      console.log("Socket.IO connect");
    });

    socket.current.on("disconnect", (error) => {
      console.log("Socket.IO disconnect");
    });

    socket.current.on("price", (data) => {
      // console.log("Socket.IO", data);

      for (const [channel, value] of Object.entries(data)) {
        if (prices.current[channel]) {
          prices.current[channel](value);
        }
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      subscribe,
      unsubscribe,
    }),
    []
  );

  return (
    <SocketIOContext.Provider value={contextValue}>
      {children}
    </SocketIOContext.Provider>
  );
}

SocketIOProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export const useSocketIO = () => React.useContext(SocketIOContext);

import React, { createContext, useContext, useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const SocketIOContext = createContext();

export const useSocketIO = () => {
  return useContext(SocketIOContext);
};

export const SocketIOProvider = ({ url, path, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = socketIOClient(url, { path });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  const value = {
    socket,
  };

  return (
    <SocketIOContext.Provider value={value}>
      {children}
    </SocketIOContext.Provider>
  );
};

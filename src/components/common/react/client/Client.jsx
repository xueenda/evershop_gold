import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { createClient, Provider } from "urql";
import { AppProvider } from "@components/common/context/app";
import Area from "@components/common/Area";
import Head from "@components/common/react/Head";
import { Alert } from "@components/common/modal/Alert";
import { SocketIOProvider } from "@components/common/context/socketIO";

const client = createClient({
  url: "/api/graphql",
});

export function App({ children }) {
  return (
    <AppProvider value={window.eContext}>
      <Provider value={client}>
        <Alert>
          <Head />
          <SocketIOProvider>
            <Area id="body" className="wrapper" />
          </SocketIOProvider>
        </Alert>
      </Provider>

      {children}
    </AppProvider>
  );
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

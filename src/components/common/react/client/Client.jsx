import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { createClient, Provider } from 'urql';
import { AppProvider } from '@components/common/context/app';
import Area from '@components/common/Area';
import Head from '@components/common/react/Head';
import { Alert } from '@components/common/modal/Alert';
// import {io} from 'socket.io-client';

// const client = createClient({
//   url: '/api/graphql'
// });

export function App({ children }) {
  // useEffect(()=>{
  //   const socket = io({path: '/websocket'});
  //   socket.on('price', ({goldBar})=>{
  //     console.log('gold bar price ' + goldBar)
  //   })
  // })
  return (
    <AppProvider value={window.eContext}>
      <Provider value={client}>
        <Alert>
          <Head />
          <Area id="body" className="wrapper" />
        </Alert>
      </Provider>
      {children}
    </AppProvider>
  );
}

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

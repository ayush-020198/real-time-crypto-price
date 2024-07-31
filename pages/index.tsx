// pages/index.tsx
import React from 'react';
import { Provider } from 'react-redux';
import PriceTable from '../components/PriceTable';
import {store} from '../redux/store'; 
import { AppProps } from 'next/app';



const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Provider store={store}>
    <PriceTable {...pageProps} />
  </Provider>
};

export default MyApp;

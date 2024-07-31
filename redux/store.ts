// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import pricesReducer from './slices/pricesSlice';

export const store = configureStore({
  reducer: {
    prices: pricesReducer
  }
});

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

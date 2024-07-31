// redux/slices/pricesSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchPricesFromAPI = createAsyncThunk(
  'prices/fetchPricesFromAPI',
  async () => {
    const response = await fetch('/api/prices');
    if (!response.ok) {
      throw new Error('Failed to fetch data from API');
    }
    const data = await response.json();
    localStorage.setItem('prices', JSON.stringify(data));
    return data;
;
  }
);



const pricesSlice = createSlice({
  name: 'prices',
  initialState: {
    data: [],
    status: 'idle',  // It's good to initialize the status
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPricesFromAPI.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPricesFromAPI.fulfilled, (state, action) => {
        // Assuming the data is an array of coins
        state.data = action.payload; // Adjust this based on the actual data structure
        state.status = 'succeeded';
      })
      .addCase(fetchPricesFromAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default pricesSlice.reducer;

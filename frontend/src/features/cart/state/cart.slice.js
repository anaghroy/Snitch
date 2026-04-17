import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: null,
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setCart, setCartLoading } = cartSlice.actions;
export default cartSlice.reducer;

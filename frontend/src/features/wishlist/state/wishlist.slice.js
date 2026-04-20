import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: null,
  loading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setWishlist, setWishlistLoading } = wishlistSlice.actions;

export default wishlistSlice.reducer;

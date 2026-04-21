import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const wishlistApiInstance = axios.create({
  baseURL: `${BASE_URL}/wishlist`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getWishlist() {
  const response = await wishlistApiInstance.get("/");
  return response.data;
}

export async function toggleWishlistItem(productId) {
  const response = await wishlistApiInstance.post("/toggle", { productId });
  return response.data;
}

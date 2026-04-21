import axios from "axios";

const wishlistApiInstance = axios.create({
  baseURL: "/api/wishlist",
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

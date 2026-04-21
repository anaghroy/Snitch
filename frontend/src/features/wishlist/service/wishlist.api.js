import axios from "axios";

const wishlistApiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/products", "/wishlist")
    : "http://localhost:3000/api/wishlist",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getWishlist() {
  const response = await wishlistApiInstance.get("/api/wishlist/");
  return response.data;
}

export async function toggleWishlistItem(productId) {
  const response = await wishlistApiInstance.post("/api/wishlist/toggle", { productId });
  return response.data;
}

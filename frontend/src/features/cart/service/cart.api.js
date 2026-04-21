import axios from "axios";

const cartApiInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


export async function getCart() {
  const response = await cartApiInstance.get("/");
  return response.data;
}

export async function addToCart(productId, quantity, variantId, attributes) {
  const response = await cartApiInstance.post("/add", { productId, quantity, variantId, attributes });
  return response.data;
}

export async function removeFromCart(itemId) {
  const response = await cartApiInstance.delete(`/remove/${itemId}`);
  return response.data;
}

export async function clearCart() {
  const response = await cartApiInstance.delete("/clear");
  return response.data;
}

export async function updateCartItemQuantity(itemId, quantity) {
  const response = await cartApiInstance.put(`/update/${itemId}`, { quantity });
  return response.data;
}

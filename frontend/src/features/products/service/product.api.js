import axios from "axios"

const productApiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

export async function createProduct(formData) {
    const response = await productApiInstance.post("/api/products/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

export async function getSellerProducts() {
    const response = await productApiInstance.get("/api/products/seller")
    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/api/products")
    return response.data
}

export async function getProductById(id) {
    const response = await productApiInstance.get(`/api/products/${id}`)
    return response.data
}

export async function addProductVariant(productId, formData) {
    const response = await productApiInstance.post(`/api/products/${productId}/variants`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

export async function getSimilarProducts(id) {
    const response = await productApiInstance.get(`/api/products/${id}/similar`)
    return response.data
}

export async function searchProducts(query) {
    const response = await productApiInstance.get(`/api/products/search?q=${encodeURIComponent(query)}`)
    return response.data
}

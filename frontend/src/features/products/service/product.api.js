import axios from "axios"

const productApiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/products",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

export async function createProduct(formData) {
    const response = await productApiInstance.post("/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

export async function getSellerProducts() {
    const response = await productApiInstance.get("/seller")
    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/")
    return response.data
}

export async function getProductById(id) {
    const response = await productApiInstance.get(`/${id}`)
    return response.data
}

export async function addProductVariant(productId, formData) {
    const response = await productApiInstance.post(`/${productId}/variants`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

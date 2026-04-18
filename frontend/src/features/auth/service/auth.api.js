import axios from "axios";

const authApiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/auth",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})


export async function register({ email, contact, password, fullname, isSeller }) {

    const response = await authApiInstance.post("/register", {
        email,
        contact,
        password,
        fullname,
        isSeller
    })
    return response.data
}

export async function login({ email, password }) {
    const response = await authApiInstance.post("/login", {
        email, password
    })

    return response.data
}

export async function getMe() {
    const response = await authApiInstance.get("/get-me")
    return response.data
}

export async function logout() {
    const response = await authApiInstance.get("/logout")
    return response.data
}
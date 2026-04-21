import axios from "axios";

const authApiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})


export async function register({ email, contact, password, fullname, isSeller }) {

    const response = await authApiInstance.post("/api/auth/register", {
        email,
        contact,
        password,
        fullname,
        isSeller
    })
    return response.data
}

export async function login({ email, password }) {
    const response = await authApiInstance.post("/api/auth/login", {
        email, password
    })

    return response.data
}

export async function getMe() {
    const response = await authApiInstance.get("/api/auth/get-me")
    return response.data.user
}

export async function updateProfile(data) {
    const response = await authApiInstance.put("/api/auth/update", data);
    return response.data;
}

export async function logout() {
    const response = await authApiInstance.get("/api/auth/logout")
    return response.data
}
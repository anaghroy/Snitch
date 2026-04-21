import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


export async function register({ email, contact, password, fullname, isSeller }) {

    const response = await authApiInstance.post("/auth/register", {
        email,
        contact,
        password,
        fullname,
        isSeller
    })
    return response.data
}

export async function login({ email, password }) {
    const response = await authApiInstance.post("/auth/login", {
        email, password
    })

    return response.data
}

export async function getMe() {
    const response = await authApiInstance.get("/auth/get-me")
    return response.data.user
}

export async function updateProfile(data) {
    const response = await authApiInstance.put("/auth/update", data);
    return response.data;
}

export async function logout() {
    const response = await authApiInstance.get("/auth/logout")
    return response.data
}
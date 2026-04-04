import axios from "axios"
import { AUTH_API } from "./auth"

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true

            try {
                const refresh = localStorage.getItem("refresh")
                const response = await axios.post(AUTH_API.refresh, { refresh })
                
                localStorage.setItem("access", response.data.access)
                original.headers.Authorization = `Bearer ${response.data.access}`
                
                return api(original)
            } catch {
                localStorage.removeItem("access")
                localStorage.removeItem("refresh")
                window.location.href = "/login"
            }
        }

        return Promise.reject(error)
    }
)

export default api

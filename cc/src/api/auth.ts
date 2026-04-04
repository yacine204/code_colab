const base_api: string = import.meta.env.VITE_BASE_API

export const AUTH_API = {
    login: base_api+"auth/jwt/create/",
    signup: base_api+"auth/users/",
    refresh: base_api+"auth/jwt/refresh/"
}


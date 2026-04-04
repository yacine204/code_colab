export interface User {
    id: number
    pseudo: string
    email: string
    description?: string
    avatar_url: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials {
    email: string
    pseudo: string
    password: string
}
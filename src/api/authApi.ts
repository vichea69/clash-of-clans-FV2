import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Types
export interface User {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SignUpInput {
    name: string;
    email: string;
    password: string;
}

export interface SignInInput {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: {
        id: number;
        name: string;
        email: string;
        createdAt?: string;
        updatedAt?: string;
    };
}

// Create axios instance with interceptors
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
    const tokenData = localStorage.getItem('token');
    if (tokenData) {
        try {
            const { value, expiry } = JSON.parse(tokenData);
            if (new Date().getTime() <= expiry) {
                config.headers.Authorization = `Bearer ${value}`;
            } else {
                // Token expired
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Only clear storage if token is invalid/expired
            if (error.response?.data?.message === 'Token expired' ||
                error.response?.data?.message === 'Invalid token') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API functions
export const authApi = {
    // Sign up
    async signUp(data: SignUpInput) {
        const response = await api.post<AuthResponse>("/auth/sign-up", data);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    },

    // Sign in
    async signIn(data: SignInInput) {
        try {
            const response = await api.post<AuthResponse>("/auth/sign-in", data);

            if (response.data.token) {
                // Store token with expiry
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

                const tokenData = {
                    value: response.data.token,
                    expiry: expiryDate.getTime()
                };

                localStorage.setItem("token", JSON.stringify(tokenData));

                if (response.data.user) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }
            }
            return response.data;
        } catch (error) {
            console.error("Sign in API error:", error);
            throw error;
        }
    },

    // Sign out
    async signOut() {
        try {
            const response = await api.post<AuthResponse>("/auth/sign-out");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return response.data;
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            throw error;
        }
    },

    // Get current user


    // Check if user is authenticated
    isAuthenticated() {
        const tokenData = localStorage.getItem('token');
        if (!tokenData) return false;

        try {
            const { expiry } = JSON.parse(tokenData);
            if (new Date().getTime() > expiry) {
                // Token expired
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return false;
            }
            return true;
        } catch {
            return false;
        }
    },

    // Get auth token
    getToken() {
        const tokenData = localStorage.getItem('token');
        if (!tokenData) return null;

        try {
            const { value, expiry } = JSON.parse(tokenData);
            if (new Date().getTime() > expiry) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return null;
            }
            return value;
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }
    },
};

export default authApi;

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Define types
export interface Base {
  id: number;
  name: string;
  link: string;
  imageUrl?: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface CreateBaseInput {
  name: string;
  link: string;
  image?: File;
}

export interface UpdateBaseInput {
  name?: string;
  link?: string;
  image?: File;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const baseApi = {
  // Create a new base
  async createBase(data: CreateBaseInput) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('link', data.link);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.post<{ success: boolean; data: Base }>('/bases', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all bases
  async getBases() {
    const response = await api.get<{ success: boolean; data: Base[]; message: string }>('/bases');
    return response.data;
  },

  // Get a single base by ID
  async getBaseById(id: number) {
    const response = await api.get<{ success: boolean; data: Base }>(`/bases/${id}`);
    return response.data;
  },

  // Update a base
  async updateBase(id: number, data: UpdateBaseInput) {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.link) formData.append('link', data.link);
    if (data.image) formData.append('image', data.image);

    const response = await api.put<{ success: boolean; data: Base }>(`/bases/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete a base
  async deleteBase(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(`/bases/${id}`);
    return response.data;
  },
};

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
        window.location.href = '/login';
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default baseApi;

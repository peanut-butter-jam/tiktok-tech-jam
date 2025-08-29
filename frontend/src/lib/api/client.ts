import axios, { type AxiosInstance, AxiosError } from "axios";
import { baseUrl } from "../constants";

export interface ApiResponse<T = any> {
    data: T;
    status: number;
    message?: string;
}

export interface ApiError {
    message: string;
    status: number;
    details?: any;
}

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: baseUrl,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                const apiError: ApiError = {
                    message: error.message || "An unexpected error occurred",
                    status: error.response?.status || 500,
                    details: error.response?.data,
                };

                // Handle common HTTP errors
                if (error.response?.status === 404) {
                    apiError.message = "Resource not found";
                } else if (
                    typeof error.response?.status === "number" &&
                    error.response.status >= 500
                ) {
                    apiError.message = "Server error occurred";
                }

                return Promise.reject(apiError);
            }
        );
    }

    get<T = any>(url: string, params?: any): Promise<T> {
        return this.client
            .get<T>(url, { params })
            .then((response) => response.data);
    }

    post<T = any>(url: string, data?: any): Promise<T> {
        return this.client.post<T>(url, data).then((response) => response.data);
    }

    put<T = any>(url: string, data?: any): Promise<T> {
        return this.client.put<T>(url, data).then((response) => response.data);
    }

    patch<T = any>(url: string, data?: any): Promise<T> {
        return this.client
            .patch<T>(url, data)
            .then((response) => response.data);
    }

    delete<T = any>(url: string): Promise<T> {
        return this.client.delete<T>(url).then((response) => response.data);
    }

    // Special method for file uploads
    uploadFile<T = any>(url: string, formData: FormData): Promise<T> {
        return this.client
            .post<T>(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => response.data);
    }
}

export const apiClient = new ApiClient();
export default apiClient;

import { apiRequest } from "./apiClient";

export const testimonialsApi = {
    list: () => apiRequest("/api/testimonials"),

    get: (id: string) => apiRequest(`/api/testimonials/${id}`),

    create: (data: { text: string; author: string; rating?: number }) =>
        apiRequest("/api/testimonials", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<{ text: string; author: string; rating: number }>) =>
        apiRequest(`/api/testimonials/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    remove: (id: string) =>
        apiRequest(`/api/testimonials/${id}`, {
            method: "DELETE",
        }),
};

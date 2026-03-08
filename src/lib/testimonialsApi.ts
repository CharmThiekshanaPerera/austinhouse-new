import type { Testimonial } from "@/contexts/DataContext";
import { apiRequest } from "./apiClient";

type TestimonialCreate = Omit<Testimonial, "id">;
type TestimonialUpdate = Partial<Omit<Testimonial, "id">>;

export const testimonialsApi = {
    list: () => apiRequest<Testimonial[]>("/api/testimonials"),

    get: (id: string) => apiRequest<Testimonial>(`/api/testimonials/${id}`),

    create: (data: TestimonialCreate) =>
        apiRequest<Testimonial>("/api/testimonials", { method: "POST", body: data }),

    update: (id: string, data: TestimonialUpdate) =>
        apiRequest<Testimonial>(`/api/testimonials/${id}`, { method: "PATCH", body: data }),

    remove: (id: string) =>
        apiRequest<void>(`/api/testimonials/${id}`, { method: "DELETE" }),
};

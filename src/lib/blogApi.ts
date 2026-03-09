import type { BlogPost } from "@/contexts/DataContext";
import { apiRequest } from "@/lib/apiClient";

type BlogPostCreate = Omit<BlogPost, "id">;
type BlogPostUpdate = Partial<Omit<BlogPost, "id">>;

export const blogApi = {
    list: () => apiRequest<BlogPost[]>("/api/blog"),
    get: (id: string) => apiRequest<BlogPost>(`/api/blog/${id}`),
    create: (payload: BlogPostCreate) =>
        apiRequest<BlogPost>("/api/blog", { method: "POST", body: payload }),
    update: (id: string, payload: BlogPostUpdate) =>
        apiRequest<BlogPost>(`/api/blog/${id}`, { method: "PATCH", body: payload }),
    remove: (id: string) =>
        apiRequest<void>(`/api/blog/${id}`, { method: "DELETE" }),
};

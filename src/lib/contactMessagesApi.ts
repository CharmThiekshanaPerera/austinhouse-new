import { apiRequest } from "./apiClient";
import type { ContactMessage } from "@/contexts/DataContext";

type MessageCreate = Omit<ContactMessage, "id" | "createdAt" | "read" | "replied">;
type MessageUpdate = Partial<Omit<ContactMessage, "id" | "createdAt">>;

export const contactMessagesApi = {
    list: () => apiRequest<ContactMessage[]>("/api/messages"),
    get: (id: string) => apiRequest<ContactMessage>(`/api/messages/${id}`),
    create: (data: MessageCreate) => apiRequest<ContactMessage>("/api/messages", { method: "POST", body: data }),
    update: (id: string, data: MessageUpdate) => apiRequest<ContactMessage>(`/api/messages/${id}`, { method: "PATCH", body: data }),
    remove: (id: string) => apiRequest<void>(`/api/messages/${id}`, { method: "DELETE" }),
};

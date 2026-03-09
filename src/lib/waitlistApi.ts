import type { WaitlistEntry } from "@/contexts/DataContext";
import { apiRequest } from "@/lib/apiClient";

type WaitlistCreate = Omit<WaitlistEntry, "id">;

export const waitlistApi = {
    list: () => apiRequest<WaitlistEntry[]>("/api/waitlist"),
    get: (id: string) => apiRequest<WaitlistEntry>(`/api/waitlist/${id}`),
    create: (payload: WaitlistCreate) =>
        apiRequest<WaitlistEntry>("/api/waitlist", { method: "POST", body: payload }),
    remove: (id: string) =>
        apiRequest<void>(`/api/waitlist/${id}`, { method: "DELETE" }),
};

import type { Staff } from "@/contexts/DataContext";
import { apiRequest } from "@/lib/apiClient";

type StaffCreate = Omit<Staff, "id">;
type StaffUpdate = Partial<Omit<Staff, "id">>;

export const staffApi = {
    list: () => apiRequest<Staff[]>("/api/staff"),
    get: (id: string) => apiRequest<Staff>(`/api/staff/${id}`),
    create: (payload: StaffCreate) =>
        apiRequest<Staff>("/api/staff", { method: "POST", body: payload }),
    update: (id: string, payload: StaffUpdate) =>
        apiRequest<Staff>(`/api/staff/${id}`, { method: "PATCH", body: payload }),
    remove: (id: string) =>
        apiRequest<void>(`/api/staff/${id}`, { method: "DELETE" }),
};

import type { Customer } from "@/contexts/DataContext";
import { apiRequest } from "@/lib/apiClient";

type CustomerCreate = Omit<Customer, "id">;
type CustomerUpdate = Partial<Omit<Customer, "id">>;

export const customersApi = {
    list: () => apiRequest<Customer[]>("/api/customers"),
    get: (id: string) => apiRequest<Customer>(`/api/customers/${id}`),
    create: (payload: CustomerCreate) =>
        apiRequest<Customer>("/api/customers", { method: "POST", body: payload }),
    update: (id: string, payload: CustomerUpdate) =>
        apiRequest<Customer>(`/api/customers/${id}`, { method: "PATCH", body: payload }),
    remove: (id: string) =>
        apiRequest<void>(`/api/customers/${id}`, { method: "DELETE" }),
};

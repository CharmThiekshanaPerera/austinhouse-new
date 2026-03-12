import { apiRequest } from "@/lib/apiClient";
import type { Order } from "@/contexts/DataContext";

type OrderCreate = Omit<Order, "id" | "createdAt" | "status">;
type OrderUpdate = Partial<Omit<Order, "id">>;

export const ordersApi = {
  list: () => apiRequest<Order[]>("/api/orders"),
  get: (id: string) => apiRequest<Order>(`/api/orders/${id}`),
  create: (payload: OrderCreate) =>
    apiRequest<Order>("/api/orders", { method: "POST", body: payload }),
  update: (id: string, payload: OrderUpdate) =>
    apiRequest<Order>(`/api/orders/${id}`, { method: "PATCH", body: payload }),
  remove: (id: string) =>
    apiRequest<void>(`/api/orders/${id}`, { method: "DELETE" }),
};

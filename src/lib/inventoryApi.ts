import { apiRequest } from "@/lib/apiClient";

export type InventoryStatus = "Out of Stock" | "Low Stock" | "In Stock";

export interface InventoryRecord {
  id: string;
  product_id: string;
  sku: string;
  stock_qty: number;
  reorder_level: number;
  supplier: string;
  status: InventoryStatus;
}

export type InventoryCreate = Omit<InventoryRecord, "id" | "status">;
export type InventoryUpdate = Partial<Omit<InventoryRecord, "id" | "status">>;

export const inventoryApi = {
  list: () => apiRequest<InventoryRecord[]>("/api/inventory"),
  get: (id: string) => apiRequest<InventoryRecord>(`/api/inventory/${id}`),
  create: (payload: InventoryCreate) => apiRequest<InventoryRecord>("/api/inventory", { method: "POST", body: payload }),
  replace: (id: string, payload: InventoryCreate) => apiRequest<InventoryRecord>(`/api/inventory/${id}`, { method: "PUT", body: payload }),
  update: (id: string, payload: InventoryUpdate) => apiRequest<InventoryRecord>(`/api/inventory/${id}`, { method: "PATCH", body: payload }),
  remove: (id: string) => apiRequest<void>(`/api/inventory/${id}`, { method: "DELETE" }),
};


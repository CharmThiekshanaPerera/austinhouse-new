import type { Product } from "@/contexts/DataContext";
import { apiRequest } from "@/lib/apiClient";

type ProductCreate = Omit<Product, "id"> & { id?: string };
type ProductUpdate = Partial<Omit<Product, "id">>;

export const productsApi = {
  list: () => apiRequest<Product[]>("/api/products"),
  create: (payload: ProductCreate) => apiRequest<Product>("/api/products", { method: "POST", body: payload }),
  replace: (id: string, payload: ProductCreate) => apiRequest<Product>(`/api/products/${id}`, { method: "PUT", body: payload }),
  update: (id: string, payload: ProductUpdate) => apiRequest<Product>(`/api/products/${id}`, { method: "PATCH", body: payload }),
  remove: (id: string) => apiRequest<void>(`/api/products/${id}`, { method: "DELETE" }),
};


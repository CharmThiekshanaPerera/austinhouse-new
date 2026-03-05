import type { Service } from "@/contexts/DataContext";
import { apiRequest } from "@/lib/apiClient";

type ServiceCreate = Omit<Service, "id"> & { id?: string };
type ServiceUpdate = Partial<Omit<Service, "id">>;

export const servicesApi = {
  list: () => apiRequest<Service[]>("/api/services"),
  create: (payload: ServiceCreate) => apiRequest<Service>("/api/services", { method: "POST", body: payload }),
  replace: (id: string, payload: ServiceCreate) => apiRequest<Service>(`/api/services/${id}`, { method: "PUT", body: payload }),
  update: (id: string, payload: ServiceUpdate) => apiRequest<Service>(`/api/services/${id}`, { method: "PATCH", body: payload }),
  remove: (id: string) => apiRequest<void>(`/api/services/${id}`, { method: "DELETE" }),
};

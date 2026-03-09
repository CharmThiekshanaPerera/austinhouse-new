import type { Booking } from "@/contexts/DataContext";
import { apiRequest } from "@/lib/apiClient";

type BookingCreate = Omit<Booking, "id">;
type BookingUpdate = Partial<Omit<Booking, "id">>;

export const bookingsApi = {
  list: () => apiRequest<Booking[]>("/api/bookings"),
  get: (id: string) => apiRequest<Booking>(`/api/bookings/${id}`),
  create: (payload: BookingCreate) =>
    apiRequest<Booking>("/api/bookings", { method: "POST", body: payload }),
  update: (id: string, payload: BookingUpdate) =>
    apiRequest<Booking>(`/api/bookings/${id}`, { method: "PATCH", body: payload }),
  remove: (id: string) =>
    apiRequest<void>(`/api/bookings/${id}`, { method: "DELETE" }),
};

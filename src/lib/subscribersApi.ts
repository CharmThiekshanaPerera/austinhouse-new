import { NewsletterSubscriber } from "@/contexts/DataContext";

const API_BASE = "http://localhost:8000/api/subscribers";

export const subscribersApi = {
  list: async (): Promise<NewsletterSubscriber[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch subscribers");
    const data = await res.json();
    return data.map((s: any) => ({
      ...s,
      subscribedAt: s.created_at,
    }));
  },

  create: async (email: string): Promise<NewsletterSubscriber> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Failed to subscribe");
    const data = await res.json();
    return {
      ...data,
      subscribedAt: data.created_at,
    };
  },

  remove: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete subscriber");
  },

  update: async (id: string, active: boolean): Promise<NewsletterSubscriber> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    if (!res.ok) throw new Error("Failed to update subscriber");
    const data = await res.json();
    return {
      ...data,
      subscribedAt: data.created_at,
    };
  },
};

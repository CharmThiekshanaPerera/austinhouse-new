type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000";

export async function apiRequest<TResponse>(
  path: string,
  options?: {
    method?: HttpMethod;
    body?: unknown;
  },
): Promise<TResponse> {
  const method = options?.method ?? "GET";
  console.log(`[API Request] ${method} ${path}`, options?.body || "");

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: options?.body ? { "Content-Type": "application/json" } : undefined,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}${text ? `: ${text}` : ""}`);
  }

  if (res.status === 204) return undefined as TResponse;
  return (await res.json()) as TResponse;
}


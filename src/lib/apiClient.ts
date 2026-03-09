type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

export async function apiRequest<TResponse>(
  path: string,
  options?: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
  },
): Promise<TResponse> {
  const method = options?.method ?? "GET";
  console.log(`[API Request] ${method} ${path}`, options?.body || "");

  const headers: Record<string, string> = { ...(options?.headers ?? {}) };
  if (options?.body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const errorMsg = `API ${res.status} ${res.statusText}${text ? `: ${text}` : ""}`;
    console.error("[API Error]", errorMsg, "Path:", path);
    throw new Error(errorMsg);
  }

  if (res.status === 204) return undefined as TResponse;
  return (await res.json()) as TResponse;
}



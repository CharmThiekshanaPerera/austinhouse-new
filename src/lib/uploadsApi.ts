export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/uploads`, { method: "POST", body: form });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status})${text ? `: ${text}` : ""}`);
  }
  const json = (await res.json()) as { url: string };
  // Convert relative backend URL to absolute, so the frontend can render it immediately.
  return json.url.startsWith("http") ? json.url : `${baseUrl}${json.url}`;
}

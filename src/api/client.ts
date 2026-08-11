const PUBLIC_PATHS = ["/login", "/register"];

const getApiUrl = () =>
  (import.meta as ImportMeta)?.env?.VITE_API_URL || process.env.VITE_API_URL || "";

const api = async <T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = (() => {
    const t = localStorage.getItem("token");
    return t && t !== "null" && t !== "undefined" ? t : null;
  })();

  const isPublic = PUBLIC_PATHS.some(p => path.startsWith(p));

  const res = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(!isPublic && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    // Try to parse JSON, but fall back to empty object
    const err: unknown = await res.json().catch(() => ({}));

    if (typeof err === "object" && err !== null && "message" in err) {
      throw new Error((err as { message?: string }).message ?? "Request failed");
    }

    throw new Error("Request failed");
  }


  const data = await res.json();
  return data as T;
}

export default api;

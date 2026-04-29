/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = process.env.API_URL || "http://localhost:4000/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOpts } = options;

  let url = `${API_BASE}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) searchParams.set(k, String(v));
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...fetchOpts,
    headers: {
      "Content-Type": "application/json",
      ...fetchOpts.headers,
    },
    cache: fetchOpts.cache || "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API Error: ${res.status}`);
  }

  return res.json();
}

// ---- Planet APIs ----
export const planetApi = {
  list: () => apiFetch<{ data: any[] }>("/planets"),
  get: (slug: string) => apiFetch<{ data: any }>(`/planets/${slug}`),
};

// ---- Star APIs ----
export const starApi = {
  list: (params?: { magnitudeLt?: number; constellation?: string; limit?: number }) =>
    apiFetch<{ data: any[] }>("/stars", { params }),
  get: (id: string) => apiFetch<{ data: any }>(`/stars/${id}`),
  visibility: (lat: number, lng: number, date?: string) =>
    apiFetch<{ data: any[] }>("/stars/visibility/calculate", { params: { lat, lng, date } }),
};

// ---- Constellation APIs ----
export const constellationApi = {
  list: () => apiFetch<{ data: any[] }>("/constellations"),
  get: (abbreviation: string) => apiFetch<{ data: any }>(`/constellations/${abbreviation}`),
};

// ---- Event APIs ----
export const eventApi = {
  list: (params?: { year?: number; type?: string }) =>
    apiFetch<{ data: any[] }>("/events", { params }),
  get: (id: string) => apiFetch<{ data: any }>(`/events/${id}`),
};

// ---- Article APIs ----
export const articleApi = {
  list: (params?: { page?: number; perPage?: number; slug?: string; categorySlug?: string }) =>
    apiFetch<{ data: any[]; total: number; page: number; totalPages: number }>("/articles", { params }),
  get: (slug: string) => apiFetch<{ data: any }>(`/articles/${slug}`),
};

// ---- Search API ----
export const searchApi = {
  search: (q: string) => apiFetch<{ data: any }>(`/search?q=${encodeURIComponent(q)}`),
};

// ---- Starmap APIs ----
export const starmapApi = {
  stars: () => apiFetch<{ data: any[] }>("/starmap"),
  lines: () => apiFetch<{ data: { positions: number[] }[] }>("/starmap/lines"),
};

// ---- Auth APIs ----
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ data: { token: string; user: any } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (data: { name?: string; email: string; password: string }) =>
    apiFetch<{ data: { token: string; user: any } }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: (token: string) =>
    apiFetch<{ data: any }>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ---- Favorite APIs ----
export const favoriteApi = {
  list: (token: string) =>
    apiFetch<{ data: any[] }>("/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  add: (token: string, entityType: string, entityId: string) =>
    apiFetch<{ data: any }>("/favorites", {
      method: "POST",
      body: JSON.stringify({ entityType, entityId }),
      headers: { Authorization: `Bearer ${token}` },
    }),
  remove: (token: string, id: string) =>
    apiFetch<{ data: any }>(`/favorites/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ---- Note APIs ----
export const noteApi = {
  list: (token: string, entityType?: string, entityId?: string) =>
    apiFetch<{ data: any[] }>("/notes", {
      params: { entityType, entityId },
      headers: { Authorization: `Bearer ${token}` },
    }),
  create: (token: string, data: { entityType: string; entityId: string; title?: string; content: string; isPublic?: boolean }) =>
    apiFetch<{ data: any }>("/notes", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    }),
  update: (token: string, id: string, data: { title?: string; content?: string; isPublic?: boolean }) =>
    apiFetch<{ data: any }>(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    }),
  delete: (token: string, id: string) =>
    apiFetch<{ data: any }>(`/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

import type { FeedingTime, LogEntry } from "./types";

let CLIENT_API_BASE_URL: string | null = null;

export const setClientApiBaseUrl = (url: string) => { CLIENT_API_BASE_URL = url; };

const getBaseUrl = () => {
  const url = CLIENT_API_BASE_URL || process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) throw new Error("API base URL is not configured");
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return {} as T;
  }

  return res.json();
}

export const api = {
  feedingTimes: {
    list: () => request<FeedingTime[]>("/feeding_times", { cache: "no-store" }),
    get: (id: string) => request<FeedingTime>(`/feeding_times/${id}`),
    create: (data: Omit<FeedingTime, "id">) => 
      request<FeedingTime>("/feeding_times", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<FeedingTime>) => 
      request<FeedingTime>(`/feeding_times/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/feeding_times/${id}`, { method: "DELETE" }),
  },

 
  motor: {
    feed: () => request<void>("/feed_now", { method: "POST" }),
    status: () => request<{ running: boolean }>("/motor_status", { cache: "no-store" }),
  },

  lights: {
    flash: () => request<void>("/flash_lights", { method: "POST" }),
    status: () => request<{ running: boolean }>("/lights_status", { cache: "no-store" }),
  },

  logs: {
    list: () => request<LogEntry[]>("/logs", { cache: "no-store" }),
  },
};

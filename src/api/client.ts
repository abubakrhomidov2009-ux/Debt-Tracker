import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";
import { tokenStorage } from "../lib/tokenStorage";
import type { ApiErrorBody, Tokens } from "../types";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  detail?: string;

  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

let refreshPromise: Promise<Tokens | null> | null = null;

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        tokenStorage.getRefreshToken()
      ) {
        originalRequest._retry = true;

        if (!refreshPromise) {
          refreshPromise = refreshTokens();
        }

        const refreshed = await refreshPromise;
        if (refreshed) {
          const token = tokenStorage.getAccessToken();
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return instance(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

async function refreshTokens(): Promise<Tokens | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<{
      accessToken: string;
      refreshToken: string;
    }>(
      `${API_BASE_URL}/api/auth/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    const tokens = response.data;
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
  } catch {
    return null;
  } finally {
    refreshPromise = null;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | undefined>;
}

function buildQuery(query?: Record<string, string | undefined>) {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = true, query } = options;

  try {
    const response = await axiosInstance.request<T>({
      url: `${path}${buildQuery(query)}`,
      method,
      data: body,
      headers: auth ? undefined : { Authorization: undefined },
    });

    if (response.status === 204) {
      return undefined as T;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const errBody = error.response?.data as ApiErrorBody | undefined;
      throw new ApiError(
        status,
        errBody?.error ?? error.message ?? "Request failed",
        errBody?.detail
      );
    }
    throw error;
  }
}
import { apiFetch } from "./client";
import type { AuthResponse } from "../types";

export function register(input: {
  name: string;
  email: string;
  password: string;
}) {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: input,
    auth: false,
  });
}

export function login(input: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: input,
    auth: false,
  });
}

export function logout(refreshToken: string) {
  return apiFetch<{ message: string }>("/api/auth/logout", {
    method: "POST",
    body: { refreshToken },
    auth: false,
  });
}

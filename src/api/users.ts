import { apiFetch } from "./client";
import type { User } from "../types";

export function getMe() {
  return apiFetch<User>("/api/users/me");
}

export function updateMe(input: { name: string }) {
  return apiFetch<User>("/api/users/me", { method: "PATCH", body: input });
}

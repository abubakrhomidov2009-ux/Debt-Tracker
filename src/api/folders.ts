import { apiFetch } from "./client";
import type { Folder } from "../types";

export interface FolderInput {
  name: string;
  color?: string;
}

export function listFolders() {
  return apiFetch<Folder[]>("/api/folders");
}

export function createFolder(input: FolderInput) {
  return apiFetch<Folder>("/api/folders", { method: "POST", body: input });
}

export function getFolder(id: string) {
  return apiFetch<Folder>(`/api/folders/${id}`);
}

export function updateFolder(id: string, input: FolderInput) {
  return apiFetch<Folder>(`/api/folders/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteFolder(id: string) {
  return apiFetch<void>(`/api/folders/${id}`, { method: "DELETE" });
}

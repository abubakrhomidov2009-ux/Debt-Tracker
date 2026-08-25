import { apiFetch } from "./client";
import type { Contact } from "../types";

export interface ContactInput {
  name: string;
  phone?: string;
  email?: string;
  note?: string;
  folder_id?: string;
}

export function listContacts(folderId?: string) {
  return apiFetch<Contact[]>("/api/contacts", {
    query: { folder_id: folderId },
  });
}

export function createContact(input: ContactInput) {
  return apiFetch<Contact>("/api/contacts", { method: "POST", body: input });
}

export function getContact(id: string) {
  return apiFetch<Contact>(`/api/contacts/${id}`);
}

export function updateContact(id: string, input: ContactInput) {
  return apiFetch<Contact>(`/api/contacts/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteContact(id: string) {
  return apiFetch<void>(`/api/contacts/${id}`, { method: "DELETE" });
}

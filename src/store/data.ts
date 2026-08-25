import { atom } from "jotai";
import type { Contact, DashboardSummary, Debt, Folder } from "../types";

// Plain in-memory caches (not persisted) — refetched each session. Pages
// write into these after a successful fetch/create/update/delete so every
// screen that reads the same atom stays in sync automatically.
export const foldersAtom = atom<Folder[]>([]);
export const contactsAtom = atom<Contact[]>([]);
export const debtsAtom = atom<Debt[]>([]);
export const dashboardAtom = atom<DashboardSummary | null>(null);

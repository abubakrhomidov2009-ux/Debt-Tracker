import { atomWithStorage } from "jotai/utils";

export type Theme = "light" | "dark";

const prefersDark =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

export const themeAtom = atomWithStorage<Theme>(
  "ledger.theme",
  prefersDark ? "dark" : "light",
);

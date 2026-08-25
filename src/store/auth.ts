import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { tokenStorage } from "../lib/tokenStorage";
import type { User } from "../types";

// The user object is small and non-sensitive (name/email), so it's fine to
// keep in localStorage too — this is what lets a page refresh land you
// back on the dashboard instead of the login screen.
export const userAtom = atomWithStorage<User | null>("ledger.user", null);

// Tokens live in their own storage module (not atomWithStorage) because
// the plain fetch client in src/api/client.ts needs to read them outside
// of React. Deriving this from userAtom (rather than reading
// tokenStorage directly) is what makes it reactive: Jotai only
// recomputes a read atom when one of the atoms it `get()`s changes, and
// startSessionAtom/endSessionAtom always update userAtom in lockstep
// with the tokens.
export const isAuthenticatedAtom = atom(
  (get) => get(userAtom) !== null && tokenStorage.getAccessToken() !== null,
);

// Write-only atom: call `set(sessionAtom, authResponse)` right after a
// successful login or register call.
export const startSessionAtom = atom(
  null,
  (_get, set, payload: { user: User; accessToken: string; refreshToken: string }) => {
    tokenStorage.setTokens(payload.accessToken, payload.refreshToken);
    set(userAtom, payload.user);
  },
);

export const endSessionAtom = atom(null, (_get, set) => {
  tokenStorage.clear();
  set(userAtom, null);
});

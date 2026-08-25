// A tiny wrapper around localStorage for the two JWTs. Kept separate from
// the Jotai atoms so the API client (which lives outside React) can read
// the current token without needing a hook.

const ACCESS_KEY = "ledger.accessToken";
const REFRESH_KEY = "ledger.refreshToken";

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

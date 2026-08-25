import { Navigate, Outlet } from "react-router-dom";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "../store/auth";

export function ProtectedRoute() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
}

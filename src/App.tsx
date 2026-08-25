import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FoldersPage } from "./pages/FoldersPage";
import { ContactsPage } from "./pages/ContactsPage";
import { ContactDetailPage } from "./pages/ContactDetailPage";
import { DebtsPage } from "./pages/DebtsPage";
import { DebtFormPage } from "./pages/DebtFormPage";
import { DebtDetailPage } from "./pages/DebtDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/folders" element={<FoldersPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contacts/:id" element={<ContactDetailPage />} />
          <Route path="/debts" element={<DebtsPage />} />
          <Route path="/debts/new" element={<DebtFormPage />} />
          <Route path="/debts/:id" element={<DebtDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
import { apiFetch } from "./client";
import type { Debt, DebtDirection, DebtStatus, Payment } from "../types";

export interface CreateDebtInput {
  contact_id: string;
  direction: DebtDirection;
  amount: number;
  currency?: string;
  description?: string;
  due_date?: string;
}

export interface UpdateDebtInput {
  contact_id?: string;
  direction?: DebtDirection;
  amount?: number;
  currency?: string;
  description?: string;
  due_date?: string;
  status?: DebtStatus;
}

export interface DebtFilters {
  status?: DebtStatus;
  contact_id?: string;
  direction?: DebtDirection;
}

export function listDebts(filters: DebtFilters = {}) {
  return apiFetch<Debt[]>("/api/debts", {
    query: {
      status: filters.status,
      contact_id: filters.contact_id,
      direction: filters.direction,
    },
  });
}

export function createDebt(input: CreateDebtInput) {
  return apiFetch<Debt>("/api/debts", { method: "POST", body: input });
}

export function getDebt(id: string) {
  return apiFetch<Debt>(`/api/debts/${id}`);
}

export function updateDebt(id: string, input: UpdateDebtInput) {
  return apiFetch<Debt>(`/api/debts/${id}`, { method: "PATCH", body: input });
}

export function deleteDebt(id: string) {
  return apiFetch<void>(`/api/debts/${id}`, { method: "DELETE" });
}

export function listPayments(debtId: string) {
  return apiFetch<Payment[]>(`/api/debts/${debtId}/payments`);
}

export function addPayment(
  debtId: string,
  input: { amount: number; note?: string; paid_at?: string },
) {
  return apiFetch<Payment>(`/api/debts/${debtId}/payments`, {
    method: "POST",
    body: input,
  });
}

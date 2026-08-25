import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  User,
  Calendar,
  FileText,
  Plus,
  CheckCircle,
  Trash2,
  Receipt,
  DollarSign,
  History,
} from "lucide-react";
import {
  addPayment,
  deleteDebt,
  getDebt,
  listPayments,
  updateDebt,
} from "../api/debts";
import { getContact } from "../api/contacts";
import { ApiError } from "../api/client";
import type { Contact, Debt, DebtStatus, Payment } from "../types";
import { AmountText } from "../components/AmountText";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/Button";
import { Input, Textarea } from "../components/Field";
import { Modal } from "../components/Modal";
import { Spinner, ErrorBanner } from "../components/Feedback";

export function DebtDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [debt, setDebt] = useState<Debt | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  async function loadAll(debtId: string) {
    const debtData = await getDebt(debtId);
    const [contactData, paymentsData] = await Promise.all([
      getContact(debtData.contact_id),
      listPayments(debtId),
    ]);
    setDebt(debtData);
    setContact(contactData);
    setPayments(paymentsData);
  }

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    loadAll(id)
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load this debt.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const paidSoFar = useMemo(() => payments.reduce((sum, p) => sum + p.amount, 0), [payments]);
  const progress = debt ? Math.min(100, Math.round((paidSoFar / debt.amount) * 100)) : 0;

  async function handleDelete() {
    if (!debt) return;
    if (!confirm("Delete this debt and its payment history?")) return;
    await deleteDebt(debt.id);
    navigate("/debts");
  }

  async function markStatus(status: DebtStatus) {
    if (!debt) return;
    const updated = await updateDebt(debt.id, { status });
    setDebt(updated);
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!debt || !contact) return null;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-4 sm:p-6">
      {/* Back Link */}
      <Link
        to="/debts"
        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Debts</span>
      </Link>

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {debt.direction === "they_owe_me" ? (
                <>
                  <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
                  <span>They owe me</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 text-rose-500" />
                  <span>I owe them</span>
                </>
              )}
            </p>
            <AmountText
              amount={debt.amount}
              currency={debt.currency}
              direction={debt.direction}
              size="xl"
            />
          </div>
          <StatusBadge status={debt.status} />
        </div>

        {/* Contact Info & Due Date */}
        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 p-3.5 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
          <Link
            to={`/contacts/${contact.id}`}
            className="flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
          >
            <User className="h-4 w-4 text-slate-400" />
            <span>{contact.name}</span>
          </Link>
          {debt.due_date && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>Due {new Date(debt.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {debt.description && (
          <p className="mt-4 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <FileText className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
            <span>{debt.description}</span>
          </p>
        )}

        {/* Progress Bar */}
        {debt.status !== "paid" && (
          <div className="mt-6 space-y-2 rounded-xl bg-slate-50/70 p-4 border border-slate-100 dark:bg-slate-800/30 dark:border-slate-800">
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>Paid so far</span>
              <span className="tabular-money text-indigo-600 dark:text-indigo-400">{progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Button
            onClick={() => setPaymentModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            <span>Add payment</span>
          </Button>

          {debt.status !== "paid" && (
            <Button
              variant="secondary"
              onClick={() => markStatus("paid")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Mark as paid</span>
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={handleDelete}
            className="ml-auto flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Payment History Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <History className="h-5 w-5 text-indigo-500" />
          <h2 className="font-display text-lg font-bold">Payment history</h2>
        </div>

        {payments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            No payments logged yet.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/60">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {p.note || "Payment"}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(p.paid_at).toLocaleDateString()}
                  </p>
                </div>
                <AmountText amount={p.amount} currency={debt.currency} size="sm" />
              </div>
            ))}
          </div>
        )}
      </section>

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        debt={debt}
        onAdded={(payment, updatedDebt) => {
          setPayments([payment, ...payments]);
          setDebt(updatedDebt);
        }}
      />
    </div>
  );
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  debt: Debt;
  onAdded: (payment: Payment, updatedDebt: Debt) => void;
}

function PaymentModal({ open, onClose, debt, onAdded }: PaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setAmount("");
      setNote("");
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payment = await addPayment(debt.id, { amount: parsed, note: note || undefined });
      const updatedDebt = await getDebt(debt.id); // status may have flipped to partial/paid
      onAdded(payment, updatedDebt);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add payment">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
        {error && <ErrorBanner message={error} />}

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Amount ({debt.currency})</span>
          </div>
          <Input
            label=""
            type="number"
            step="0.01"
            min="0"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Receipt className="h-3.5 w-3.5" />
            <span>Note</span>
          </div>
          <Textarea label="" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <Button
          type="submit"
          loading={submitting}
          className="mt-2 w-full rounded-xl bg-indigo-600 py-2.5 font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Log payment
        </Button>
      </form>
    </Modal>
  );
}
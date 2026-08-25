import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Phone,
  Mail,
  FileText,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  ChevronRight,
  Wallet,
  Receipt,
} from "lucide-react";
import { deleteContact, getContact } from "../api/contacts";
import { listDebts } from "../api/debts";
import { ApiError } from "../api/client";
import type { Contact, Debt } from "../types";
import { Avatar } from "../components/Avatar";
import { AmountText } from "../components/AmountText";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Spinner, ErrorBanner } from "../components/Feedback";

export function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contact, setContact] = useState<Contact | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([getContact(id), listDebts({ contact_id: id })])
      .then(([contactData, debtsData]) => {
        if (cancelled) return;
        setContact(contactData);
        setDebts(debtsData);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load this contact.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const balance = useMemo(() => {
    return debts.reduce((sum, d) => {
      if (d.status === "paid") return sum;
      return d.direction === "they_owe_me" ? sum + d.amount : sum - d.amount;
    }, 0);
  }, [debts]);

  async function handleDelete() {
    if (!contact) return;
    if (!confirm(`Delete ${contact.name}? Their debts will stay on record but lose the contact link.`)) return;
    await deleteContact(contact.id);
    navigate("/contacts");
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!contact) return null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 sm:p-6">
      {/* Back Link */}
      <Link
        to="/contacts"
        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Contacts</span>
      </Link>

      {/* Hero Contact Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={contact.name} className="h-16 w-16 text-xl ring-4 ring-indigo-50 dark:ring-indigo-950/40" />
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {contact.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                {contact.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {contact.phone}
                  </span>
                )}
                {contact.phone && contact.email && <span>·</span>}
                {contact.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {contact.email}
                  </span>
                )}
                {!contact.phone && !contact.email && <span>No contact info</span>}
              </div>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200/80 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-950/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete contact</span>
          </button>
        </div>

        {/* Note Section */}
        {contact.note && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-sm text-slate-600 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-300">
            <FileText className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
            <p>{contact.note}</p>
          </div>
        )}
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Wallet className="h-4 w-4 text-indigo-500" />
          <span>Outstanding Balance</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <p
            className={`tabular-money font-display text-3xl font-extrabold tracking-tight ${
              balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {balance >= 0 ? "+" : "−"}
            {Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {balance !== 0 && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                balance >= 0
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
              }`}
            >
              {balance >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {balance >= 0 ? "Credit" : "Debit"}
            </span>
          )}
        </div>

        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {balance >= 0
            ? "They owe you in total, net of paid debts."
            : "You owe them in total, net of paid debts."}
        </p>
      </div>

      {/* Debts Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Receipt className="h-5 w-5 text-indigo-500" />
            <h2 className="font-display text-lg font-bold">Associated Debts</h2>
          </div>

          <Link to={`/debts/new?contact=${contact.id}`}>
            <Button className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
              <Plus className="h-4 w-4" />
              <span>Add debt</span>
            </Button>
          </Link>
        </div>

        {debts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
            <EmptyState
              title="No debts yet"
              description="Log the first thing you lent or borrowed with this contact."
              action={
                <Button
                  onClick={() => navigate(`/debts/new?contact=${contact.id}`)}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add a debt</span>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/60">
            {debts.map((debt) => (
              <Link
                key={debt.id}
                to={`/debts/${debt.id}`}
                className="group flex items-center justify-between p-4 transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <div className="space-y-1 min-w-0 pr-4">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {debt.description || "No description"}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {debt.due_date ? new Date(debt.due_date).toLocaleDateString() : "No due date"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <AmountText amount={debt.amount} currency={debt.currency} direction={debt.direction} size="sm" />
                  <StatusBadge status={debt.status} />
                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
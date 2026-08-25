import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAtom } from "jotai";
import {
  ArrowDownLeft,
  ArrowUpRight,
  User,
  Calendar,
  DollarSign,
  FileText,
  Coins,
  CheckCircle2,
} from "lucide-react";
import { createDebt } from "../api/debts";
import { listContacts } from "../api/contacts";
import { ApiError } from "../api/client";
import type { DebtDirection } from "../types";
import { contactsAtom } from "../store/data";
import { Button } from "../components/Button";
import { Input, Select, Textarea } from "../components/Field";
import { ErrorBanner } from "../components/Feedback";
import clsx from "clsx";

export function DebtFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [contacts, setContacts] = useAtom(contactsAtom);

  const [contactId, setContactId] = useState(searchParams.get("contact") ?? "");
  const [direction, setDirection] = useState<DebtDirection>("they_owe_me");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contacts.length === 0) {
      listContacts().then(setContacts).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!contactId) {
      setError("Pick who this debt is with.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setSubmitting(true);
    try {
      const debt = await createDebt({
        contact_id: contactId,
        direction,
        amount: parsedAmount,
        currency,
        description: description || undefined,
        due_date: dueDate || undefined,
      });
      navigate(`/debts/${debt.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Coins className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            New debt
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Record a new transaction or outstanding balance
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60"
      >
        {error && <ErrorBanner message={error} />}

        {/* Contact Selection */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <User className="h-3.5 w-3.5" />
            <span>Contact</span>
          </div>
          <Select
            label=""
            required
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
          >
            <option value="" disabled>
              Choose a contact…
            </option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Direction Selector */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Direction
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDirection("they_owe_me")}
              className={clsx(
                "relative flex items-center justify-center gap-2 rounded-xl border p-3.5 text-sm font-semibold transition-all shadow-2xs",
                direction === "they_owe_me"
                  ? "border-emerald-500/80 bg-emerald-500/10 text-emerald-700 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border-slate-200/80 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:border-slate-700"
              )}
            >
              <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
              <span>They owe me</span>
              {direction === "they_owe_me" && (
                <CheckCircle2 className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-emerald-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setDirection("i_owe_them")}
              className={clsx(
                "relative flex items-center justify-center gap-2 rounded-xl border p-3.5 text-sm font-semibold transition-all shadow-2xs",
                direction === "i_owe_them"
                  ? "border-rose-500/80 bg-rose-500/10 text-rose-700 ring-2 ring-rose-500/20 dark:bg-rose-950/40 dark:text-rose-300"
                  : "border-slate-200/80 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:border-slate-700"
              )}
            >
              <ArrowUpRight className="h-4 w-4 text-rose-500" />
              <span>I owe them</span>
              {direction === "i_owe_them" && (
                <CheckCircle2 className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-rose-500" />
              )}
            </button>
          </div>
        </div>

        {/* Amount & Currency */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Amount</span>
            </div>
            <Input
              label=""
              type="number"
              step="0.01"
              min="0"
              required
              containerClassName="col-span-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span>Currency</span>
            </div>
            <Input
              label=""
              required
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <FileText className="h-3.5 w-3.5" />
            <span>Description</span>
          </div>
          <Textarea
            label=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Due Date */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Due date</span>
          </div>
          <Input
            label=""
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={submitting}
          className="mt-2 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Save debt
        </Button>
      </form>
    </div>
  );
}
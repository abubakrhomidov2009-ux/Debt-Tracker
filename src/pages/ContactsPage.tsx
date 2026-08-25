import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Link, useSearchParams } from "react-router-dom";
import {
  UserPlus,
  Users,
  Search,
  Folder,
  ChevronRight,
  User,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import { createContact, listContacts } from "../api/contacts";
import { listFolders } from "../api/folders";
import { ApiError } from "../api/client";
import type { Contact } from "../types";
import { contactsAtom, foldersAtom } from "../store/data";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Input, Select, Textarea } from "../components/Field";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { Spinner, ErrorBanner } from "../components/Feedback";

export function ContactsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const folderFilter = searchParams.get("folder") ?? "";

  const [contacts, setContacts] = useAtom(contactsAtom);
  const folders = useAtomValue(foldersAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listFolders().catch(() => []); // keep folders atom warm for the filter dropdown, ignore errors here
    listContacts(folderFilter || undefined)
      .then((data) => !cancelled && setContacts(data))
      .catch((err) => !cancelled && setError(err instanceof ApiError ? err.message : "Couldn't load contacts."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [contacts, search]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Contacts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage borrowers, lenders, and categorized contacts
            </p>
          </div>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <UserPlus className="h-4 w-4" />
          <span>New contact</span>
        </Button>
      </header>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs sm:flex-row dark:border-slate-800 dark:bg-slate-900/60">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts…"
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 pl-10 pr-3.5 py-2 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
          />
        </div>

        <div className="relative">
          <Folder className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={folderFilter}
            onChange={(e) => {
              const value = e.target.value;
              setSearchParams(value ? { folder: value } : {});
            }}
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 pl-10 pr-8 py-2 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
          >
            <option value="">All folders</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main List Area */}
      {loading ? (
        <div className="py-12">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorBanner message={error} />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
          <EmptyState
            title="No contacts here"
            description="Add the people you lend to or borrow from — you'll pick them when logging a debt."
            action={
              <Button
                onClick={() => setModalOpen(true)}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add a contact</span>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/60">
          {filtered.map((contact) => (
            <Link
              key={contact.id}
              to={`/contacts/${contact.id}`}
              className="group flex items-center gap-3.5 p-4 transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
            >
              <Avatar name={contact.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {contact.name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {contact.phone || contact.email || "No contact info"}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}

      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(contact) => setContacts([contact, ...contacts])}
      />
    </div>
  );
}

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (contact: Contact) => void;
}

function ContactModal({ open, onClose, onCreated }: ContactModalProps) {
  const folders = useAtomValue(foldersAtom);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [folderId, setFolderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setPhone("");
      setEmail("");
      setNote("");
      setFolderId("");
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const created = await createContact({
        name,
        phone: phone || undefined,
        email: email || undefined,
        note: note || undefined,
        folder_id: folderId || undefined,
      });
      onCreated(created);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New contact">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
        {error && <ErrorBanner message={error} />}

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <User className="h-3.5 w-3.5" />
            <span>Name</span>
          </div>
          <Input label="" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Phone className="h-3.5 w-3.5" />
            <span>Phone</span>
          </div>
          <Input label="" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Mail className="h-3.5 w-3.5" />
            <span>Email</span>
          </div>
          <Input label="" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Folder className="h-3.5 w-3.5" />
            <span>Folder</span>
          </div>
          <Select label="" value={folderId} onChange={(e) => setFolderId(e.target.value)}>
            <option value="">No folder</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <FileText className="h-3.5 w-3.5" />
            <span>Note</span>
          </div>
          <Textarea label="" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <Button
          type="submit"
          loading={submitting}
          className="mt-2 w-full rounded-xl bg-indigo-600 py-2.5 font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Add contact
        </Button>
      </form>
    </Modal>
  );
}
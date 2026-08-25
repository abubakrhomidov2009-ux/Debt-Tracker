import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { Folder, FolderPlus, Edit2, Trash2, Check, ChevronRight } from "lucide-react";
import { createFolder, deleteFolder, listFolders, updateFolder } from "../api/folders";
import { ApiError } from "../api/client";
import type { Folder as FolderType } from "../types";
import { foldersAtom } from "../store/data";
import { Button } from "../components/Button";
import { Input } from "../components/Field";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import { Spinner, ErrorBanner } from "../components/Feedback";

const swatches = ["#1F7A5C", "#B23A2E", "#2C4A7C", "#A8701F", "#6B5B95", "#4A5259"];

export function FoldersPage() {
  const [folders, setFolders] = useAtom(foldersAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FolderType | null>(null);

  useEffect(() => {
    let cancelled = false;
    listFolders()
      .then((data) => !cancelled && setFolders(data))
      .catch((err) => !cancelled && setError(err instanceof ApiError ? err.message : "Couldn't load folders."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(folder: FolderType) {
    setEditing(folder);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this folder? Contacts inside it won't be deleted.")) return;
    await deleteFolder(id);
    setFolders(folders.filter((f) => f.id !== id));
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Folders
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Organize your contacts into custom groups and categories.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New folder</span>
        </Button>
      </header>

      {/* Main Content State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorBanner message={error} />
      ) : folders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200/80 p-8 text-center dark:border-slate-800">
          <EmptyState
            title="No folders yet"
            description="Group contacts by household, project, or however you keep track of who's who."
            action={
              <Button
                onClick={openCreate}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <FolderPlus className="h-4 w-4" />
                <span>Create your first folder</span>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => {
            const folderColor = folder.color ?? "#4A5259";
            return (
              <div
                key={folder.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
              >
                <Link to={`/contacts?folder=${folder.id}`} className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Folder Icon Badge */}
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${folderColor}15`,
                        color: folderColor,
                      }}
                    >
                      <Folder className="h-5 w-5 fill-current" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-display font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                        {folder.name}
                      </span>
                      <p className="text-xs text-slate-400">View contacts</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />
                </Link>

                {/* Card Actions */}
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                  <button
                    onClick={() => openEdit(folder)}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(folder.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Folder Modal */}
      <FolderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onCreated={(folder) => setFolders([folder, ...folders])}
        onUpdated={(folder) =>
          setFolders(folders.map((f) => (f.id === folder.id ? folder : f)))
        }
      />
    </div>
  );
}

interface FolderModalProps {
  open: boolean;
  onClose: () => void;
  editing: FolderType | null;
  onCreated: (folder: FolderType) => void;
  onUpdated: (folder: FolderType) => void;
}

function FolderModal({ open, onClose, editing, onCreated, onUpdated }: FolderModalProps) {
  const [name, setName] = useState(editing?.name ?? "");
  const [color, setColor] = useState(editing?.color ?? swatches[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(editing?.name ?? "");
    setColor(editing?.color ?? swatches[0]);
    setError(null);
  }, [editing, open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editing) {
        const updated = await updateFolder(editing.id, { name, color });
        onUpdated(updated);
      } else {
        const created = await createFolder({ name, color });
        onCreated(created);
      }
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Edit folder" : "New folder"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-1">
        {error && <ErrorBanner message={error} />}
        
        <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
        
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Folder Color
          </p>
          <div className="flex flex-wrap gap-3">
            {swatches.map((swatch) => {
              const isSelected = color === swatch;
              return (
                <button
                  type="button"
                  key={swatch}
                  onClick={() => setColor(swatch)}
                  aria-label={`Choose color ${swatch}`}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-hidden"
                  style={{ backgroundColor: swatch }}
                >
                  {isSelected && <Check className="h-4 w-4 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          loading={submitting}
          className="mt-2 w-full justify-center rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {editing ? "Save changes" : "Create folder"}
        </Button>
      </form>
    </Modal>
  );
}
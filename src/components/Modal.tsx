import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] dark:bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-md rounded-t-2xl border border-ink/10 bg-paper-raised p-6 shadow-xl sm:rounded-2xl dark:border-ink-dark/10 dark:bg-paper-dark-raised"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg text-ink dark:text-ink-dark">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-ink-soft hover:bg-ink/5 dark:hover:bg-ink-dark/5"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
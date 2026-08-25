import { forwardRef } from "react";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import clsx from "clsx";

const fieldClasses =
  "w-full rounded-lg border border-ink/15 bg-paper-raised px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-wire dark:border-ink-dark/15 dark:bg-paper-dark-raised dark:text-ink-dark";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  containerClassName?: string;
}

function FieldWrapper({ label, htmlFor, error, hint, children, containerClassName }: FieldWrapperProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5", containerClassName)}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-wide text-ink-soft"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-debit">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-soft">{hint}</p>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, containerClassName, ...rest }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <FieldWrapper
        label={label}
        htmlFor={fieldId}
        error={error}
        hint={hint}
        containerClassName={containerClassName}
      >
        <input
          ref={ref}
          id={fieldId}
          className={clsx(fieldClasses, error && "border-debit", className)}
          {...rest}
        />
      </FieldWrapper>
    );
  },
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className, ...rest }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <FieldWrapper label={label} htmlFor={fieldId} error={error} hint={hint}>
        <textarea
          ref={ref}
          id={fieldId}
          rows={3}
          className={clsx(fieldClasses, "resize-none", error && "border-debit", className)}
          {...rest}
        />
      </FieldWrapper>
    );
  },
);
Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, className, children, ...rest }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <FieldWrapper label={label} htmlFor={fieldId} error={error} hint={hint}>
        <select
          ref={ref}
          id={fieldId}
          className={clsx(fieldClasses, error && "border-debit", className)}
          {...rest}
        >
          {children}
        </select>
      </FieldWrapper>
    );
  },
);
Select.displayName = "Select";
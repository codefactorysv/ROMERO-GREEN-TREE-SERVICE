"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, AlertTriangle, Loader2, Paperclip, X } from "lucide-react";
import { propertyTypeOptions, serviceOptions } from "@/lib/content";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILES,
  MAX_FILE_SIZE,
  contactSchema,
  type ContactFieldErrors,
} from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

const initialValues = {
  name: "",
  phone: "",
  email: "",
  address: "",
  service: "" as string,
  propertyType: "" as string,
  message: "",
  company: "", // honeypot
};

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function updateField<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    const combined = [...files, ...selected].slice(0, MAX_FILES);

    for (const file of selected) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFileError("Please upload JPG, PNG, WEBP, or HEIC images only.");
        e.target.value = "";
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError("Each photo must be under 8MB.");
        e.target.value = "";
        return;
      }
    }
    if (files.length + selected.length > MAX_FILES) {
      setFileError(`You can attach up to ${MAX_FILES} photos.`);
    } else {
      setFileError(null);
    }

    setFiles(combined);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = contactSchema.safeParse({
      ...values,
      service: values.service || undefined,
      propertyType: values.propertyType || undefined,
    });

    if (!parsed.success) {
      const nextErrors: ContactFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactFieldErrors;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setStatus("submitting");
    setServerMessage(null);

    try {
      const formData = new FormData();
      Object.entries(parsed.data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, String(value));
      });
      files.forEach((file) => formData.append("photos", file));

      const res = await fetch("/api/contact", { method: "POST", body: formData });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        errors?: ContactFieldErrors;
      };

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setServerMessage(
          data.message ?? "Something went wrong sending your request. Please try again.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      setValues(initialValues);
      setFiles([]);
      setErrors({});
      formRef.current?.reset();
    } catch {
      setStatus("error");
      setServerMessage("Network error — please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center rounded-3xl border border-lime-300/40 bg-forest-900 p-10 text-center"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-lime-400/15 text-lime-300">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-cream-50">Thank you!</h3>
        <p className="mt-2 max-w-sm text-cream-100/80">
          We received your request and will contact you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-lime-300 underline underline-offset-4 hover:text-lime-200"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-cream-50/10 bg-forest-900 p-6 sm:p-8"
    >
      {/* Honeypot field — hidden from real visitors, catches simple bots */}
      <div className="absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => updateField("company", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="name" required error={errors.name}>
          <input
            id="name"
            className={inputClass(errors.name)}
            name="name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </Field>

        <Field label="Phone Number" htmlFor="phone" required error={errors.phone}>
          <input
            id="phone"
            className={inputClass(errors.phone)}
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            value={values.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            className={inputClass(errors.email)}
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </Field>

        <Field label="Service Address / ZIP Code" htmlFor="address" error={errors.address}>
          <input
            id="address"
            className={inputClass(errors.address)}
            name="address"
            autoComplete="postal-code"
            value={values.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
        </Field>

        <Field label="Service Needed" htmlFor="service" required error={errors.service}>
          <select
            id="service"
            className={inputClass(errors.service)}
            name="service"
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? "service-error" : undefined}
            value={values.service}
            onChange={(e) => updateField("service", e.target.value)}
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Property Type" error={errors.propertyType}>
          <div className="flex gap-3 pt-1" role="radiogroup" aria-label="Property Type">
            {propertyTypeOptions.map((option) => (
              <label
                key={option}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                  values.propertyType === option
                    ? "border-lime-400 bg-lime-400/10 text-lime-300"
                    : "border-cream-50/15 text-cream-100/80 hover:border-cream-50/30"
                }`}
              >
                <input
                  type="radio"
                  name="propertyType"
                  value={option}
                  checked={values.propertyType === option}
                  onChange={(e) => updateField("propertyType", e.target.value)}
                  className="sr-only"
                />
                {option}
              </label>
            ))}
          </div>
        </Field>
      </div>

      <Field
        label="Message / Tell us what you need"
        htmlFor="message"
        error={errors.message}
        className="mt-5"
      >
        <textarea
          id="message"
          className={inputClass(errors.message)}
          name="message"
          rows={4}
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
        />
      </Field>

      <div className="mt-5">
        <span className="mb-2 block text-sm font-semibold text-cream-100">
          Upload Photos <span className="font-normal text-cream-100/50">(optional)</span>
        </span>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-cream-50/25 px-4 py-5 text-sm text-cream-100/70 transition-colors hover:border-lime-300/50 hover:text-cream-100">
          <Paperclip className="size-4" />
          Add photos of the tree or property
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="sr-only"
            onChange={handleFiles}
          />
        </label>
        {fileError && <p className="mt-2 text-sm text-red-400">{fileError}</p>}
        {files.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center gap-2 rounded-full bg-cream-50/10 px-3 py-1.5 text-xs text-cream-100"
              >
                {file.name}
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(i)}
                  className="text-cream-100/60 hover:text-cream-50"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {status === "error" && serverMessage && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          {serverMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-6 py-4 text-sm font-bold uppercase tracking-wide text-ink-900 shadow-xl shadow-lime-950/20 transition-all hover:-translate-y-0.5 hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:text-base"
      >
        {status === "submitting" && <Loader2 className="size-4 animate-spin" />}
        {status === "submitting" ? "Sending..." : "Request Free Estimate"}
      </button>
      <p className="mt-3 text-center text-xs text-cream-100/50">
        We respect your privacy. Your information is only used to contact you about your estimate.
      </p>
    </form>
  );
}

function inputClass(error?: string) {
  return `w-full rounded-xl border bg-forest-950/60 px-4 py-3 text-cream-50 placeholder:text-cream-100/30 focus:outline-none focus:ring-2 focus:ring-lime-400/60 ${
    error ? "border-red-400/70" : "border-cream-50/15 focus:border-lime-400/60"
  }`;
}

function Field({
  label,
  htmlFor,
  required,
  error,
  className,
  children,
}: {
  label: string;
  /** Omit for grouped controls (radios) that are labelled with aria-label. */
  htmlFor?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const labelContent = (
    <>
      {label} {required && <span className="text-lime-400">*</span>}
    </>
  );

  return (
    <div className={className}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-cream-100">
          {labelContent}
        </label>
      ) : (
        <span className="mb-2 block text-sm font-semibold text-cream-100">{labelContent}</span>
      )}
      {children}
      {error && (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

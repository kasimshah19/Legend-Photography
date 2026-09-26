"use client";

import { FormEvent, useState } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cn } from "@/lib/cn";

const serviceOptions = [
  "Wedding",
  "Pre-Wedding",
  "Maternity",
  "Portrait",
  "Fashion",
  "Event",
  "Other",
] as const;

type FormState = {
  name: string;
  phone: string;
  email: string;
  service: string;
  eventDate: string;
  location: string;
  numberOfEvents: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  service: "",
  eventDate: "",
  location: "",
  numberOfEvents: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState("");

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    else if (form.phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a valid phone number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.service) next.service = "Please select a service.";
    return next;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setStatus("loading");
    setServerError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
      setForm(initial);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Request failed.");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-border bg-white/50 p-10 text-center md:p-14">
        <h2 className="font-serif text-3xl">Thank you!</h2>
        <p className="mt-4 text-muted">We&apos;ll get back to you shortly.</p>
        <div className="mt-8 flex justify-center">
          <WhatsAppButton label="Continue on WhatsApp" />
        </div>
      </div>
    );
  }

  const field = (
    name: keyof FormState,
    label: string,
    opts?: { required?: boolean; type?: string; as?: "textarea" | "select" },
  ) => (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-[0.18em] text-muted">
        {label}
        {opts?.required ? " *" : ""}
      </label>
      {opts?.as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={5}
          value={form[name]}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          className={inputClass(!!errors[name])}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
      ) : opts?.as === "select" ? (
        <select
          id={name}
          name={name}
          value={form[name]}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          className={inputClass(!!errors[name])}
          aria-invalid={!!errors[name]}
        >
          <option value="">Select...</option>
          {serviceOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={opts?.type ?? "text"}
          value={form[name]}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          className={inputClass(!!errors[name])}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
      )}
      {errors[name] ? (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-700" role="alert">
          {errors[name]}
        </p>
      ) : null}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        {field("name", "Full Name", { required: true })}
        {field("phone", "Phone Number", { required: true, type: "tel" })}
      </div>
      {field("email", "Email", { type: "email" })}
      {field("service", "What are you looking for?", { required: true, as: "select" })}
      <div className="grid gap-6 md:grid-cols-2">
        {field("eventDate", "Event Date", { type: "date" })}
        {field("location", "Location")}
      </div>
      {field("numberOfEvents", "Expected Number of Events/Days")}
      {field("message", "Tell us about your requirements", { as: "textarea" })}

      {serverError ? (
        <p className="text-sm text-red-700" role="alert">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full md:w-auto disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "mt-2 w-full border-b bg-transparent px-0 py-3 text-sm outline-none transition-colors focus-visible:border-black placeholder:text-muted/60",
    hasError ? "border-red-600" : "border-border/60 hover:border-black/40",
  );
}

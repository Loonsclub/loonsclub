"use client";

import { useActionState, useId, useState, type ChangeEvent, type FormEvent } from "react";
import { enroll, type EnrollState } from "../actions";
import {
  ENROLL_FIELDS,
  validateAll,
  validateField,
  type EnrollErrors,
  type EnrollField,
} from "../lib/enroll";
import { ErrorText, Field, inputBase, inputBorder, SubmitButton, SuccessMark } from "./form";

const initialValues: Record<EnrollField, string> = {
  studentName: "",
  parentName: "",
  email: "",
  phone: "",
  school: "",
  grade: "",
  terms: "",
};

const GRADES = ["6", "7", "8", "9", "10", "11", "12"];

const card = "rounded-3xl bg-white p-6 shadow-[0_30px_70px_-30px_rgba(29,23,41,0.3)] ring-1 ring-ink/5 sm:p-10";

// `program` rides along as a hidden field when the form is opened from a program page.
// `bare` drops the card chrome, for when the form sits inside a popup.
export default function EnrollForm({ program, bare = false }: { program?: string; bare?: boolean }) {
  const [state, formAction, pending] = useActionState<EnrollState, FormData>(enroll, {
    status: "idle",
  });
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Partial<Record<EnrollField, boolean>>>({});
  const [clientErrors, setClientErrors] = useState<EnrollErrors>({});
  // The same form can be on the page and in a popup at once, so ids must be unique
  const uid = useId();
  const id = (f: EnrollField) => `${uid}-${f}`;

  const serverErrors = state.status === "error" ? state.errors : {};
  const errorFor = (f: EnrollField) => (touched[f] ? clientErrors[f] : undefined) ?? serverErrors[f];
  const a11y = (f: EnrollField) => ({
    id: id(f),
    name: f,
    "aria-invalid": !!errorFor(f),
    "aria-describedby": `${id(f)}-error`,
  });

  function update(field: EnrollField, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (touched[field]) setClientErrors((e) => ({ ...e, [field]: validateField(field, value) }));
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const field = e.target.name as EnrollField;
    const value =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
          ? "on"
          : ""
        : e.target.value;
    update(field, value);
    if (field === "terms" || field === "grade") blur(field, value);
  }

  function blur(field: EnrollField, value = values[field]) {
    setTouched((t) => ({ ...t, [field]: true }));
    setClientErrors((e) => ({ ...e, [field]: validateField(field, value) }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const errors = validateAll(values);
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setTouched(Object.fromEntries(ENROLL_FIELDS.map((f) => [f, true])));
      setClientErrors(errors);
      const first = ENROLL_FIELDS.find((f) => errors[f]);
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }

  if (state.status === "success") {
    return (
      <div className={`rise ${bare ? "" : card}`}>
        <SuccessMark />
        <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">
          You&apos;re in, {state.studentName.split(" ")[0]}.
        </h3>
        <p className="mt-3 text-muted">
          We&apos;ve reserved a seat{state.program ? ` in ${state.program}` : ""}. A confirmation will be sent to{" "}
          <span className="font-medium text-ink">{state.email}</span> once payment is complete.
        </p>
        <p className="mt-4 text-sm text-muted">
          Reference: <span className="font-mono text-ink">{state.orderId}</span>
        </p>
        {state.paymentUrl ? (
          <a
            href={state.paymentUrl}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent-gradient px-6 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgba(124,58,237,0.7)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Continue to secure payment
            <span aria-hidden>→</span>
          </a>
        ) : (
          <p className="mt-8 rounded-xl bg-sand px-4 py-3 text-sm text-muted">
            Payment link not configured. Set <code className="font-mono">PAYMENT_URL</code> to your hosted
            checkout page.
          </p>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className={bare ? "" : card}>
      {program && <input type="hidden" name="program" value={program} />}
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <Field label="Student name" id={id("studentName")} error={errorFor("studentName")}>
          <input
            {...a11y("studentName")}
            autoComplete="name"
            placeholder="Aarav Krishnan"
            value={values.studentName}
            onChange={onChange}
            onBlur={() => blur("studentName")}
            className={`${inputBase} ${inputBorder(errorFor("studentName"))}`}
          />
        </Field>
        <Field label="Parent name" id={id("parentName")} error={errorFor("parentName")}>
          <input
            {...a11y("parentName")}
            placeholder="Lakshmi Krishnan"
            value={values.parentName}
            onChange={onChange}
            onBlur={() => blur("parentName")}
            className={`${inputBase} ${inputBorder(errorFor("parentName"))}`}
          />
        </Field>
        <Field label="Email" id={id("email")} error={errorFor("email")}>
          <input
            {...a11y("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="parent@email.com"
            value={values.email}
            onChange={onChange}
            onBlur={() => blur("email")}
            className={`${inputBase} ${inputBorder(errorFor("email"))}`}
          />
        </Field>
        <Field label="Phone" id={id("phone")} error={errorFor("phone")}>
          <input
            {...a11y("phone")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91 98765 43210"
            value={values.phone}
            onChange={onChange}
            onBlur={() => blur("phone")}
            className={`${inputBase} ${inputBorder(errorFor("phone"))}`}
          />
        </Field>
        <Field label="School" id={id("school")} error={errorFor("school")}>
          <input
            {...a11y("school")}
            autoComplete="organization"
            placeholder="Your school's name"
            value={values.school}
            onChange={onChange}
            onBlur={() => blur("school")}
            className={`${inputBase} ${inputBorder(errorFor("school"))}`}
          />
        </Field>
        <Field label="Class" id={id("grade")} error={errorFor("grade")}>
          <select
            {...a11y("grade")}
            value={values.grade}
            onChange={onChange}
            onBlur={() => blur("grade")}
            className={`${inputBase} appearance-none pr-12 ${values.grade ? "" : "text-muted/50!"} ${inputBorder(errorFor("grade"))}`}
          >
            <option value="" disabled>
              Select class
            </option>
            {GRADES.map((g) => (
              <option key={g} value={g} className="text-ink">
                Class {g}
              </option>
            ))}
          </select>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute right-4 bottom-4 h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Field>
      </div>

      <div className="mt-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            name="terms"
            checked={values.terms === "on"}
            onChange={onChange}
            aria-invalid={!!errorFor("terms")}
            aria-describedby={`${id("terms")}-error`}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-accent"
          />
          <span>
            I agree to the{" "}
            <a href="#" className="font-medium text-ink underline decoration-accent/40 underline-offset-4 hover:text-accent hover:decoration-accent">
              program terms
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-ink underline decoration-accent/40 underline-offset-4 hover:text-accent hover:decoration-accent">
              privacy policy
            </a>
            , and confirm I am the student&apos;s parent or guardian.
          </span>
        </label>
        <ErrorText id={`${id("terms")}-error`} message={errorFor("terms")} />
      </div>

      {state.status === "error" && state.formError && (
        <p role="alert" className="mt-6 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.formError}
        </p>
      )}
      <SubmitButton pending={pending} label="Enroll and pay" pendingLabel="Reserving your seat…" />
      <p className="mt-4 text-center text-xs text-muted">
        You&apos;ll be taken to our secure payment partner to complete checkout.
      </p>
    </form>
  );
}

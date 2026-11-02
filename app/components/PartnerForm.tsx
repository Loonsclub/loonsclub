"use client";

import { useActionState, useId, useState, type ChangeEvent, type FormEvent } from "react";
import { partner, type PartnerState } from "../actions";
import {
  PARTNER_FIELDS,
  PARTNER_INTERESTS,
  validatePartner,
  validatePartnerField,
  type PartnerErrors,
  type PartnerField,
} from "../lib/partner";
import { Field, inputBase, inputBorder, SubmitButton, SuccessMark } from "./form";

const initialValues: Record<PartnerField, string> = {
  schoolName: "",
  principalName: "",
  email: "",
  phone: "",
};

// Enquiry from a school that wants the programs on its campus
export default function PartnerForm() {
  const [state, formAction, pending] = useActionState<PartnerState, FormData>(partner, { status: "idle" });
  const [values, setValues] = useState(initialValues);
  const [interests, setInterests] = useState<string[]>([]);
  const [touched, setTouched] = useState<Partial<Record<PartnerField, boolean>>>({});
  const [clientErrors, setClientErrors] = useState<PartnerErrors>({});
  const uid = useId();
  const id = (f: PartnerField) => `${uid}-${f}`;

  const serverErrors = state.status === "error" ? state.errors : {};
  const errorFor = (f: PartnerField) => (touched[f] ? clientErrors[f] : undefined) ?? serverErrors[f];

  function input(field: PartnerField) {
    return {
      id: id(field),
      name: field,
      value: values[field],
      "aria-invalid": !!errorFor(field),
      "aria-describedby": `${id(field)}-error`,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValues((v) => ({ ...v, [field]: value }));
        if (touched[field]) setClientErrors((er) => ({ ...er, [field]: validatePartnerField(field, value) }));
      },
      onBlur: () => {
        setTouched((t) => ({ ...t, [field]: true }));
        setClientErrors((er) => ({ ...er, [field]: validatePartnerField(field, values[field]) }));
      },
      className: `${inputBase} ${inputBorder(errorFor(field))}`,
    };
  }

  function toggle(interest: string) {
    setInterests((list) => (list.includes(interest) ? list.filter((i) => i !== interest) : [...list, interest]));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const errors = validatePartner(values);
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setTouched(Object.fromEntries(PARTNER_FIELDS.map((f) => [f, true])));
      setClientErrors(errors);
      const first = PARTNER_FIELDS.find((f) => errors[f]);
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }

  if (state.status === "success") {
    const picked = state.interests.filter((i) => i !== "Not sure yet");
    return (
      <div className="rise">
        <SuccessMark />
        <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">Thank you, {state.principalName.split(" ")[0]}.</h3>
        <p className="mt-3 leading-relaxed text-muted">
          We&apos;ve got your enquiry for <span className="font-medium text-ink">{state.schoolName}</span>
          {picked.length > 0 && <> about {picked.join(" and ")}</>}
          . Someone from our team will reach out at <span className="font-medium text-ink">{state.email}</span> within two
          working days to plan a visit.
        </p>
        <ol className="mt-8 space-y-3 rounded-2xl bg-sand p-5 text-sm">
          {["We call to understand your school and students", "We visit and plan around your calendar", "Founders arrive on campus"].map(
            (s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white font-display text-[0.7rem] font-bold text-accent ring-1 ring-accent/20">
                  {i + 1}
                </span>
                <span className="text-ink/80">{s}</span>
              </li>
            ),
          )}
        </ol>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate>
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="School name" id={id("schoolName")} error={errorFor("schoolName")}>
            <input {...input("schoolName")} autoComplete="organization" placeholder="e.g. Vidya Mandir Senior Secondary School" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Principal name" id={id("principalName")} error={errorFor("principalName")}>
            <input {...input("principalName")} autoComplete="name" placeholder="Dr. Meena Raghavan" />
          </Field>
        </div>
        <Field label="Email" id={id("email")} error={errorFor("email")}>
          <input {...input("email")} type="email" autoComplete="email" inputMode="email" placeholder="principal@school.edu.in" />
        </Field>
        <Field label="Phone" id={id("phone")} error={errorFor("phone")}>
          <input {...input("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" />
        </Field>
      </div>

      {/* only worth asking when there's a choice: the active programs plus "Not sure yet" */}
      {PARTNER_INTERESTS.length > 2 && (
        <fieldset className="mt-2">
          <legend className="flex w-full items-baseline justify-between gap-3 text-sm font-medium text-ink">
            Interested in
            <span className="text-xs font-normal text-muted">Optional</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PARTNER_INTERESTS.map((interest) => {
              const on = interests.includes(interest);
              return (
                <label
                  key={interest}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition has-focus-visible:ring-4 has-focus-visible:ring-accent/25 ${
                    on ? "bg-accent-gradient text-white ring-transparent shadow-[0_8px_20px_-10px_rgba(124,58,237,0.8)]" : "bg-white text-ink/70 ring-ink/15 hover:text-ink hover:ring-ink/40"
                  }`}
                >
                  <input type="checkbox" name="interest" value={interest} checked={on} onChange={() => toggle(interest)} className="sr-only" />
                  <span
                    aria-hidden
                    className={`flex h-4 w-4 items-center justify-center rounded-full transition ${on ? "bg-white text-accent" : "ring-1 ring-ink/25"}`}
                  >
                    {on && (
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5">
                        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {interest}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {state.status === "error" && state.formError && (
        <p role="alert" className="mt-6 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.formError}
        </p>
      )}
      <SubmitButton pending={pending} label="Send enquiry" pendingLabel="Sending…" />
      <p className="mt-4 text-center text-xs text-muted">
        No commitment. Prefer email? Write to{" "}
        <a href="mailto:info@loonsclub.com?subject=School%20partnership" className="font-medium text-ink underline decoration-accent/40 underline-offset-4 hover:text-accent">
          info@loonsclub.com
        </a>
      </p>
    </form>
  );
}

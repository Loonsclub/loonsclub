"use server";

import { hasDatabase, saveEnrollment, savePartnerEnquiry } from "./lib/db";
import { ENROLL_FIELDS, validateAll, type EnrollErrors, type EnrollField } from "./lib/enroll";
import {
  PARTNER_FIELDS,
  PARTNER_INTERESTS,
  validatePartner,
  type PartnerErrors,
  type PartnerField,
} from "./lib/partner";

export type EnrollState =
  | { status: "idle" }
  | { status: "error"; errors: EnrollErrors; formError?: string }
  | {
      status: "success";
      orderId: string;
      studentName: string;
      email: string;
      program: string | null;
    };

export async function enroll(_prev: EnrollState, formData: FormData): Promise<EnrollState> {
  const data = Object.fromEntries(
    ENROLL_FIELDS.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Record<EnrollField, string>;

  const errors = validateAll(data);
  if (Object.keys(errors).length > 0) return { status: "error", errors };

  // Set when the form was opened from a program page
  const program = String(formData.get("program") ?? "").trim() || null;

  const orderId = `LC-${Date.now().toString(36).toUpperCase()}`;

  // TODO: confirmation email.
  const saved = await persist(() =>
    saveEnrollment({
      orderId,
      studentName: data.studentName.trim(),
      parentName: data.parentName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      school: data.school.trim(),
      grade: data.grade,
      program,
    }),
  );
  if (!saved) return { status: "error", errors: {}, formError: SAVE_FAILED };

  return {
    status: "success",
    orderId,
    studentName: data.studentName.trim(),
    email: data.email.trim(),
    program,
  };
}

export type PartnerState =
  | { status: "idle" }
  | { status: "error"; errors: PartnerErrors; formError?: string }
  | { status: "success"; schoolName: string; principalName: string; email: string; interests: string[] };

export async function partner(_prev: PartnerState, formData: FormData): Promise<PartnerState> {
  const data = Object.fromEntries(
    PARTNER_FIELDS.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Record<PartnerField, string>;

  const errors = validatePartner(data);
  if (Object.keys(errors).length > 0) return { status: "error", errors };

  // Only keep interests we offer
  const interests = formData
    .getAll("interest")
    .map(String)
    .filter((i) => (PARTNER_INTERESTS as readonly string[]).includes(i));

  // TODO: notify the team (email to info@loonsclub.com).
  const saved = await persist(() =>
    savePartnerEnquiry({
      schoolName: data.schoolName.trim(),
      principalName: data.principalName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      interests,
    }),
  );
  if (!saved) return { status: "error", errors: {}, formError: SAVE_FAILED };

  return {
    status: "success",
    schoolName: data.schoolName.trim(),
    principalName: data.principalName.trim(),
    email: data.email.trim(),
    interests,
  };
}

const SAVE_FAILED = "We couldn't save your details just now. Please try again in a moment.";

// Without a database (e.g. local dev before `vercel env pull`) submissions are logged instead of saved.
async function persist(save: () => Promise<void>): Promise<boolean> {
  if (!hasDatabase()) {
    console.warn("DATABASE_URL is not set; submission was not saved.");
    return true;
  }
  try {
    await save();
    return true;
  } catch (err) {
    console.error("Failed to save submission", err);
    return false;
  }
}

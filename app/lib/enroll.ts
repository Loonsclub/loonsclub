// Shared by the client (inline validation) and the server action.

export const ENROLL_FIELDS = [
  "studentName",
  "parentName",
  "email",
  "phone",
  "school",
  "grade",
] as const;

export type EnrollField = (typeof ENROLL_FIELDS)[number];
export type EnrollErrors = Partial<Record<EnrollField, string>>;

export function validateField(field: EnrollField, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case "studentName":
      return v.length < 2 ? "Enter the student's full name." : undefined;
    case "parentName":
      return v.length < 2 ? "Enter a parent or guardian's name." : undefined;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : "Enter a valid email address.";
    case "phone":
      return v.replace(/\D/g, "").length < 10 ? "Enter a phone number with at least 10 digits." : undefined;
    case "school":
      return v.length < 2 ? "Enter the student's school." : undefined;
    case "grade":
      return v ? undefined : "Choose a grade.";
  }
}

export function validateAll(data: Record<EnrollField, string>): EnrollErrors {
  const errors: EnrollErrors = {};
  for (const f of ENROLL_FIELDS) {
    const msg = validateField(f, data[f]);
    if (msg) errors[f] = msg;
  }
  return errors;
}

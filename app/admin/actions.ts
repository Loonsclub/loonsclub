"use server";

import { refresh } from "next/cache";
import { deleteEnrollment, setEnrollmentConverted } from "../lib/db";
import { requireAdmin } from "./require-admin";

export async function setConverted(id: number, converted: boolean) {
  await requireAdmin();
  await setEnrollmentConverted(id, converted);
  refresh();
}

export async function removeEnrollment(id: number) {
  await requireAdmin();
  await deleteEnrollment(id);
  refresh();
}

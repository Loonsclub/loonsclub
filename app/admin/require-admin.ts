import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySessionToken } from "../lib/admin-session";

// Checked again at data access, not only in proxy.ts
export async function requireAdmin() {
  if (!(await verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value))) redirect("/admin/login");
}

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "../lib/admin-session";
import { adminHref } from "./paths";

// Checked again at data access, not only in proxy.ts
export async function requireAdmin() {
  // With partialPrefetching, cookies() resolves while prerendering the shell, so it no longer makes this
  // request-time. The session check reads the clock and the dashboard is live data, so opt out explicitly.
  await connection();
  if (!(await verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value))) redirect(await adminHref("/admin/login"));
}

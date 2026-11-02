import "server-only";
import { headers } from "next/headers";
import { adminUrl } from "../lib/admin-host";

// adminHref("/admin/login") → "/login" on admin.loonsclub.com, unchanged elsewhere (e.g. localhost)
export async function adminHref(path: string) {
  return adminUrl((await headers()).get("host") ?? "", path);
}

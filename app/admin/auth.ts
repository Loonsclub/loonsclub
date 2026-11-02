"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, createSessionToken, safeEqual, SESSION_TTL_SECONDS } from "../lib/admin-session";
import { adminHref } from "./paths";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !process.env.ADMIN_SESSION_SECRET) {
    return { error: "Admin login isn't configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET." };
  }

  if (!safeEqual(String(formData.get("password") ?? ""), expected)) {
    // Slow down guessing
    await new Promise((r) => setTimeout(r, 800));
    return { error: "That password isn't right." };
  }

  (await cookies()).set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect(await adminHref("/admin"));
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect(await adminHref("/admin/login"));
}

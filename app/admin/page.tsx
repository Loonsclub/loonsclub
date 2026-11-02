import { Suspense } from "react";
import { countRecentEnrollments, hasDatabase, listEnrollments, listPartnerEnquiries } from "../lib/db";
import { logout } from "./auth";
import Dashboard from "./Dashboard";
import { adminHref } from "./paths";
import { requireAdmin } from "./require-admin";

export default function AdminPage() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-ink/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <p className="font-logo text-xl font-bold tracking-tight">
            loonsclub <span className="text-accent">admin</span>
          </p>
          <form action={logout}>
            <button className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-sand hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardData />
        </Suspense>
      </main>
    </>
  );
}

async function DashboardData() {
  await requireAdmin();
  if (!hasDatabase()) {
    return (
      <div className="rounded-2xl bg-white p-8 ring-1 ring-ink/5">
        <h1 className="font-display text-xl font-semibold">Connect a database</h1>
        <p className="mt-2 text-muted">
          <code className="font-mono text-ink">DATABASE_URL</code> isn&apos;t set, so registrations aren&apos;t being saved yet.
          Add your Supabase or Neon pooled connection string as <code className="font-mono text-ink">DATABASE_URL</code>, then
          run <code className="font-mono text-ink">npm run db:setup</code>.
        </p>
      </div>
    );
  }
  const [enrollments, partners, newThisWeek, exportHref] = await Promise.all([
    listEnrollments(),
    listPartnerEnquiries(),
    countRecentEnrollments(7),
    adminHref("/admin/export"),
  ]);
  return <Dashboard enrollments={enrollments} partners={partners} newThisWeek={newThisWeek} exportHref={exportHref} />;
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-white ring-1 ring-ink/5" />
        ))}
      </div>
      <div className="mt-8 h-96 rounded-2xl bg-white ring-1 ring-ink/5" />
    </div>
  );
}

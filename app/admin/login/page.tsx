import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <p className="text-center font-logo text-2xl font-bold tracking-tight">
          loonsclub <span className="text-accent">admin</span>
        </p>
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-[0_30px_70px_-30px_rgba(29,23,41,0.3)] ring-1 ring-ink/5">
          <h1 className="font-display text-xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted">Registrations and school enquiries.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

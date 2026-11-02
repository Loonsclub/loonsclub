"use client";

import { startTransition, useEffect, useMemo, useOptimistic, useState, type MouseEvent, type ReactNode } from "react";
import type { Enrollment, PartnerEnquiry } from "../lib/db";
import { removeEnrollment, setConverted } from "./actions";

type Tab = "students" | "schools";
type Status = "all" | "hold" | "converted";
type Selected = { kind: "student"; row: Enrollment } | { kind: "school"; row: PartnerEnquiry } | null;
type EnrollmentChange = { type: "convert"; id: number; converted: boolean } | { type: "delete"; id: number };

// What the admin can do to an enrollment, passed down to the list and the drawer
type EnrollmentActions = { onConvert: (e: Enrollment) => void; onDelete: (e: Enrollment) => void };

// Fixed zone so server and client render the same text
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
const dateTimeFmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default function Dashboard({
  enrollments: saved,
  partners,
  newThisWeek,
  exportHref,
}: {
  enrollments: Enrollment[];
  partners: PartnerEnquiry[];
  newThisWeek: number;
  exportHref: string;
}) {
  const [tab, setTab] = useState<Tab>("students");
  const [status, setStatus] = useState<Status>("all");
  const [query, setQuery] = useState("");
  const [program, setProgram] = useState("");
  const [grade, setGrade] = useState("");
  const [selected, setSelected] = useState<Selected>(null);

  // Show converts and deletes straight away; the server's refresh then replaces `saved`
  const [enrollments, applyChange] = useOptimistic(saved, (rows: Enrollment[], change: EnrollmentChange) =>
    change.type === "delete"
      ? rows.filter((e) => e.id !== change.id)
      : rows.map((e) =>
          e.id === change.id ? { ...e, convertedAt: change.converted ? new Date().toISOString() : null } : e,
        ),
  );

  const actions: EnrollmentActions = {
    onConvert: (e) =>
      startTransition(async () => {
        applyChange({ type: "convert", id: e.id, converted: !e.convertedAt });
        await setConverted(e.id, !e.convertedAt);
      }),
    onDelete: (e) =>
      startTransition(async () => {
        applyChange({ type: "delete", id: e.id });
        await removeEnrollment(e.id);
      }),
  };

  // The drawer reads the latest copy so it reflects converts, and closes if the entry is deleted
  const current: Selected =
    selected?.kind === "student"
      ? (() => {
          const row = enrollments.find((e) => e.id === selected.row.id);
          return row ? { kind: "student", row } : null;
        })()
      : selected;

  const programs = useMemo(() => uniqueSorted(enrollments.map((e) => e.program ?? "General")), [enrollments]);
  const grades = useMemo(() => uniqueSorted(enrollments.map((e) => e.grade)), [enrollments]);
  const convertedCount = enrollments.filter((e) => e.convertedAt).length;

  const q = query.trim().toLowerCase();
  const students = enrollments.filter(
    (e) =>
      (status === "all" || (status === "converted") === !!e.convertedAt) &&
      (!program || (e.program ?? "General") === program) &&
      (!grade || e.grade === grade) &&
      matches(q, [e.studentName, e.parentName, e.email, e.phone, e.school, e.orderId]),
  );
  const schools = partners.filter((p) => matches(q, [p.schoolName, p.principalName, p.email, p.phone, ...p.interests]));

  const topProgram = mostCommon(enrollments.map((e) => e.program ?? "General"));

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-muted">Everyone who has signed up through loonsclub.com.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Enrolled" value={enrollments.length} />
        <Stat label="New in the last 7 days" value={newThisWeek} />
        <Stat label="School enquiries" value={partners.length} />
        <Stat label="Most popular program" value={topProgram ?? "–"} small />
      </div>

      <section className="mt-8 rounded-2xl bg-white ring-1 ring-ink/5">
        <div className="flex flex-col gap-4 border-b border-ink/5 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" className="inline-flex self-start rounded-full bg-sand p-1">
            <TabButton active={tab === "students"} onClick={() => setTab("students")} count={enrollments.length}>
              Enrolled
            </TabButton>
            <TabButton active={tab === "schools"} onClick={() => setTab("schools")} count={partners.length}>
              Schools
            </TabButton>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tab === "students" ? "Search name, email, school…" : "Search school, principal, email…"}
              aria-label="Search"
              className="w-full rounded-full border border-ink/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15 sm:w-64"
            />
            {tab === "students" && (
              <>
                <div role="group" aria-label="Status" className="inline-flex self-start rounded-full bg-sand p-1">
                  <TabButton active={status === "all"} onClick={() => setStatus("all")} count={enrollments.length} role="radio">
                    All
                  </TabButton>
                  <TabButton
                    active={status === "hold"}
                    onClick={() => setStatus("hold")}
                    count={enrollments.length - convertedCount}
                    role="radio"
                  >
                    On hold
                  </TabButton>
                  <TabButton active={status === "converted"} onClick={() => setStatus("converted")} count={convertedCount} role="radio">
                    Converted
                  </TabButton>
                </div>
                <Select label="Program" value={program} onChange={setProgram} options={programs} />
                <Select label="Grade" value={grade} onChange={setGrade} options={grades} format={(g) => `Grade ${g}`} />
              </>
            )}
            <a
              href={`${exportHref}?type=${tab}`}
              className="rounded-full bg-ink px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-ink-soft"
            >
              Export CSV
            </a>
          </div>
        </div>

        {tab === "students" ? (
          <StudentsList
            rows={students}
            total={enrollments.length}
            onSelect={(row) => setSelected({ kind: "student", row })}
            actions={actions}
          />
        ) : (
          <SchoolsList rows={schools} total={partners.length} onSelect={(row) => setSelected({ kind: "school", row })} />
        )}
      </section>

      <Drawer selected={current} onClose={() => setSelected(null)} actions={actions} />
    </div>
  );
}

function StudentsList({
  rows,
  total,
  onSelect,
  actions,
}: {
  rows: Enrollment[];
  total: number;
  onSelect: (e: Enrollment) => void;
  actions: EnrollmentActions;
}) {
  if (rows.length === 0) return <Empty total={total} noun="students" />;
  return (
    <>
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="w-12 py-3 pl-5">
              <span className="sr-only">Status</span>
            </th>
            <Th>Student</Th>
            <Th>Parent</Th>
            <Th>School</Th>
            <Th>Grade</Th>
            <Th>Program</Th>
            <Th>Registered</Th>
            <th className="px-5 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <Row key={e.id} onClick={() => onSelect(e)} converted={!!e.convertedAt}>
              <td className="py-3 pl-5">
                <StatusMark converted={!!e.convertedAt} />
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={e.studentName} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{e.studentName}</p>
                    <p className="truncate text-muted">{e.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3">
                <p>{e.parentName}</p>
                <p className="text-muted">{e.phone}</p>
              </td>
              <td className="px-5 py-3">{e.school}</td>
              <td className="px-5 py-3">{e.grade}</td>
              <td className="px-5 py-3">
                <ProgramBadge program={e.program} />
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-muted">{dateFmt.format(new Date(e.createdAt))}</td>
              <td className="px-5 py-3">
                <EnrollmentButtons row={e} actions={actions} />
              </td>
            </Row>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-ink/5 md:hidden">
        {rows.map((e) => (
          <li key={e.id} className={e.convertedAt ? "bg-emerald-50" : undefined}>
            <button onClick={() => onSelect(e)} className="flex w-full items-center gap-3 p-4 pb-2 text-left hover:bg-sand/60">
              <StatusMark converted={!!e.convertedAt} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{e.studentName}</p>
                <p className="truncate text-sm text-muted">
                  Grade {e.grade} · {e.school}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted">{dateFmt.format(new Date(e.createdAt))}</span>
            </button>
            <div className="px-4 pb-4 pl-[3.25rem]">
              <EnrollmentButtons row={e} actions={actions} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function SchoolsList({ rows, total, onSelect }: { rows: PartnerEnquiry[]; total: number; onSelect: (p: PartnerEnquiry) => void }) {
  if (rows.length === 0) return <Empty total={total} noun="school enquiries" />;
  return (
    <>
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="text-xs uppercase tracking-wide text-muted">
          <tr>
            <Th>School</Th>
            <Th>Principal</Th>
            <Th>Contact</Th>
            <Th>Interested in</Th>
            <Th>Received</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <Row key={p.id} onClick={() => onSelect(p)}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={p.schoolName} />
                  <p className="font-medium">{p.schoolName}</p>
                </div>
              </td>
              <td className="px-5 py-3">{p.principalName}</td>
              <td className="px-5 py-3">
                <p>{p.email}</p>
                <p className="text-muted">{p.phone}</p>
              </td>
              <td className="px-5 py-3">
                <div className="flex flex-wrap gap-1">
                  {p.interests.length ? p.interests.map((i) => <ProgramBadge key={i} program={i} />) : <span className="text-muted">—</span>}
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-muted">{dateFmt.format(new Date(p.createdAt))}</td>
            </Row>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-ink/5 md:hidden">
        {rows.map((p) => (
          <li key={p.id}>
            <button onClick={() => onSelect(p)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-sand/60">
              <Avatar name={p.schoolName} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.schoolName}</p>
                <p className="truncate text-sm text-muted">{p.principalName}</p>
              </div>
              <span className="shrink-0 text-xs text-muted">{dateFmt.format(new Date(p.createdAt))}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function Drawer({ selected, onClose, actions }: { selected: Selected; onClose: () => void; actions: EnrollmentActions }) {
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, onClose]);

  if (!selected) return null;

  const title = selected.kind === "student" ? selected.row.studentName : selected.row.schoolName;
  const { email, phone, createdAt } = selected.row;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-ink/5 p-6">
          <div className="flex items-center gap-3">
            <Avatar name={title} large />
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
              <p className="text-sm text-muted">
                {selected.kind === "student" ? "Student registration" : "School partnership enquiry"}
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted hover:bg-sand hover:text-ink">
            ✕
          </button>
        </div>

        <div className="flex gap-2 p-6 pb-0">
          <ActionLink href={`mailto:${email}`}>Email</ActionLink>
          <ActionLink href={`tel:${phone.replace(/[^\d+]/g, "")}`}>Call</ActionLink>
          <ActionLink href={`https://wa.me/${whatsappNumber(phone)}`}>WhatsApp</ActionLink>
        </div>

        {selected.kind === "student" && (
          <div className="px-6 pt-4">
            <EnrollmentButtons row={selected.row} actions={actions} />
          </div>
        )}

        <dl className="divide-y divide-ink/5 p-6">
          {selected.kind === "student" ? (
            <>
              <Detail label="Status">
                {selected.row.convertedAt ? `Converted on ${dateFmt.format(new Date(selected.row.convertedAt))}` : "On hold"}
              </Detail>
              <Detail label="Parent / guardian">{selected.row.parentName}</Detail>
              <Detail label="Email">{email}</Detail>
              <Detail label="Phone">{phone}</Detail>
              <Detail label="School">{selected.row.school}</Detail>
              <Detail label="Grade">{selected.row.grade}</Detail>
              <Detail label="Program">
                <ProgramBadge program={selected.row.program} />
              </Detail>
              <Detail label="Reference">
                <span className="font-mono">{selected.row.orderId}</span>
              </Detail>
            </>
          ) : (
            <>
              <Detail label="Principal">{selected.row.principalName}</Detail>
              <Detail label="Email">{email}</Detail>
              <Detail label="Phone">{phone}</Detail>
              <Detail label="Interested in">
                {selected.row.interests.length ? selected.row.interests.join(", ") : "Not specified"}
              </Detail>
            </>
          )}
          <Detail label={selected.kind === "student" ? "Registered" : "Received"}>
            {dateTimeFmt.format(new Date(createdAt))}
          </Detail>
        </dl>
      </aside>
    </div>
  );
}

function Stat({ label, value, small = false }: { label: string; value: ReactNode; small?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-ink/5">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-2 font-display font-semibold tracking-tight ${small ? "truncate text-xl" : "text-4xl"}`}>{value}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  count,
  role = "tab",
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  role?: "tab" | "radio";
  children: ReactNode;
}) {
  return (
    <button
      role={role}
      aria-selected={role === "tab" ? active : undefined}
      aria-checked={role === "radio" ? active : undefined}
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${active ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`}
    >
      {children} <span className="ml-1 text-muted">{count}</span>
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  format = (o) => o,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  format?: (o: string) => string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
    >
      <option value="">All {label.toLowerCase()}s</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {format(o)}
        </option>
      ))}
    </select>
  );
}

function Th({ children }: { children: ReactNode }) {
  return <th className="px-5 py-3 font-medium">{children}</th>;
}

function Row({ onClick, converted = false, children }: { onClick: () => void; converted?: boolean; children: ReactNode }) {
  return (
    <tr
      tabIndex={0}
      onClick={onClick}
      // Only the row itself; keys pressed on its buttons shouldn't open the drawer
      onKeyDown={(e) => e.target === e.currentTarget && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick())}
      className={`cursor-pointer border-t border-ink/5 outline-none transition ${
        converted ? "bg-emerald-50 hover:bg-emerald-100/70 focus-visible:bg-emerald-100" : "hover:bg-sand/60 focus-visible:bg-sand"
      }`}
    >
      {children}
    </tr>
  );
}

function StatusMark({ converted }: { converted: boolean }) {
  return converted ? (
    <span
      title="Converted"
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white"
    >
      ✓<span className="sr-only">Converted</span>
    </span>
  ) : (
    <span title="On hold" className="block h-6 w-6 shrink-0 rounded-full border-2 border-dashed border-ink/15">
      <span className="sr-only">On hold</span>
    </span>
  );
}

// Converted toggles (click again to put it back on hold); Delete asks once more before removing
function EnrollmentButtons({ row, actions }: { row: Enrollment; actions: EnrollmentActions }) {
  const [confirming, setConfirming] = useState(false);
  // Buttons sit inside clickable rows, so keep their clicks from opening the drawer
  const handle = (fn: () => void) => (e: MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handle(() => actions.onConvert(row))}
        aria-pressed={!!row.convertedAt}
        title={row.convertedAt ? "Click to move back to On hold" : undefined}
        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
          row.convertedAt
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "border border-emerald-500/40 text-emerald-700 hover:bg-emerald-50"
        }`}
      >
        {row.convertedAt ? "✓ Converted" : "Converted"}
      </button>
      {confirming ? (
        <>
          <button
            onClick={handle(() => actions.onDelete(row))}
            className="whitespace-nowrap rounded-full bg-danger px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110"
          >
            Confirm delete
          </button>
          <button
            onClick={handle(() => setConfirming(false))}
            className="rounded-full px-2 py-1.5 text-xs font-medium text-muted hover:text-ink"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={handle(() => setConfirming(true))}
          className="rounded-full border border-danger/30 px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger/10"
        >
          Delete
        </button>
      )}
    </div>
  );
}

function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent-gradient font-semibold text-white ${large ? "h-12 w-12 text-base" : "h-9 w-9 text-xs"}`}
    >
      {initials}
    </span>
  );
}

function ProgramBadge({ program }: { program: string | null }) {
  return (
    <span className="inline-block rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-ink-soft ring-1 ring-accent/15">
      {program ?? "General"}
    </span>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="break-words">{children}</dd>
    </div>
  );
}

function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="flex-1 rounded-full border border-ink/10 px-3 py-2 text-center text-sm font-medium transition hover:border-accent hover:text-accent"
    >
      {children}
    </a>
  );
}

function Empty({ total, noun }: { total: number; noun: string }) {
  return (
    <div className="p-12 text-center">
      <p className="font-medium">{total === 0 ? `No ${noun} yet` : "Nothing matches"}</p>
      <p className="mt-1 text-sm text-muted">
        {total === 0 ? "New sign-ups from the website will appear here." : "Try a different search or filter."}
      </p>
    </div>
  );
}

function matches(q: string, fields: (string | null)[]) {
  return !q || fields.some((f) => f?.toLowerCase().includes(q));
}

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function mostCommon(values: string[]) {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
}

// wa.me needs the full international number; assume India (+91) for bare 10-digit numbers
function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

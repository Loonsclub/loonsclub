import "server-only";
import postgres from "postgres";

// Any Postgres works: Supabase or Neon. Use the provider's *pooled* connection string
// (Supabase: transaction pooler, port 6543; Neon: the "-pooler" host). Tables live in db/schema.sql.
function databaseUrl() {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
}

// One client per server instance; kept on globalThis so dev hot reloads don't open new pools
const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

function client() {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL is not set");
  globalForDb.sql ??= postgres(url, {
    // Poolers in transaction mode (Supabase 6543, Neon -pooler) don't support prepared statements
    prepare: false,
    ssl: /@(localhost|127\.0\.0\.1)[:/]/.test(url) ? false : "require",
    max: 5,
  });
  return globalForDb.sql;
}

export type Enrollment = {
  id: number;
  orderId: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  program: string | null;
  createdAt: string;
};

export type PartnerEnquiry = {
  id: number;
  schoolName: string;
  principalName: string;
  email: string;
  phone: string;
  interests: string[];
  createdAt: string;
};

export function hasDatabase() {
  return !!databaseUrl();
}

export async function saveEnrollment(e: Omit<Enrollment, "id" | "createdAt">) {
  await client()`
    insert into enrollments (order_id, student_name, parent_name, email, phone, school, grade, program)
    values (${e.orderId}, ${e.studentName}, ${e.parentName}, ${e.email}, ${e.phone}, ${e.school}, ${e.grade}, ${e.program})
  `;
}

export async function savePartnerEnquiry(p: Omit<PartnerEnquiry, "id" | "createdAt">) {
  await client()`
    insert into partner_enquiries (school_name, principal_name, email, phone, interests)
    values (${p.schoolName}, ${p.principalName}, ${p.email}, ${p.phone}, ${p.interests}::text[])
  `;
}

export async function listEnrollments(): Promise<Enrollment[]> {
  const rows = await client()`
    select id, order_id, student_name, parent_name, email, phone, school, grade, program, created_at
    from enrollments order by created_at desc
  `;
  return rows.map((r) => ({
    id: Number(r.id),
    orderId: r.order_id,
    studentName: r.student_name,
    parentName: r.parent_name,
    email: r.email,
    phone: r.phone,
    school: r.school,
    grade: r.grade,
    program: r.program,
    createdAt: new Date(r.created_at).toISOString(),
  }));
}

export async function listPartnerEnquiries(): Promise<PartnerEnquiry[]> {
  const rows = await client()`
    select id, school_name, principal_name, email, phone, interests, created_at
    from partner_enquiries order by created_at desc
  `;
  return rows.map((r) => ({
    id: Number(r.id),
    schoolName: r.school_name,
    principalName: r.principal_name,
    email: r.email,
    phone: r.phone,
    interests: r.interests ?? [],
    createdAt: new Date(r.created_at).toISOString(),
  }));
}

export async function countRecentEnrollments(days: number): Promise<number> {
  const [row] = await client()`
    select count(*)::int as n from enrollments where created_at > now() - make_interval(days => ${days}::int)
  `;
  return row.n;
}

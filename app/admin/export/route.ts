import { cookies } from "next/headers";
import { hasDatabase, listEnrollments, listPartnerEnquiries } from "../../lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "../../lib/admin-session";

// GET /admin/export?type=students|schools → CSV download
export async function GET(request: Request) {
  if (!(await verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!hasDatabase()) return new Response("DATABASE_URL is not set", { status: 503 });

  const type = new URL(request.url).searchParams.get("type") === "schools" ? "schools" : "students";
  const rows: (string | null)[][] =
    type === "students"
      ? [
          ["Reference", "Student", "Parent", "Email", "Phone", "School", "Grade", "Program", "Registered at", "Status", "Converted at"],
          ...(await listEnrollments()).map((e) => [
            e.orderId, e.studentName, e.parentName, e.email, e.phone, e.school, e.grade, e.program, e.createdAt,
            e.convertedAt ? "Converted" : "On hold", e.convertedAt,
          ]),
        ]
      : [
          ["School", "Principal", "Email", "Phone", "Interests", "Received at"],
          ...(await listPartnerEnquiries()).map((p) => [
            p.schoolName, p.principalName, p.email, p.phone, p.interests.join("; "), p.createdAt,
          ]),
        ];

  const date = new Date().toISOString().slice(0, 10);
  return new Response(rows.map((r) => r.map(csvCell).join(",")).join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="loonsclub-${type}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

// Quote every cell; prefix formula-like values so spreadsheets don't execute them
function csvCell(value: string | null): string {
  let v = value ?? "";
  if (/^[=+\-@]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
}

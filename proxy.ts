import { NextResponse, type NextRequest } from "next/server";
import { adminUrl, isAdminHost } from "./app/lib/admin-host";
import { ADMIN_COOKIE, verifySessionToken } from "./app/lib/admin-session";

// The public site's hosts; /admin is hidden on these and only served from admin.loonsclub.com
const PUBLIC_HOSTS = new Set(["loonsclub.com", "www.loonsclub.com"]);

export async function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0];
  const { pathname } = request.nextUrl;

  if (PUBLIC_HOSTS.has(host) && isAdminPath(pathname)) {
    return new NextResponse("Not found", { status: 404 });
  }

  // On admin.<domain>, every path maps into /admin (admin.loonsclub.com/ → /admin)
  const adminHost = isAdminHost(host);
  // Keep one URL per page there: admin.loonsclub.com/admin/login → /login
  if (adminHost && isAdminPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = adminUrl(host, pathname);
    return NextResponse.redirect(url);
  }
  const path = adminHost ? `/admin${pathname === "/" ? "" : pathname}` : pathname;
  if (!isAdminPath(path)) return NextResponse.next();

  if (path !== "/admin/login" && !(await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.redirect(new URL(adminUrl(host, "/admin/login"), request.url));
  }

  if (path === pathname) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.rewrite(url);
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export const config = {
  // Skip Next internals and files with an extension (fonts, images, favicon)
  matcher: ["/((?!_next/static|_next/image|.*\\.[^/]+$).*)"],
};

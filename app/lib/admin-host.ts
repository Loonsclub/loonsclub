// admin.loonsclub.com serves the /admin routes at its root (admin.loonsclub.com/login → /admin/login)
export function isAdminHost(host: string) {
  return host.split(":")[0].startsWith("admin.");
}

// The URL a browser should use for an /admin route on this host
export function adminUrl(host: string, path: string) {
  if (!isAdminHost(host)) return path;
  return path.replace(/^\/admin(?=\/|$)/, "") || "/";
}

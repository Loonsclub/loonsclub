export function isAdminHost(host: string) {
  return host.split(":")[0].startsWith("admin.");
}

export function adminUrl(host: string, path: string) {
  if (!isAdminHost(host)) return path;
  return path.replace(/^\/admin(?=\/|$)/, "") || "/";
}

export function getTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [key, ...v] = cookie.trim().split("=");
      return [key, v.join("=")];
    }),
  );

  return cookies["auth-token"] || null;
}

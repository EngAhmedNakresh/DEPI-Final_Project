/**
 * Normalizes a GitHub username or profile URL to a plain username.
 * Handles: username, @username, github.com/username, full URLs with /users/ or /orgs/
 */
export function normalizeGithubUsername(input) {
  const raw = String(input || "").trim();
  if (!raw) return "";

  if (raw.toLowerCase().includes("github.com")) {
    try {
      const hasProtocol = /^https?:\/\//i.test(raw);
      const parsed = new URL(hasProtocol ? raw : `https://${raw}`);
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (!segments.length) return "";

      if ((segments[0] === "users" || segments[0] === "orgs") && segments[1]) {
        return segments[1].replace(/^@+/, "").trim();
      }

      return segments[0].replace(/^@+/, "").trim();
    } catch {
      const cleaned = raw
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .split("?")[0]
        .split("#")[0]
        .replace(/\/+$/, "");
      const parts = cleaned.split("/").filter(Boolean);
      return (parts[1] || parts[0] || "").replace(/^@+/, "").trim();
    }
  }

  return raw.replace(/^@+/, "").trim();
}

export const DEFAULT_AVATAR =
  "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";

export function buildGithubAvatar(username) {
  const safe = normalizeGithubUsername(username);
  if (!safe) return DEFAULT_AVATAR;
  return `https://github.com/${safe}.png?size=320`;
}

export function onImageFallback(event, fallbackSrc = DEFAULT_AVATAR) {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === "1") return;
  img.dataset.fallbackApplied = "1";
  img.src = fallbackSrc;
}

import { createServer } from "node:http";
import { Buffer } from "node:buffer";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key]) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFile(join(rootDir, ".env"));
loadEnvFile(join(rootDir, ".env.local"));

const dbPath = join(__dirname, "data", "db.json");
const distPath = join(rootDir, "dist");
const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || "0.0.0.0";
const JWT_SECRET = process.env.JWT_SECRET || "portfolio-genie-dev-secret";
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";
const PUBLIC_APP_URL =
  process.env.PUBLIC_APP_URL ||
  process.env.CLIENT_ORIGIN ||
  "http://localhost:5173";

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
};

const staticTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function hasGithubOAuthConfig() {
  return (
    GITHUB_CLIENT_ID &&
    GITHUB_CLIENT_SECRET &&
    !GITHUB_CLIENT_ID.startsWith("replace-with") &&
    !GITHUB_CLIENT_SECRET.startsWith("replace-with")
  );
}

async function ensureDb() {
  await mkdir(dirname(dbPath), { recursive: true });
  try {
    await readFile(dbPath, "utf8");
  } catch {
    await writeFile(dbPath, JSON.stringify({ users: [], portfolios: [], reviews: [] }, null, 2));
  }
}

async function readDb() {
  await ensureDb();
  const raw = await readFile(dbPath, "utf8");
  const db = JSON.parse(raw || '{"users":[],"portfolios":[],"reviews":[]}');
  return {
    users: Array.isArray(db.users) ? db.users : [],
    portfolios: Array.isArray(db.portfolios) ? db.portfolios : [],
    reviews: Array.isArray(db.reviews) ? db.reviews : [],
  };
}

async function writeDb(data) {
  await writeFile(dbPath, JSON.stringify(data, null, 2));
}

function send(res, status, payload) {
  res.writeHead(status, jsonHeaders);
  res.end(JSON.stringify(payload));
}

async function sendStatic(res, pathname) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = join(distPath, decodeURIComponent(safePath));

  if (!filePath.startsWith(distPath)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return true;
  }

  try {
    const data = await readFile(filePath);
    const contentType = staticTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
    return true;
  } catch {
    try {
      const indexHtml = await readFile(join(distPath, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(indexHtml);
      return true;
    } catch {
      return false;
    }
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function signToken(payload) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return null;

  const expected = createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(hash, "hex");
  return storedBuffer.length === derived.length && timingSafeEqual(storedBuffer, derived);
}

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    github: user.github,
    avatarUrl: user.avatarUrl,
    authProvider: user.authProvider || "password",
    createdAt: user.createdAt,
  };
}

function validateSignup({ fullName, email, github, password }) {
  if (!String(fullName || "").trim()) return "Full name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""))) {
    return "Valid email is required";
  }
  if (!String(github || "").trim()) return "GitHub username is required";
  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(password || ""))) {
    return "Password must be at least 8 characters and include letters and numbers";
  }
  return "";
}

function validateReview({ name, email, review }) {
  if (!String(name || "").trim()) return "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""))) {
    return "Valid email is required";
  }
  if (String(review || "").trim().length < 8) {
    return "Review must be at least 8 characters";
  }
  return "";
}

function publicReview(review) {
  return {
    id: review.id,
    name: review.name,
    email: review.email,
    review: review.review,
    createdAt: review.createdAt,
  };
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function buildFrontendUrl(path, params = {}) {
  const url = new URL(PUBLIC_APP_URL);
  const search = new URLSearchParams(params);
  url.hash = `${path}${search.toString() ? `?${search.toString()}` : ""}`;
  return url.toString();
}

function githubRedirectUri(req) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${protocol}://${host}/api/auth/github/callback`;
}

async function githubRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "User-Agent": "PortfolioGenie",
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error_description || data.message || "GitHub request failed");
  }
  return data;
}

async function getGithubPrimaryEmail(accessToken) {
  const emails = await githubRequest("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!Array.isArray(emails)) return "";
  const primary = emails.find((item) => item.primary && item.verified);
  const verified = emails.find((item) => item.verified);
  return (primary || verified || emails[0])?.email || "";
}

function issueAuthToken(user) {
  return signToken({
    sub: user.id,
    email: user.email,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  });
}

async function getAuthUser(req) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(token);
  if (!payload?.sub) return null;

  const db = await readDb();
  return db.users.find((user) => user.id === payload.sub) || null;
}

async function handleRequest(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, jsonHeaders);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      send(res, 200, { ok: true, service: "PortfolioGenie API" });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/reviews") {
      const db = await readDb();
      const reviews = db.reviews
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(publicReview);

      send(res, 200, { reviews });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/reviews") {
      const body = await readBody(req);
      const error = validateReview(body);
      if (error) {
        send(res, 400, { message: error });
        return;
      }

      const authUser = await getAuthUser(req);
      const db = await readDb();
      const review = {
        id: randomBytes(12).toString("hex"),
        userId: authUser?.id || null,
        name: String(body.name).trim(),
        email: String(body.email).trim().toLowerCase(),
        review: String(body.review).trim(),
        createdAt: new Date().toISOString(),
      };

      db.reviews.push(review);
      await writeDb(db);
      send(res, 201, { message: "Review saved successfully", review: publicReview(review) });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/auth/github") {
      if (!hasGithubOAuthConfig()) {
        redirect(
          res,
          buildFrontendUrl("/oauth/callback", {
            error: "GitHub login is not configured yet",
          })
        );
        return;
      }

      const state = randomBytes(16).toString("hex");
      const authUrl = new URL("https://github.com/login/oauth/authorize");
      authUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", githubRedirectUri(req));
      authUrl.searchParams.set("scope", "read:user user:email");
      authUrl.searchParams.set("state", state);

      redirect(res, authUrl.toString());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/auth/github/callback") {
      if (!hasGithubOAuthConfig()) {
        redirect(
          res,
          buildFrontendUrl("/oauth/callback", {
            error: "GitHub login is not configured yet",
          })
        );
        return;
      }

      const code = url.searchParams.get("code");
      if (!code) {
        redirect(
          res,
          buildFrontendUrl("/oauth/callback", {
            error: "GitHub did not return an authorization code",
          })
        );
        return;
      }

      const tokenData = await githubRequest("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: githubRedirectUri(req),
        }),
      });

      if (!tokenData.access_token) {
        throw new Error(tokenData.error_description || "GitHub access token was not returned");
      }

      const githubProfile = await githubRequest("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });
      const githubEmail =
        githubProfile.email || (await getGithubPrimaryEmail(tokenData.access_token));

      const db = await readDb();
      const githubId = String(githubProfile.id || "");
      const githubLogin = String(githubProfile.login || "").trim();
      const normalizedEmail = String(githubEmail || `${githubLogin}@users.noreply.github.com`)
        .trim()
        .toLowerCase();

      let user = db.users.find((item) => item.githubId === githubId);
      if (!user) {
        user = db.users.find((item) => item.email?.toLowerCase() === normalizedEmail);
      }

      if (user) {
        user.fullName = user.fullName || githubProfile.name || githubLogin;
        user.email = user.email || normalizedEmail;
        user.github = githubLogin || user.github;
        user.githubId = githubId || user.githubId;
        user.avatarUrl = githubProfile.avatar_url || user.avatarUrl;
        user.authProvider = user.authProvider || "github";
        user.updatedAt = new Date().toISOString();
      } else {
        user = {
          id: randomBytes(12).toString("hex"),
          fullName: githubProfile.name || githubLogin,
          email: normalizedEmail,
          github: githubLogin,
          githubId,
          avatarUrl: githubProfile.avatar_url || "",
          authProvider: "github",
          createdAt: new Date().toISOString(),
        };
        db.users.push(user);
      }

      await writeDb(db);

      const token = issueAuthToken(user);
      redirect(
        res,
        buildFrontendUrl("/oauth/callback", {
          token,
          user: JSON.stringify(publicUser(user)),
        })
      );
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/auth/signup") {
      const body = await readBody(req);
      const error = validateSignup(body);
      if (error) {
        send(res, 400, { message: error });
        return;
      }

      const db = await readDb();
      const email = body.email.trim().toLowerCase();
      const exists = db.users.some((user) => user.email.toLowerCase() === email);
      if (exists) {
        send(res, 409, { message: "Email already exists" });
        return;
      }

      const user = {
        id: randomBytes(12).toString("hex"),
        fullName: body.fullName.trim(),
        email,
        github: body.github.trim(),
        passwordHash: hashPassword(body.password),
        createdAt: new Date().toISOString(),
      };

      db.users.push(user);
      await writeDb(db);
      send(res, 201, { message: "Account created successfully", user: publicUser(user) });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const db = await readDb();
      const user = db.users.find((item) => item.email.toLowerCase() === email);

      if (!user || !verifyPassword(body.password, user.passwordHash)) {
        send(res, 401, { message: "Invalid email or password" });
        return;
      }

      const token = issueAuthToken(user);
      send(res, 200, { message: "Logged in successfully", token, user: publicUser(user) });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/auth/me") {
      const user = await getAuthUser(req);
      if (!user) {
        send(res, 401, { message: "Unauthorized" });
        return;
      }
      send(res, 200, { user: publicUser(user) });
      return;
    }

    if (req.method === "PUT" && url.pathname === "/api/portfolio") {
      const user = await getAuthUser(req);
      if (!user) {
        send(res, 401, { message: "Unauthorized" });
        return;
      }

      const body = await readBody(req);
      const db = await readDb();
      const nextPortfolio = {
        userId: user.id,
        selectedProjects: Array.isArray(body.selectedProjects) ? body.selectedProjects : [],
        about: String(body.about || ""),
        skills: Array.isArray(body.skills) ? body.skills : [],
        theme: String(body.theme || ""),
        updatedAt: new Date().toISOString(),
      };

      const index = db.portfolios.findIndex((item) => item.userId === user.id);
      if (index >= 0) db.portfolios[index] = nextPortfolio;
      else db.portfolios.push(nextPortfolio);

      await writeDb(db);
      send(res, 200, { message: "Portfolio saved", portfolio: nextPortfolio });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/portfolio") {
      const user = await getAuthUser(req);
      if (!user) {
        send(res, 401, { message: "Unauthorized" });
        return;
      }

      const db = await readDb();
      const portfolio = db.portfolios.find((item) => item.userId === user.id) || null;
      send(res, 200, { portfolio });
      return;
    }

    if (!url.pathname.startsWith("/api/") && req.method === "GET") {
      const served = await sendStatic(res, url.pathname);
      if (served) return;
    }

    send(res, 404, { message: "Route not found" });
  } catch (error) {
    send(res, 500, { message: error.message || "Server error" });
  }
}

createServer(handleRequest).listen(PORT, HOST, () => {
  console.log(`PortfolioGenie is running on http://${HOST}:${PORT}`);
});

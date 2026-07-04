// الرابط الأساسي للباك إند.
// في التطوير بيكون /api ويتحول عن طريق Vite proxy إلى localhost:5000.
// في النشر نفس السيرفر بيخدم الفرونت والباك، لذلك /api تفضل شغالة.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export function getApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

// قراءة التوكن المخزن بعد تسجيل الدخول.
export function getAuthToken() {
  return localStorage.getItem("auth_token") || "";
}

// حفظ بيانات جلسة المستخدم بعد تسجيل الدخول.
// token يستخدم مع الطلبات المحمية، وuserData يستخدم في الواجهة مثل GitHub username.
export function setAuthSession({ token, user }) {
  if (token) localStorage.setItem("auth_token", token);
  if (user) localStorage.setItem("userData", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", token ? "true" : "false");
}

// تنظيف الجلسة عند تسجيل الخروج.
export function clearAuthSession() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userData");
}

// دالة عامة لكل API requests بدل تكرار fetch في كل صفحة.
export async function apiRequest(path, options = {}) {
  // تجهيز headers الافتراضية لأي request JSON.
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // لو المستخدم عامل login نضيف التوكن في Authorization header.
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  // تنفيذ الطلب على الباك إند.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // نحاول قراءة JSON حتى لو الرد خطأ، عشان نعرض message واضحة.
  const data = await response.json().catch(() => ({}));

  // لو السيرفر رجع error نرميه للصفحة اللي نادت الدالة.
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  // لو كل شيء تمام نرجع البيانات للصفحة.
  return data;
}

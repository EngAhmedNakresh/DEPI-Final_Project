import { Navigate } from "react-router-dom";
import { getAuthToken } from "../Api/client";

// دالة بسيطة تتحقق هل المستخدم مسجل دخول أم لا.
// نعتمد على وجود isLoggedIn والتوكن معًا حتى لا يدخل المستخدم صفحات محمية بدون جلسة.
const isAuthenticated = () =>
  localStorage.getItem("isLoggedIn") === "true" && Boolean(getAuthToken());

// حارس الصفحة الرئيسية.
// لو المستخدم عامل login لا نعرض له landing page، ونوديه مباشرة للداشبورد.
export function HomeRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// حارس الصفحات المحمية مثل Dashboard وAbout وTheme وPortfolio.
// لو المستخدم مش عامل login نرسله لصفحة تسجيل الدخول.
export function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ authRequired: true, message: "Please login first" }}
      />
    );
  }
  return children;
}

// حارس صفحات الضيوف مثل Login وSignup.
// لو المستخدم مسجل بالفعل، مفيش داعي يشوف login/signup ونرجعه للداشبورد.
export function GuestOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

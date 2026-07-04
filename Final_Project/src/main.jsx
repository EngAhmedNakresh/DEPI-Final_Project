import ReactDOM from "react-dom/client";
import ScrollToTop from "react-scroll-to-top";
import { AllData } from "./Api/AllApi";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Signup from "./signup/Signup";
import { FaArrowUp } from "react-icons/fa";
import ThemeProvider from "./context/ThemeContext";
import Login from "./login/Login";
import OAuthCallback from "./login/OAuthCallback";
import Dashboard from "./dashboard/Dashboard";
import About from "./About/About";
import ThemePage from "./Theme/Theme";
import PortfolioPage from "./Theme/Portfolio";
import AddReviewPage from "./Theme/AddReview";
import { GuestOnlyRoute, HomeRoute, ProtectedRoute } from "./routes/RouteGuards";

// هنا بنعرف كل صفحات الموقع والـ route الخاص بكل صفحة.
// استخدمنا Hash Router عشان الروابط تشتغل بسهولة بعد النشر بدون إعدادات server routing إضافية.
const router = createHashRouter([
  {
    // الصفحة الرئيسية تظهر للزائر فقط، ولو المستخدم عامل login يتحول تلقائيًا للداشبورد.
    path: "/",
    element: (
      <HomeRoute>
        <App />
      </HomeRoute>
    ),
  },
  {
    // صفحة إنشاء الحساب ممنوعة على المستخدم المسجل بالفعل.
    path: "signup",
    element: (
      <GuestOnlyRoute>
        <Signup />
      </GuestOnlyRoute>
    ),
  },
  {
    // صفحة تسجيل الدخول ممنوعة أيضًا لو المستخدم عامل login.
    path: "login",
    element: (
      <GuestOnlyRoute>
        <Login />
      </GuestOnlyRoute>
    ),
  },
  {
    path: "oauth/callback",
    element: <OAuthCallback />,
  },
  {
    // بداية رحلة بناء البورتفوليو: اختيار مشاريع GitHub، ولازم المستخدم يكون مسجل.
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    // صفحة كتابة أو توليد About Me واختيار المهارات.
    path: "about",
    element: (
      <ProtectedRoute>
        <About />
      </ProtectedRoute>
    ),
  },
  {
    // صفحة اختيار الثيم ومعاينة شكل البورتفوليو قبل النشر.
    path: "theme",
    element: (
      <ProtectedRoute>
        <ThemePage />
      </ProtectedRoute>
    ),
  },
  {
    // صفحة عرض البورتفوليو النهائي بالثيم المختار.
    path: "portfolio",
    element: (
      <ProtectedRoute>
        <PortfolioPage />
      </ProtectedRoute>
    ),
  },
  {
    // صفحة إضافة review يظهر في صفحة التسجيل كـ testimonial.
    path: "add-review",
    element: (
      <ProtectedRoute>
        <AddReviewPage />
      </ProtectedRoute>
    ),
  },
]);

// هنا بنربط تطبيق React بالـ HTML ونغلفه بالـ providers العامة.
ReactDOM.createRoot(document.getElementById("root")).render(
  // ThemeProvider مسؤول عن وضع الـ light/dark في الموقع.
  <ThemeProvider>
    {/* AllData context عام لو احتجنا مشاركة بيانات بين المكونات. */}
    <AllData>
      {/* زر ثابت يرجع المستخدم لأعلى الصفحة عند الضغط عليه. */}
      <ScrollToTop
        smooth
        component={<FaArrowUp color="var(--white)" size={20} />}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "rgba(13, 35, 82, 0.77)",
          borderRadius: "50%",
          boxShadow: "0 8px 20px rgba(37, 99, 235, 0.6)",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
      />

      {/* RouterProvider هو المسؤول عن عرض الصفحة المناسبة حسب الرابط الحالي. */}
      <RouterProvider router={router} />
    </AllData>
  </ThemeProvider>
);

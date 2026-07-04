import { useEffect, useRef, useState } from "react";
import "./login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest, getApiUrl, setAuthSession } from "../Api/client";

// صفحة تسجيل الدخول: تتحقق من بيانات المستخدم ثم تحفظ الجلسة وتدخله للداشبورد.
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const showedAuthToast = useRef(false);

  // states الخاصة بمدخلات الفورم ورسائل الأخطاء.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  // لو المستخدم حاول يدخل صفحة محمية بدون login، نعرض له رسالة "Please login first".
  useEffect(() => {
    if (location.state?.authRequired && !showedAuthToast.current) {
      toast.error("Please login first");
      showedAuthToast.current = true;
      navigate("/login", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  // validation للـ email والـ password قبل إرسال الطلب للباك إند.
  const validate = () => {
    const newErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters and include letters and numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // عند submit نرسل بيانات الدخول إلى /api/auth/login.
  // لو البيانات صحيحة نحفظ token وuserData ثم ننتقل للداشبورد.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setAuthSession({ token: data.token, user: data.user });
      toast.success("Logged in successfully 🚀");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1200);
    } catch (error) {
      toast.error(error.message || "Invalid email or password");
    }
  };

  return (
    <>
      {/* ToastContainer مسؤول عن إظهار رسائل النجاح والخطأ. */}
      <ToastContainer position="top-right" theme="dark" />

      <div className="auth-page">
        {/* فورم تسجيل الدخول. */}
        <form className="auth-card" onSubmit={handleSubmit}>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">Build an AI-powered portfolio in seconds.</p>

          <div className="auth-divider" />

          <div className="auth-group">
            <label>Email Address</label>
            <div className={`auth-input ${errors.email ? "error" : ""}`}>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="icon">✉</span>
            </div>
            {errors.email && <small>{errors.email}</small>}
          </div>

          <div className="auth-group">
            <label>Password</label>
            <div className={`auth-input ${errors.password ? "error" : ""}`}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="icon">👁</span>
            </div>
            <small>
              {errors.password || "At least 8 characters with letters and numbers"}
            </small>
          </div>

          <button className="primary-btn" type="submit">
            Sign in <span>→</span>
          </button>

          <a className="github-auth-btn" href={getApiUrl("/auth/github")}>
            <i className="fa-brands fa-github" />
            Continue with GitHub
          </a>

          <p className="auth-footer">
            Doesn't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </>
  );
}

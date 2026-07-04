import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/theme-context";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Navbar الخاص بالصفحة الرئيسية للزوار غير المسجلين.
function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // تبديل الثيم العام بين light وdark.
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // التنقل داخل أقسام الصفحة الرئيسية بسلاسة.
  // لو المستخدم موجود في صفحة أخرى، نرجعه للهوم ثم نعمل scroll للقسم المطلوب.
  const scrollToSection = (sectionId) => {
    const scroll = () => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(scroll, 100);
      return;
    }

    scroll();
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-4 fixed-top">
      <div className="container-fluid">
        {/* لوجو الموقع في صفحات الضيوف يرجع للهوم. */}
        <Link className="navbar-brand fw-bold nav-logo" to="/" onClick={() => setMenuOpen(false)}>
          PortfolioGenie
        </Link>

        {/* زر فتح وقفل القائمة في الموبايل. */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`burger ${menuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* روابط أقسام الهوم وأزرار الدخول/التسجيل. */}
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 text-center">
            <li className="nav-item">
              <button
                className="nav-link animated-link bg-transparent border-0"
                type="button"
                onClick={() => scrollToSection("feature")}
              >
                Features
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link animated-link bg-transparent border-0"
                type="button"
                onClick={() => scrollToSection("work")}
              >
                How it works
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link animated-link bg-transparent border-0"
                type="button"
                onClick={() => scrollToSection("Pricing")}
              >
                Pricing
              </button>
            </li>
          </ul>

          {/* أدوات يمين الناف: تبديل الثيم، تسجيل الدخول، وإنشاء حساب. */}
          <div className="d-flex align-items-center gap-3 justify-content-center mt-3 mt-lg-0">
            <button className="theme-btn" type="button" onClick={toggleTheme}>
              <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            <Link to="/login" className="btn login-btn" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" className="btn signup-btn" onClick={() => setMenuOpen(false)}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

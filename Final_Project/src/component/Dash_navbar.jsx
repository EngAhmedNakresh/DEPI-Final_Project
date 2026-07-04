import "./dash_navbar.css";
import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/theme-context";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../Api/client";

// Navbar الخاص بالصفحات الداخلية بعد تسجيل الدخول.
// يظهر روابط الداشبورد والريفيو وزر الخروج وبيانات GitHub profile.
export default function Navbar({ avatar, profileLink }) {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // تبديل الثيم العام بين light وdark.
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // تسجيل الخروج: نمسح بيانات الجلسة ثم نرجع المستخدم للصفحة الرئيسية.
  const handleLogout = () => {
    clearAuthSession();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-4 fixed-top">
      <div className="container-fluid">
        {/* اللوجو داخل الصفحات المحمية يرجع المستخدم للداشبورد بدل الهوم. */}
        <Link className="navbar-brand fw-bold nav-logo" to="/dashboard" onClick={() => setMenuOpen(false)}>
          PortfolioGenie
        </Link>

        {/* زر القائمة في الشاشات الصغيرة. */}
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

        {/* روابط الصفحات الداخلية التي تظهر بعد تسجيل الدخول. */}
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 text-center">
            <li className="nav-item">
              <Link className="nav-link animated-link" to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link animated-link" to="/add-review" onClick={() => setMenuOpen(false)}>
                Review
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link animated-link bg-transparent border-0" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>

          {/* أدوات يمين الناف: تبديل الثيم، فتح GitHub profile، وصورة المستخدم. */}
          <div className="d-flex align-items-center gap-3 justify-content-center mt-3 mt-lg-0">
            <button className="theme-btn" onClick={toggleTheme}>
              <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            <a href={profileLink} target="_blank" rel="noreferrer" className="btn signup-btn">
              View Profile
            </a>
            <img className="avatar" src={avatar} alt="GitHub Avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
}

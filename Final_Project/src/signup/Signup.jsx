import React, { useState, useEffect } from "react";
import "./sign.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest, getApiUrl } from "../Api/client";

// صفحة إنشاء حساب جديد: تجمع بيانات المستخدم وتخزن الحساب في الباك إند.
function Signup() {
  const navigate = useNavigate();
  // currentSlide يتحكم في testimonial النشط، وsavedReviews تأتي من الباك إند.
  const [currentSlide, setCurrentSlide] = useState(0);
  const [savedReviews, setSavedReviews] = useState([]);

  // بيانات فورم التسجيل.
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    github: "",
    password: ""
  });

  // Testimonials افتراضية تظهر لو مفيش reviews محفوظة في الباك إند.
  const fallbackTestimonials = [
    {
      name: "Ahmed salah eldin",
      role: "Full stack web developer",
      text: `"PortfolioGenie optimized my messy GitHub repos into a clean showcase. I got hired at TechFlow in 2 weeks!"`,
      img: `${import.meta.env.BASE_URL}img/me.png`
    },
    {
      name: "Michael Lee",
      role: "Full Stack Developer at DevCorp",
      text: `"Using PortfolioGenie saved me days of work. Highly recommended!"`,
      img: "https://i.pravatar.cc/100?img=10"
    },
    {
      name: "Linda Kim",
      role: "UI/UX Designer at CreativeHub",
      text: `"Such a simple tool but incredibly powerful. Recruiters noticed me instantly!"`,
      img: "https://i.pravatar.cc/100?img=15"
    }
  ];

  // لو فيه reviews محفوظة نعرضها، ولو مفيش نعرض البيانات الافتراضية.
  const testimonials = savedReviews.length
    ? savedReviews.map((item) => ({
        name: item.name,
        role: item.email ? item.email.split("@")[0] : "PortfolioGenie user",
        text: `"${item.review}"`,
        img: `${import.meta.env.BASE_URL}img/logo.png`,
      }))
    : fallbackTestimonials;
  const activeSlide = testimonials.length ? currentSlide % testimonials.length : 0;

  // تحميل reviews من الباك إند لعرضها في جانب صفحة التسجيل.
  useEffect(() => {
    let mounted = true;

    async function loadReviews() {
      try {
        const data = await apiRequest("/reviews");
        if (!mounted) return;
        setSavedReviews(Array.isArray(data.reviews) ? data.reviews : []);
      } catch {
        if (!mounted) return;
        setSavedReviews([]);
      }
    }

    loadReviews();
    return () => {
      mounted = false;
    };
  }, []);

  // تغيير testimonial كل 3 ثواني تلقائيًا.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // تحديث formData عند الكتابة في أي input.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // التحقق من البيانات ثم إرسالها إلى /api/auth/signup لإنشاء الحساب.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, github, password } = formData;

    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!github.trim()) {
      toast.error("Please enter your GitHub username");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters and include letters and numbers");
      return;
    }

    try {
      const data = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      localStorage.setItem("userData", JSON.stringify(data.user));
      toast.success("Account created successfully 🚀");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Signup failed");
    }
  };

  return (
    <>
      {/* ToastContainer يعرض رسائل التسجيل والأخطاء. */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        draggable
        theme="dark"
      />

      <div className="auth-wrapper">
        <div className="auth-left">
          <div className="left-content">
            <h1 className="brand">PortfolioGenie</h1>
            <h2 className="hero-title">
              Optimized for Developers.<br />
              <span>Loved by Recruiters.</span>
            </h2>

            <div className="testimonial-card">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`testimonial-slide ${
                    i === activeSlide ? "active" : ""
                  }`}
                >
                  <div className="stars">★★★★★</div>
                  <p>{t.text}</p>
                  <div className="testimonial-user">
                    <img src={t.img} alt={t.name} />
                    <div>
                      <h4>{t.name}</h4>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="slider-dots">
                {testimonials.map((_, i) => (
                  <span
                    key={i}
                    className={i === activeSlide ? "active" : ""}
                    onClick={() => setCurrentSlide(i)}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="form-container">
            <Link to="/" className="signup-home-link" aria-label="Back to home page">
              <i className="fa-solid fa-house" />
            </Link>
            <h2>Create your account</h2>
            <p className="subtitle">
              Build an AI-powered portfolio in seconds.
            </p>
            <div className="divider"></div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                />
              </div>

              <div className="input-group">
                <label>Github username</label>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="username"
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <small>At least 8 characters with letters and numbers</small>
              </div>

              <button type="submit" className="primary-btn">
                Create Account <span>→</span>
              </button>

              <a className="github-auth-btn" href={getApiUrl("/auth/github")}>
                <i className="fa-brands fa-github" />
                Continue with GitHub
              </a>
            </form>

            <p className="login-link">
              Already have an account? <Link to="/login">Log In</Link>
            </p>

            <p className="terms">
              By signing up, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;


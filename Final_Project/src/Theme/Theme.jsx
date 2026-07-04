import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dash_navbar from "../component/Dash_navbar";
import { PortfolioTemplatePreview } from "./Portfolio";
import "./theme.css";

// قائمة الثيمات المتاحة للمستخدم مع الاسم والوصف والشارة.
const templates = [
  { id: "aqua-glass", name: "Aqua Glass", badge: "NEW", desc: "Glass navigation, neon cyan accents, and a modern developer hero." },
  { id: "cyberpunk", name: "Cyberpunk", badge: "PRO", desc: "Neon accents, dark mode default, high contrast typography." },
  { id: "obsidian-split", name: "Obsidian Split", badge: "NEW", desc: "Black-red editorial split hero with premium minimalist structure." },
  { id: "elite-glow", name: "Elite Glow", badge: "NEW", desc: "Indigo-magenta glow, glass cards, and floating hero avatar." },
  { id: "next-level", name: "Next Level", badge: "HOT", desc: "Futuristic motion, glass cards, typing hero, and immersive neon vibe." },
  { id: "soft-creative", name: "Soft Creative", badge: "NEW", desc: "Pastel shapes, soft background, and artistic portfolio layout." },
  { id: "arabic-modern", name: "Arabic Modern", badge: "", desc: "Gradient Arabic hero with modern sections." },
  { id: "professional", name: "Professional Arabic", badge: "NEW", desc: "Clean professional layout with split About/Skills sections." },
  { id: "theme-ten", name: "Nakresh Portfolio", badge: "NEW", desc: "Bold navy Arabic portfolio with custom avatar shape and modern cards." },
  { id: "theme-eleven", name: "Luxury One Page", badge: "plus", desc: "Luxury Arabic one-page portfolio with glassmorphism and animated avatar frame." },
  { id: "theme-twelve", name: "Crazy Neon", badge: "NEW", desc: "Neon Arabic one-page portfolio with aurora background, particles, and dynamic interactions." },
  { id: "theme-thirteen", name: "Unique Portfolio", badge: "", desc: "Futuristic one-page layout with neon gradients, morphing avatar frame, and glass sections." },
  { id: "theme-fourteen", name: "Floating Orbit", badge: "NEW", desc: "Dark glass portfolio with floating gradient backdrop, orbit avatar ring, and tilted project cards." },
  { id: "clean-manrope", name: "Clean Manrope", badge: "NEW", desc: "Modern light layout, crisp typography, smooth cards, and elegant structure." },
  { id: "theme-fifteen", name: "Simple Orange", badge: "NEW", desc: "Soft orange portfolio with clean cards, cute avatar block, and lightweight modern layout." },
  { id: "karim-classic", name: "Karim Classic", badge: "NEW", desc: "Black-and-white Montserrat portfolio inspired by Karim's first reference." },
  { id: "karim-blue", name: "Karim Blue", badge: "NEW", desc: "Blue gradient hero, circular avatar, dark services, and clean project cards." },
  { id: "karim-neon", name: "Karim Neon", badge: "NEW", desc: "Bold dark neon editorial layout with colorful blobs, marquee skills, and asymmetrical projects." },
];

// صفحة اختيار الثيم: تعرض الثيمات ومعاينة مباشرة للبورتفوليو قبل النشر.
function ThemePage() {
  const navigate = useNavigate();
  // قراءة بيانات المستخدم والمشاريع والـ bio المحفوظين من الصفحات السابقة.
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const username = userData?.github || "github";
  const displayName = userData?.fullName || userData?.name || "Alex";
  const selectedProjects = JSON.parse(localStorage.getItem("selectedProjects") || "[]");
  const aboutText =
    localStorage.getItem(`about_bio_${username}`) ||
    localStorage.getItem("about_bio") ||
    "Full Stack Engineer passionate about building performant products.";

  const [activeTemplate, setActiveTemplate] = useState(
    localStorage.getItem("portfolio_theme") || "theme-fourteen"
  );
  const [githubProfile, setGithubProfile] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const previewRef = useRef(null);

  // تحميل بيانات GitHub لاستخدامها في المعاينة الحية.
  useEffect(() => {
    let mounted = true;

    async function loadGithubData() {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
        ]);
        if (!profileRes.ok || !reposRes.ok) return;

        const [profileData, reposData] = await Promise.all([
          profileRes.json(),
          reposRes.json(),
        ]);

        if (!mounted) return;
        setGithubProfile(profileData);
        setGithubRepos(Array.isArray(reposData) ? reposData : []);
      } catch {
        if (!mounted) return;
      }
    }

    loadGithubData();
    return () => {
      mounted = false;
    };
  }, [username]);

  // اختيار تفاصيل المشاريع التي ستظهر في المعاينة.
  const selectedRepoDetails = useMemo(() => {
    if (!githubRepos.length) return [];
    const bySelection = githubRepos.filter((repo) => selectedProjects.includes(repo.name));
    if (bySelection.length) return bySelection;
    return githubRepos.slice(0, 4);
  }, [githubRepos, selectedProjects]);

  // استخراج المهارات من لغات المشاريع المختارة.
  const previewSkills = useMemo(() => {
    return Array.from(new Set(selectedRepoDetails.map((repo) => repo.language).filter(Boolean)));
  }, [selectedRepoDetails]);

  // نص الوظيفة أو الدور الظاهر في الثيم، ويأتي من GitHub bio لو متاح.
  const roleLine = useMemo(() => {
    if (githubProfile?.bio) return githubProfile.bio;
    if (githubProfile?.company) return `Engineer @ ${githubProfile.company}`;
    return "Full Stack Engineer // AI Enthusiast";
  }, [githubProfile]);

  // بناء رابط البورتفوليو النهائي بالثيم المختار.
  function buildPortfolioHashUrl(extraQuery = "") {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    return `${baseUrl}#/portfolio?theme=${activeTemplate}&mode=publish${extraQuery}`;
  }

  // فتح البورتفوليو في تبويب جديد بوضع publish.
  function handlePublish() {
    localStorage.setItem("portfolio_theme", activeTemplate);
    window.open(buildPortfolioHashUrl(), "_blank", "noopener,noreferrer");
  }

  // فتح البورتفوليو مع أمر الطباعة/التصدير.
  function handleFinishExport() {
    localStorage.setItem("portfolio_theme", activeTemplate);
    window.open(buildPortfolioHashUrl("&autoprint=1"), "_blank", "noopener,noreferrer");
  }

  // تغيير الثيم النشط، وفي الموبايل ننزل تلقائيًا لمنطقة المعاينة.
  function handleTemplateSelect(templateId) {
    setActiveTemplate(templateId);

    if (window.matchMedia("(max-width: 760px)").matches) {
      window.setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    }
  }

  return (
    <div className="theme-page-shell">
      {/* نافبار الصفحات الداخلية. */}
      <Dash_navbar
        avatar={`https://github.com/${username}.png`}
        profileLink={`https://github.com/${username}`}
      />

      <main className="theme-page ">
        <div className="theme-mobile-step-indicator mt-5 py-2" aria-label="Current Step">
          <span className="theme-mobile-step-circle">3</span>
          <span className="theme-mobile-step-label">Theme</span>
        </div>

        <div className="theme-stepper" aria-label="Progress">
          <div className="theme-step completed">
            <span className="theme-step-circle"><i className="fa-solid fa-check" /></span>
            <span className="theme-step-label">Projects</span>
          </div>
          <div className="theme-step-line active" />

          <div className="theme-step completed">
            <span className="theme-step-circle"><i className="fa-solid fa-check" /></span>
            <span className="theme-step-label">About Me</span>
          </div>
          <div className="theme-step-line active" />

          <div className="theme-step active">
            <span className="theme-step-circle">3</span>
            <span className="theme-step-label">Theme</span>
          </div>
        </div>

        <section className="theme-header-row">
          <div>
            <h1>Theme Selection & Preview</h1>
            <p>
              Visualize your content in real-time. Choose a premium template designed for developers
              to showcase your AI-optimized portfolio.
            </p>
          </div>
        </section>

        <section className="theme-main-card">
          <aside className="theme-sidebar">
            <small className="theme-sidebar-title">AVAILABLE THEMES</small>

            <div className="theme-list-scroll">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className={`theme-option ${activeTemplate === template.id ? "active" : ""}`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="theme-option-head">
                    <strong>{template.name}</strong>
                    {template.badge && <span className="theme-badge">{template.badge}</span>}
                  </div>
                  <p>{template.desc}</p>
                  <span className="theme-preview-tag">
                    {activeTemplate === template.id ? "Active Preview" : "Preview"}
                  </span>
                </button>
              ))}

              <button
                type="button"
                className="theme-option add-review-card"
                aria-label="Add review"
                onClick={() => navigate("/add-review")}
              >
                <span className="add-review-plus">+</span>
                <span className="add-review-text">Add Review</span>
              </button>
            </div>
          </aside>

          <article ref={previewRef} className={`theme-preview-window preview-${activeTemplate}`}>
            <header className="window-head">
              <div className="window-dots"><span /><span /><span /></div>
              <div className="window-url">devportfolio.ai/preview/{activeTemplate}</div>
            </header>

            <div className={`window-body ${activeTemplate === "aqua-glass" || activeTemplate === "elite-glow" || activeTemplate === "cyberpunk" || activeTemplate === "obsidian-split" || activeTemplate === "next-level" || activeTemplate === "clean-manrope" || activeTemplate === "soft-creative" || activeTemplate === "arabic-modern" || activeTemplate === "professional" || activeTemplate === "theme-ten" || activeTemplate === "theme-eleven" || activeTemplate === "theme-twelve" || activeTemplate === "theme-thirteen" || activeTemplate === "theme-fourteen" || activeTemplate === "theme-fifteen" || activeTemplate === "karim-classic" || activeTemplate === "karim-blue" || activeTemplate === "karim-neon" ? "window-body-embed" : ""}`}>
              {activeTemplate === "aqua-glass" || activeTemplate === "elite-glow" || activeTemplate === "cyberpunk" || activeTemplate === "obsidian-split" || activeTemplate === "next-level" || activeTemplate === "clean-manrope" || activeTemplate === "soft-creative" || activeTemplate === "arabic-modern" || activeTemplate === "professional" || activeTemplate === "theme-ten" || activeTemplate === "theme-eleven" || activeTemplate === "theme-twelve" || activeTemplate === "theme-thirteen" || activeTemplate === "theme-fourteen" || activeTemplate === "theme-fifteen" || activeTemplate === "karim-classic" || activeTemplate === "karim-blue" || activeTemplate === "karim-neon" ? (
                <div className="theme-preview-embed theme-preview-inline">
                  <PortfolioTemplatePreview
                    activeTheme={activeTemplate}
                    name={displayName}
                    roleLine={roleLine}
                    about={aboutText}
                    avatar={githubProfile?.avatar_url || `https://github.com/${username}.png`}
                    projects={selectedRepoDetails}
                    skills={previewSkills}
                    profile={githubProfile}
                  />
                </div>
              ) : (
                <>
                  <div className="hero-block">
                    <div className="hero-main">
                      <div>
                        <h2>{displayName.toUpperCase()}</h2>
                        <p>{roleLine}</p>
                      </div>
                      {githubProfile?.avatar_url && (
                        <img
                          src={githubProfile.avatar_url}
                          alt="GitHub avatar"
                          className="preview-avatar"
                        />
                      )}
                    </div>
                    <div className="hero-actions">
                      <button type="button">CONTACT</button>
                      <button type="button" className="ghost">RESUME</button>
                    </div>
                  </div>

                  <p className="preview-about">{aboutText}</p>

                  <div className="project-preview-grid">
                    {selectedRepoDetails.slice(0, 4).map((repo) => (
                      <div key={repo.id || repo.name} className="project-tile">
                        <h4>{repo.name}</h4>
                        <small>{repo.language || "General"} • ★ {repo.stargazers_count || 0}</small>
                        <p>{repo.description || "Optimized project card generated from your GitHub repositories."}</p>
                      </div>
                    ))}
                  </div>

                  <footer className="portfolio-mini-footer">
                    <span>© {new Date().getFullYear()} {displayName}</span>
                    <span>{githubProfile?.location || "Remote"}</span>
                  </footer>
                </>
              )}

              <div className="publish-row">
                <button type="button" className="publish-btn" onClick={handlePublish}>
                  <i className="fa-solid fa-wand-magic-sparkles" /> Publish Portfolio
                </button>
              </div>
            </div>
          </article>
        </section>

        <footer className="theme-footer">
          <span className="theme-ready">
            <i className="fa-regular fa-circle-check" /> All steps completed
          </span>

          <div className="theme-footer-actions">
            <Link to="/about" className="theme-back-link">Back to About Me</Link>
            <button type="button" className="theme-finish-btn" onClick={handleFinishExport}>
              Finish & Export Code <i className="fa-solid fa-download" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default ThemePage;

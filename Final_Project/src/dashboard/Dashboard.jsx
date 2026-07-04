import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { normalizeGithubUsername } from "../utils/github";
import Dash_navbar from "../component/Dash_navbar";
import ProjectCard from "./ProjectCard";
import "./dashboard.css";
import "./project-card.css";

// قراءة repositories المخزنة في localStorage لو GitHub API فشل أو لتسريع التحميل.
function readCachedRepos(keys) {
  for (const key of keys) {
    try {
      const cached = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(cached) && cached.length) return cached;
    } catch {
      // Ignore invalid cache entries and try the next key.
    }
  }

  return [];
}

// صفحة الداشبورد: تعرض مشاريع GitHub وتسمح للمستخدم باختيار المشاريع التي ستظهر في البورتفوليو.
export default function Dashboard() {
  // states للتحكم في المشاريع المختارة، البحث، الفلترة، وعدد الكروت المعروضة.
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterLang, setFilterLang] = useState("All");
  const [visibleCount, setVisibleCount] = useState(7);

  const navigate = useNavigate();
  // قراءة بيانات المستخدم المسجل من localStorage لمعرفة GitHub username.
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const githubUsername = normalizeGithubUsername(
    user?.github || user?.githubUsername || user?.username || user?.login || ""
  );
  const reposStorageKey = githubUsername ? `github_repos_${githubUsername}` : "github_repos";
  const candidateRepoKeys = useMemo(
    () => [
      reposStorageKey,
      "github_repos",
      "repos_cache",
      "repos",
    ],
    [reposStorageKey]
  );
  const [repos, setRepos] = useState(() => readCachedRepos(candidateRepoKeys));

  // تحميل repositories من GitHub API ثم تخزينها محليًا كـ cache.
  useEffect(() => {
    if (!githubUsername) return;

    fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch repos");
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid repos payload");
        }
        setRepos(data);
        setVisibleCount(7);
        localStorage.setItem(reposStorageKey, JSON.stringify(data));
        localStorage.setItem("github_repos", JSON.stringify(data));
      })
      .catch(() => {
        const cachedRepos = readCachedRepos(candidateRepoKeys);
        if (cachedRepos.length) setRepos(cachedRepos);
      });
  }, [githubUsername, reposStorageKey, candidateRepoKeys]);

  // اختيار أو إلغاء اختيار مشروع معين.
  const toggleSelect = (repoName) => {
    setSelectedProjects((prev) =>
      prev.includes(repoName)
        ? prev.filter((name) => name !== repoName)
        : [...prev, repoName]
    );
  };

  // حفظ المشاريع المختارة في localStorage حتى تستخدمها صفحة About وTheme وPortfolio.
  useEffect(() => {
    localStorage.setItem(
      "selectedProjects",
      JSON.stringify(selectedProjects)
    );
  }, [selectedProjects]);

  const proflink = githubUsername ? `https://github.com/${githubUsername}` : "#";

  // ÙÙ„ØªØ±Ø© Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹ Ø­Ø³Ø¨ Ø§Ù„Ø¨Ø­Ø« ÙˆØ§Ù„ÙÙ„ØªØ±
  // فلترة المشاريع حسب نص البحث أو لغة البرمجة المختارة.
  const filteredRepos = (Array.isArray(repos) ? repos : []).filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (repo.language &&
        repo.language.toLowerCase().includes(searchText.toLowerCase()));

    const matchesFilter = filterLang === "All" || repo.language === filterLang;

    return matchesSearch && matchesFilter;
  });

  // زر Add More يزيد عدد المشاريع الظاهرة تدريجيًا.
  const handleAddMore = () => {
    if (visibleCount >= filteredRepos.length) {
      toast.info("No more projects to add");
      return;
    }

    setVisibleCount((prev) => Math.min(prev + 4, filteredRepos.length));
  };

  const allRepoNames = (Array.isArray(repos) ? repos : []).map((repo) => repo.name);
  const allSelected = allRepoNames.length > 0 && allRepoNames.every((name) => selectedProjects.includes(name));

  // تحديد كل المشاريع أو إلغاء تحديدها.
  const handleSelectAllProjects = () => {
    if (!allRepoNames.length) return;
    if (allSelected) {
      setSelectedProjects((prev) => prev.filter((name) => !allRepoNames.includes(name)));
      return;
    }
    setSelectedProjects((prev) => Array.from(new Set([...prev, ...allRepoNames])));
  };

  return (
    <>
      {/* النافبار الداخلي الخاص بالمستخدم المسجل. */}
      <Dash_navbar
        avatar={githubUsername ? `https://github.com/${githubUsername}.png` : ""}
        profileLink={githubUsername ? `https://github.com/${githubUsername}` : "#"}
      />

      <div className="page-wrapper">
        <div className="container-fluid">

          {/* Stepper */}
          <div className="row justify-content-center mt-3">
            <div className="col-12">
              <div className="stepper-wrapper">
                <div className="step-item active">
                  <span className="step-number">1</span>
                  <span className="step-label">Projects</span>
                </div>
                <div className="step-item">
                  <span className="step-number">2</span>
                  <span className="step-label opacity-50">About Me</span>
                </div>
                <div className="step-item">
                  <span className="step-number">3</span>
                  <span className="step-label opacity-50">Theme</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="row align-items-end mb-3">
            <div className="col-md-9">
              <h1 className="main-title">Select & Optimize Projects</h1>
              <p className="description d-flex align-items-center">
                <span>Choose the repositories to showcase in your portfolio.</span>
                <a href="#" className="ai-link">AI Optimization</a>
              </p>
            </div>
            <div className="col-md-3 text-md-end">
              <Link to="/dashboard" className="resync-btn">
                <i className="fas fa-sync me-2"></i>
                Resync GitHub
              </Link>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="search-filters-container d-flex flex-wrap gap-2">
            <div className="search-container flex-grow-1">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search repositories..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setVisibleCount(7);
                }}
              />
            </div>

            <div className="filters-container d-flex gap-2">
              <button
                className={`select-all-btn ${allSelected ? "done" : ""}`}
                onClick={handleSelectAllProjects}
                disabled={allRepoNames.length === 0}
                type="button"
              >
                {allSelected ? "Clear All Projects" : "Select All Projects"}
              </button>

              <button
                className={`filter-btn ${filterLang === "All" ? "active" : ""}`}
                onClick={() => {
                  setFilterLang("All");
                  setVisibleCount(7);
                }}
              >
                All Repos
              </button>

              {Array.from(new Set((Array.isArray(repos) ? repos : []).map((repo) => repo.language)))
                .filter(Boolean)
                .map((lang) => (
                  <button
                    key={lang}
                    className={`filter-btn ${filterLang === lang ? "active" : ""}`}
                    onClick={() => {
                      setFilterLang(lang);
                      setVisibleCount(7);
                    }}
                  >
                    {lang}
                  </button>
                ))}
            </div>
          </div>

          {/* Projects */}
          <div className="projects-grid mt-5 mb-5">
            {filteredRepos.length > 0 ? (
              filteredRepos.slice(0, visibleCount).map((repo) => (
                <ProjectCard
                  key={repo.id}
                  repo={repo}
                  isSelected={selectedProjects.includes(repo.name)}
                  onSelect={toggleSelect}
                />
              ))
                        ) : (
              <div className="no-results text-center m-auto">
                <div className="no-results-icon-wrap">
                  <span className="emoji">😅</span>
                </div>
                <h3>No repositories found</h3>
                <p>
                  Try another keyword or reset the current filter to view your
                  repositories.
                </p>
                <div className="no-results-actions">
                  <button
                    type="button"
                    className="reset-filters-btn"
                    onClick={() => {
                      setSearchText("");
                      setFilterLang("All");
                    }}
                  >
                    Reset Filters
                  </button>
                  <a
                    href={proflink}
                    target="_blank"
                    rel="noreferrer"
                    className="view-github-btn"
                  >
                    View GitHub
                  </a>
                </div>
              </div>
            )}

            {filteredRepos.length > 7 && (
              <div className="project-card add-repo">
                <button type="button" className="circle-plus" onClick={handleAddMore}>+</button>
                <p>Add Another Repository</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="projects-footer px-4 mb-3">
            <span>
              {selectedProjects.length} Projects Selected
              {selectedProjects.length === 0 && (
                <small> Select at least 1 to continue</small>
              )}
            </span>

            <div className="footer-actions">
              <button
                className="back-btn"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>

              <button
                className="next-btn"
                disabled={selectedProjects.length === 0}
                onClick={() => navigate("/about")}
              >
                Next: About Me <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>

        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </>
  );
}

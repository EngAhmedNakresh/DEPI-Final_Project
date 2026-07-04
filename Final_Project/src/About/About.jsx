import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { normalizeGithubUsername } from "../utils/github";
import Dash_navbar from "../component/Dash_navbar";
import "./about.css";

// توليد bio محليًا من بيانات GitHub والمشاريع المختارة بدون الحاجة لـ AI خارجي.
function generateLocalBio({ name, profile, repos, selectedProjects, tone }) {
  const reposToUse = selectedProjects.length
    ? repos.filter((repo) => selectedProjects.includes(repo.name))
    : repos.slice(0, 8);

  if (!reposToUse.length) {
    return `Hi, I'm ${name}. I build web applications and keep refining my portfolio through real GitHub projects.`;
  }

  const topRepos = [...reposToUse]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 3);

  const langCount = {};
  reposToUse.forEach((repo) => {
    const lang = repo.language;
    if (!lang) return;
    langCount[lang] = (langCount[lang] || 0) + 1;
  });
  const topLanguages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([lang]) => lang);

  const totalStars = reposToUse.reduce(
    (sum, repo) => sum + (repo.stargazers_count || 0),
    0
  );

  const repoPhrase = topRepos.map((repo) => repo.name).join(", ");
  const languagePhrase = topLanguages.length
    ? topLanguages.join(", ")
    : "modern web technologies";
  const roleHint = profile?.bio ? ` ${profile.bio}` : "";

  if (tone === "story") {
    return `I'm ${name}, and I enjoy turning ideas into products people can use.${roleHint} On GitHub, my recent work includes ${repoPhrase}. Across these projects, I mainly work with ${languagePhrase}, and I focus on shipping clean, practical solutions. I've built ${reposToUse.length} highlighted repositories with a total of ${totalStars} stars, which reflects consistent hands-on work and iteration. I care about readable architecture, thoughtful UX, and measurable improvements in every release.`;
  }

  if (tone === "professional") {
    return `I am ${name}, a software developer focused on building reliable, user-centered applications.${roleHint} My GitHub portfolio highlights projects such as ${repoPhrase}, with primary expertise in ${languagePhrase}. Across ${reposToUse.length} featured repositories and ${totalStars} total stars, I demonstrate end-to-end delivery from implementation to refinement. I prioritize maintainable code, performance, and clear product outcomes.`;
  }

  return `Hi, I'm ${name}. I build production-ready web apps and APIs, with hands-on work across ${languagePhrase}.${roleHint} My selected GitHub projects include ${repoPhrase}. Across ${reposToUse.length} featured repos and ${totalStars} total stars, I focus on clean architecture, practical problem solving, and consistent delivery.`;
}

// صفحة About: تجهيز النبذة الشخصية والمهارات التي ستظهر في البورتفوليو.
function About() {
  // قراءة بيانات المستخدم واستخراج GitHub username.
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const username =
    normalizeGithubUsername(
      userData?.github ||
        userData?.githubUsername ||
        userData?.username ||
        userData?.login ||
        ""
    ) || "github";
  const displayName = userData?.fullName || userData?.name || "Alex";
  const customSkillsStorageKey = `about_custom_skills_${username}`;
  const removedSkillsStorageKey = `about_removed_skills_${username}`;
  const bioStorageKey = `about_bio_${username}`;
  const aboutDataStorageKey = `about_data_${username}`;
  // المشاريع التي اختارها المستخدم في الداشبورد.
  const selectedProjects = JSON.parse(
    localStorage.getItem("selectedProjects") || "[]"
  );

  // أنماط مختلفة لصياغة الـ bio.
  const toneOptions = [
    {
      id: "technical",
      title: "Technical & Concise",
      subtitle: "Focus on skills and stack",
    },
    {
      id: "story",
      title: "Story-driven",
      subtitle: "Narrative about your journey",
    },
    {
      id: "professional",
      title: "Professional",
      subtitle: "Standard corporate style",
    },
  ];

  // Bio احتياطي يظهر لو لم تتوفر بيانات كافية.
  const fallbackBio = useMemo(
    () => `Hi, I'm ${displayName}. I am a passionate Full Stack Developer with a focus
on building scalable web applications using React and Node.js.
With over 3 years of experience contributing to open source, I have
a deep understanding of modern frontend architectures and RESTful
API design. My recent work on the 'ecommerce-dashboard'
demonstrates my ability to create complex data visualization tools
that drive business insights.
I'm currently exploring AI integration in web apps and looking for
opportunities to work on challenging problems in the fintech space.
When I'm not coding, I'm likely debugging my coffee machine or
hiking offline.`,
    [displayName]
  );
  // states الخاصة بالنص، التون، بيانات GitHub، وحالة التوليد.
  const [bio, setBio] = useState(() => localStorage.getItem(bioStorageKey) || "");
  const [activeTone, setActiveTone] = useState("technical");
  const [githubProfile, setGithubProfile] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  // حفظ الـ bio في state وlocalStorage معًا.
  const persistBio = React.useCallback((nextBio) => {
    setBio(nextBio);
    localStorage.setItem(bioStorageKey, nextBio);
    localStorage.setItem("about_bio", nextBio);
  }, [bioStorageKey]);
  // تحديد هل نحتاج نولد bio تلقائيًا أم المستخدم كتب واحد بالفعل.
  const shouldAutoGenerateBio = useMemo(() => {
    const current = String(bio || "").trim();
    if (!current) return true;
    if (current === fallbackBio.trim()) return true;

    // Legacy static template markers.
    return (
      current.includes("I am a passionate Full Stack Developer") ||
      current.includes("debugging my coffee machine") ||
      current.includes("fintech space")
    );
  }, [bio, fallbackBio]);
  // المهارات التي أضافها المستخدم يدويًا.
  const [customSkills, setCustomSkills] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(customSkillsStorageKey) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [removedSkills, setRemovedSkills] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(removedSkillsStorageKey) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [skillInput, setSkillInput] = useState("");

  const apiKey =
    import.meta.env.VITE_GROQ_API_KEY ||
    localStorage.getItem("groq_api_key") ||
    "";
  const aiModel = import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile";
  const navigate = useNavigate();

  const selectedRepoDetails = useMemo(() => {
    if (!githubRepos.length || !selectedProjects.length) return [];
    return githubRepos.filter((repo) => selectedProjects.includes(repo.name));
  }, [githubRepos, selectedProjects]);

  const githubLanguages = useMemo(
    () => Array.from(new Set(githubRepos.map((repo) => repo.language))).filter(Boolean),
    [githubRepos]
  );

  const detectedSkills = useMemo(() => {
    const reposToUse = selectedRepoDetails.length
      ? selectedRepoDetails
      : githubRepos.slice(0, 12);

    const topicCount = {};

    reposToUse.forEach((repo) => {
      if (Array.isArray(repo.topics)) {
        repo.topics.forEach((topic) => {
          const normalized = String(topic || "").trim();
          if (!normalized) return;
          topicCount[normalized] = (topicCount[normalized] || 0) + 1;
        });
      }
    });

    const topTopics = Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic]) => topic);

    return [...githubLanguages, ...topTopics];
  }, [githubRepos, selectedRepoDetails, githubLanguages]);

  const skillBadges = useMemo(() => {
    const map = new Map();
    [...detectedSkills, ...customSkills].forEach((skill) => {
      const clean = String(skill || "").trim();
      if (!clean) return;
      const key = clean.toLowerCase();
      if (!map.has(key)) map.set(key, clean);
    });
    return Array.from(map.values()).filter(
      (skill) => !removedSkills.includes(skill.toLowerCase())
    );
  }, [detectedSkills, customSkills, removedSkills]);

  const optimizationData = useMemo(() => {
    const reposToUse = selectedRepoDetails.length
      ? selectedRepoDetails
      : githubRepos.slice(0, 8);

    const text = (bio || "").trim();
    const words = text ? text.split(/\s+/).length : 0;

    const languageCount = {};
    reposToUse.forEach((repo) => {
      if (!repo.language) return;
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    });

    const uniqueLanguages = Object.keys(languageCount).length;
    const totalStars = reposToUse.reduce(
      (sum, repo) => sum + (repo.stargazers_count || 0),
      0
    );

    const hasNumbers = /\d/.test(text);
    const hasActionVerbs =
      /(built|developed|designed|led|improved|optimized|implemented|created|delivered|scaled)/i.test(
        text
      );
    const hasTechKeywords =
      /(react|node|javascript|typescript|python|api|aws|docker|sql|frontend|backend)/i.test(
        text
      );

    let score = 45;
    score += Math.min(uniqueLanguages * 6, 18);
    score += Math.min(Math.floor(totalStars / 5), 12);
    if (words >= 90 && words <= 210) score += 12;
    else if (words >= 60) score += 6;
    if (hasActionVerbs) score += 8;
    if (hasTechKeywords) score += 7;
    if (hasNumbers) score += 8;
    score = Math.max(25, Math.min(98, score));

    const strengths = [];
    const improvements = [];

    if (hasActionVerbs) strengths.push("Strong action verbs used");
    else improvements.push("Use stronger action verbs (built, led, improved)");

    if (hasTechKeywords) strengths.push("Technical stack is clearly highlighted");
    else improvements.push("Mention your core technologies explicitly");

    if (uniqueLanguages >= 3) {
      strengths.push(`Good language diversity across projects (${uniqueLanguages})`);
    } else {
      improvements.push("Showcase more diversity across project languages");
    }

    if (hasNumbers) strengths.push("Includes measurable impact/metrics");
    else improvements.push("Add measurable metrics (%, users, latency, etc.)");

    if (words < 90) improvements.push("Bio is short; add more concrete project impact");
    if (words > 220) improvements.push("Bio is long; keep it more concise and focused");

    const items = [
      ...strengths.slice(0, 2).map((textItem) => ({ type: "good", text: textItem })),
      ...improvements.slice(0, 2).map((textItem) => ({
        type: "warn",
        text: textItem,
      })),
    ];

    if (!items.length) {
      items.push(
        { type: "good", text: "Profile quality is solid and balanced" },
        { type: "warn", text: "Add one concrete metric to make it stronger" }
      );
    }

    return { score, items };
  }, [bio, githubRepos, selectedRepoDetails]);

  useEffect(() => {
    let mounted = true;

    async function loadGithubData() {
      const cachedKeys = [`github_repos_${username}`, "github_repos", "repos_cache", "repos"];
      let cachedRepos = [];
      for (const key of cachedKeys) {
        try {
          const value = JSON.parse(localStorage.getItem(key) || "[]");
          if (Array.isArray(value) && value.length) {
            cachedRepos = value;
            break;
          }
        } catch {
          cachedRepos = [];
        }
      }

      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
        ]);

        if (!profileRes.ok || !reposRes.ok) {
          throw new Error("Failed to load GitHub data");
        }

        const [profileData, reposData] = await Promise.all([
          profileRes.json(),
          reposRes.json(),
        ]);

        if (!mounted) return;
        setGithubProfile(profileData);
        setGithubRepos(Array.isArray(reposData) ? reposData : []);
      } catch {
        if (!mounted) return;
        if (cachedRepos.length) {
          setGithubRepos(cachedRepos);
          setAiError("Using cached GitHub repos. Add API key for stronger AI output.");
        } else {
          setAiError("Couldn't load GitHub data, using fallback bio.");
          persistBio(fallbackBio);
        }
      }
    }

    loadGithubData();

    return () => {
      mounted = false;
    };
  }, [username, fallbackBio, persistBio]);

  async function generateBioWithAI() {
    const reposToUse = selectedRepoDetails.length
      ? selectedRepoDetails
      : githubRepos.slice(0, 8);

    if (!reposToUse.length) {
      persistBio(fallbackBio);
      return;
    }

    const languageCount = {};
    reposToUse.forEach((repo) => {
      if (!repo.language) return;
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    });

    const topLanguages = Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([lang]) => lang);

    const userContext = {
      name: displayName,
      githubUsername: username,
      githubName: githubProfile?.name || "",
      githubBio: githubProfile?.bio || "",
      company: githubProfile?.company || "",
      location: githubProfile?.location || "",
      publicRepos: githubProfile?.public_repos || githubRepos.length,
      followers: githubProfile?.followers || 0,
      following: githubProfile?.following || 0,
      topLanguages,
      selectedProjectNames: selectedProjects,
      projects: reposToUse.map((repo) => ({
        name: repo.name,
        description: repo.description || "No description",
        language: repo.language || "N/A",
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
      })),
      tone: toneOptions.find((t) => t.id === activeTone)?.title || "Technical & Concise",
    };

    if (!apiKey) {
      setAiError("Using local AI summary from GitHub data. Add VITE_GROQ_API_KEY for LLM output.");
      persistBio(
        generateLocalBio({
          name: displayName,
          profile: githubProfile,
          repos: reposToUse,
          selectedProjects,
          tone: activeTone,
        })
      );
      return;
    }

    setIsGenerating(true);
    setAiError("");

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: aiModel,
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content:
                "Write one professional first-person About Me paragraph (120-180 words). Use the provided GitHub profile and projects, keep it specific and concise.",
            },
            {
              role: "user",
              content: `Generate the bio from this data:\n${JSON.stringify(
                userContext,
                null,
                2
              )}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const data = await response.json();
      const generated = data?.choices?.[0]?.message?.content?.trim();
      persistBio(generated || fallbackBio);
    } catch {
      setAiError("AI generation failed, fallback bio is shown.");
      persistBio(fallbackBio);
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    if (!githubRepos.length || !shouldAutoGenerateBio) return;
    generateBioWithAI();
  }, [githubRepos, shouldAutoGenerateBio]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    localStorage.setItem(customSkillsStorageKey, JSON.stringify(customSkills));
  }, [customSkills, customSkillsStorageKey]);

  useEffect(() => {
    localStorage.setItem(removedSkillsStorageKey, JSON.stringify(removedSkills));
  }, [removedSkills, removedSkillsStorageKey]);

  useEffect(() => {
    localStorage.setItem(bioStorageKey, bio);
    localStorage.setItem("about_bio", bio);
  }, [bio, bioStorageKey]);

  useEffect(() => {
    const aboutPayload = {
      username,
      bio,
      skills: skillBadges,
      tone: activeTone,
      selectedProjects,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(aboutDataStorageKey, JSON.stringify(aboutPayload));
    localStorage.setItem("about_data", JSON.stringify(aboutPayload));
  }, [
    aboutDataStorageKey,
    username,
    bio,
    skillBadges,
    activeTone,
    selectedProjects,
  ]);

  function addCustomSkill() {
    const value = skillInput.trim();
    if (!value) return;

    const exists = [...detectedSkills, ...customSkills].some(
      (skill) => skill.toLowerCase() === value.toLowerCase()
    );
    if (!exists) {
      setCustomSkills((prev) => [...prev, value]);
    }
    setRemovedSkills((prev) =>
      prev.filter((item) => item !== value.toLowerCase())
    );
    setSkillInput("");
  }

  function removeSkill(skillName) {
    const key = skillName.toLowerCase();
    setCustomSkills((prev) => prev.filter((item) => item.toLowerCase() !== key));
    setRemovedSkills((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  return (
    <div className="about-page-shell">
      <Dash_navbar
        avatar={`https://github.com/${username}.png`}
        profileLink={`https://github.com/${username}`}
      />

      <main className="about-page mt-5 pt-4">
        <div className="about-mobile-step-indicator" aria-label="Current Step">
          <span className="about-mobile-step-circle">2</span>
          <span className="about-mobile-step-label">About Me</span>
        </div>

        <div className="about-stepper" aria-label="Progress">
          <div className="about-step completed project-step">
            <span className="about-step-circle">
              <i className="fa-solid fa-check" />
            </span>
            <span className="about-step-title">Projects</span>
          </div>
          <div className="about-step-line active project-line" />

          <div className="about-step active about-current-step">
            <span className="about-step-circle">2</span>
            <span className="about-step-title">About Me</span>
          </div>
          <div className="about-step-line theme-line" />

          <div className="about-step upcoming theme-step">
            <span className="about-step-circle">3</span>
            <span className="about-step-title">Theme</span>
          </div>
        </div>

        <section className="about-header-row">
          <div>
            <h1>AI About Me Generator</h1>
            <p>
              We've analyzed your GitHub activity to generate a professional bio.
              Tweak the tone and skills to match your personality.
            </p>
            {aiError && <small className="about-ai-hint">{aiError}</small>}
          </div>
          <button className="ghost-btn" type="button" onClick={generateBioWithAI}>
            <i className="fa-solid fa-rotate-right" />
            {isGenerating ? "Generating..." : "Regenerate"}
          </button>
        </section>

        <section className="about-main-grid">
          <article className="editor-card">
            <header className="editor-tools">
              <div className="tool-icons">
                <i className="fa-solid fa-bold" />
                <i className="fa-solid fa-italic" />
                <i className="fa-solid fa-list-ul" />
                <i className="fa-solid fa-link" />
              </div>
              <span>Markdown Supported</span>
            </header>

            <textarea
              className="bio-input"
              value={bio}
              onChange={(e) => persistBio(e.target.value)}
              placeholder={isGenerating ? "Generating bio from GitHub data..." : "Your AI bio will appear here"}
            />

            <footer className="editor-meta">
              <small>Last saved just now</small>
              <div className="meta-right">
                <span className="ai-tag">AI Generated</span>
                <small>{bio.length} characters</small>
              </div>
            </footer>
          </article>

          <aside className="about-side">
            <div className="side-card">
              <div className="card-head">
                <h6>Optimization Score</h6>
                <span className="score">{optimizationData.score}%</span>
              </div>

              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${optimizationData.score}%` }}
                />
              </div>

              <ul>
                {optimizationData.items.map((item, index) => (
                  <li key={`${item.text}-${index}`} className={item.type === "warn" ? "warn" : ""}>
                    <i
                      className={`fa-solid ${
                        item.type === "warn"
                          ? "fa-circle-exclamation"
                          : "fa-circle-check"
                      }`}
                    />{" "}
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="side-card">
              <div className="card-head">
                <h6>Personality & Tone</h6>
              </div>

              {toneOptions.map((tone) => (
                <button
                  key={tone.id}
                  className={`tone-btn ${activeTone === tone.id ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveTone(tone.id)}
                >
                  <strong>{tone.title}</strong>
                  <small>{tone.subtitle}</small>
                </button>
              ))}
            </div>

            <div className="side-card">
              <div className="card-head">
                <h6>Skill Badges</h6>
                <small>Auto-detected</small>
              </div>

              <div className="skill-list">
                {skillBadges.length ? (
                  skillBadges.map((skill) => (
                    <span key={skill} className="skill">
                      <span>{skill}</span>
                      <button
                        type="button"
                        className="skill-remove-btn"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="skill">No skills detected yet</span>
                )}
              </div>

              <form
                className="skill-input-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  addCustomSkill();
                }}
              >
                <input
                  type="text"
                  placeholder="Add more skills..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                />
                <button type="submit" className="skill-add-btn">
                  Add
                </button>
              </form>
            </div>
          </aside>
        </section>

        <footer className="about-footer">
          <span className="ready-state">
            <i className="fa-solid fa-circle" /> Bio optimized and ready
          </span>

          <div className="footer-actions">
            <Link to="/dashboard" type="button" className="back-btn">
              <i className="fa-solid fa-arrow-left" /> Back
            </Link>
            <button type="button" className="next-btn" onClick={() => navigate("/theme")}>
              Next: Theme <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default About;

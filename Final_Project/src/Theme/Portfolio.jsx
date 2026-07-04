import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  normalizeGithubUsername,
  buildGithubAvatar,
  onImageFallback,
} from "../utils/github";
import "./theme.css";

function PortfolioNav({ brand, links, variant = "dark" }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className={`tpl-nav tpl-nav--${variant} ${open ? "tpl-nav--open" : ""}`}>
      <div className="tpl-nav__brand">{brand}</div>
      <button
        className="tpl-nav__burger"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span /><span /><span />
      </button>
      <ul className="tpl-nav__links" onClick={() => setOpen(false)}>
        {links.map(({ href, label }) => (
          <li key={href}><a href={href}>{label}</a></li>
        ))}
      </ul>
    </nav>
  );
}

const supportedThemes = new Set([
  "elite-glow",
  "aqua-glass",
  "cyberpunk",
  "obsidian-split",
  "next-level",
  "clean-manrope",
  "soft-creative",
  "arabic-modern",
  "professional",
  "theme-ten",
  "theme-eleven",
  "theme-twelve",
  "theme-thirteen",
  "theme-fourteen",
  "theme-fifteen",
  "karim-classic",
  "karim-blue",
  "karim-neon",
]);

const templateByTheme = {
  "elite-glow": "eliteGlow",
  "aqua-glass": "aquaGlass",
  cyberpunk: "cyberpunkPro",
  "obsidian-split": "obsidianSplit",
  "next-level": "nextLevel",
  "clean-manrope": "cleanManrope",
  "soft-creative": "softCreative",
  "arabic-modern": "arabicModern",
  professional: "professionalArabic",
  "theme-ten": "themeTen",
  "theme-eleven": "themeEleven",
  "theme-twelve": "themeTwelve",
  "theme-thirteen": "themeThirteen",
  "theme-fourteen": "themeFourteen",
  "theme-fifteen": "themeFifteen",
  "karim-classic": "karimClassic",
  "karim-blue": "karimBlue",
  "karim-neon": "karimNeon",
};

function buildCareerPathFromGithub({ profile, projects, skills }) {
  const items = [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeSkills = Array.isArray(skills) ? skills : [];

  if (profile?.public_repos) {
    items.push(`Manage and maintain ${profile.public_repos} public repositories on GitHub.`);
  }

  if (safeProjects.length) {
    items.push(`Deliver and showcase ${safeProjects.length} real projects from GitHub in the portfolio.`);
  }

  const languages = Array.from(new Set(safeProjects.map((repo) => repo?.language).filter(Boolean)));
  if (languages.length) {
    items.push(`Work across diverse technologies such as: ${languages.slice(0, 4).join(", ")}.`);
  }

  const stars = safeProjects.reduce((sum, repo) => sum + (repo?.stargazers_count || 0), 0);
  if (stars > 0) {
    items.push(`Improve open-source quality and accumulate at least ${stars} stars.`);
  }

  if (!items.length && safeSkills.length) {
    items.push(`Build interactive UI components using ${safeSkills.slice(0, 4).join(", ")}.`);
  }

  return items.slice(0, 4);
}

function AquaGlassTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  useEffect(() => {
    const handleScrollReveal = () => {
      const reveals = document.querySelectorAll(".aqua-reveal");
      for (let i = 0; i < reveals.length; i += 1) {
        const windowHeight = window.innerHeight;
        const revealTop = reveals[i].getBoundingClientRect().top;
        const revealPoint = 100;
        if (revealTop < windowHeight - revealPoint) {
          reveals[i].classList.add("active");
        }
      }
    };

    handleScrollReveal();
    window.addEventListener("scroll", handleScrollReveal);
    return () => window.removeEventListener("scroll", handleScrollReveal);
  }, []);

  const firstName = (name || "Alex").split(" ")[0] || "Alex";
  const restName = (name || "Developer").split(" ").slice(1).join(" ") || "Developer";
  const topSkills = (skills && skills.length ? skills : [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React.js",
    "Bootstrap",
    "PHP",
    "MySQL",
    "Git & GitHub",
  ]).slice(0, 8);
  const featuredProjects = projects.slice(0, 6);

  return (
    <main className="portfolio-template tpl-aqua-glass">
      <PortfolioNav
        brand={(name || "AN").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
        links={[
          { href: "#about", label: "About" },
          { href: "#skills", label: "Skills" },
          { href: "#projects", label: "Projects" },
        ]}
        variant="dark"
      />

      <section className="aqua-hero">
        <div>
          <img
            src={avatar || buildGithubAvatar(profile?.login)}
            alt="Profile avatar"
            onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
          />
          <h1>
            {firstName} <span>{restName}</span>
          </h1>
          <p>{roleLine || "Creative Full Stack Developer building modern and interactive web experiences."}</p>
          <a
            href={profile?.blog || profile?.html_url || "#"}
            target="_blank"
            rel="noreferrer"
            className="aqua-btn"
          >
            Download CV
          </a>

          <div className="aqua-social">
            <a href={profile?.html_url || "#"} target="_blank" rel="noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href={profile?.blog || "#"} target="_blank" rel="noreferrer" aria-label="Website">
              <i className="fa-solid fa-link"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="aqua-section aqua-reveal">
        <h2 className="aqua-section-title">About Me</h2>
        <div className="aqua-glass">
          <p>{about}</p>
        </div>
      </section>

      <section id="skills" className="aqua-section aqua-reveal">
        <h2 className="aqua-section-title">Skills</h2>
        <div className="aqua-skills">
          {topSkills.map((skill) => (
            <div className="aqua-glass aqua-skill" key={skill}>{skill}</div>
          ))}
        </div>
      </section>

      <section id="projects" className="aqua-section aqua-reveal">
        <h2 className="aqua-section-title">Projects</h2>
        <div className="aqua-projects">
          {featuredProjects.map((repo) => (
            <article className="aqua-glass aqua-project" key={repo.id || repo.name}>
              <img
                src={`https://opengraph.githubassets.com/1/${profile?.login || "github"}/${repo.name}`}
                alt={repo.name}
                loading="lazy"
                onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
              />
              <div className="aqua-project-head">
                <h3>{repo.name}</h3>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="aqua-project-link"
                >
                  <i className="fa-brands fa-github"></i> GitHub
                </a>
              </div>
              <p>{repo.description || "Modern project showcase with clean UI and solid engineering approach."}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="aqua-footer">
        © {new Date().getFullYear()} Created by eng Ahmed salah eldin | All Rights Reserved
      </footer>
    </main>
  );
}

function EliteGlowTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const featuredProjects = projects.slice(0, 6);
  const topSkills = (skills && skills.length ? skills : [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React.js",
    "Bootstrap",
    "PHP",
    "MySQL",
  ]).slice(0, 8);

  return (
    <main className="portfolio-template tpl-elite-glow">
      <PortfolioNav
        brand={(name || "DEV").split(" ")[0] || "Developer"}
        links={[
          { href: "#elite-skills", label: "Skills" },
          { href: "#elite-projects", label: "Projects" },
        ]}
        variant="dark"
      />

      <section className="elite-hero">
        <img
          src={avatar || buildGithubAvatar(profile?.login)}
          alt="Profile avatar"
          onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
        />
        <h1>{name}</h1>
        <p>{about || roleLine}</p>
        <a
          href={profile?.blog || profile?.html_url || "#"}
          target="_blank"
          rel="noreferrer"
          className="elite-btn"
        >
          Download CV
        </a>
      </section>

      <section id="elite-skills" className="elite-section">
        <h2 className="elite-section-title">Core Skills</h2>
        <div className="elite-skills">
          {topSkills.map((skill) => (
            <div className="elite-glass-card" key={skill}>{skill}</div>
          ))}
        </div>
      </section>

      <section id="elite-projects" className="elite-section">
        <h2 className="elite-section-title">Featured Projects</h2>
        <div className="elite-projects">
          {featuredProjects.map((repo) => (
            <article className="elite-project-card" key={repo.id || repo.name}>
              <img
                src={`https://opengraph.githubassets.com/1/${profile?.login || "github"}/${repo.name}`}
                alt={repo.name}
                loading="lazy"
                onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
              />
              <div className="elite-content">
                <h3>{repo.name}</h3>
                <p>{repo.description || "High-performance project built with clean architecture."}</p>
                <a href={repo.html_url} target="_blank" rel="noreferrer">View on GitHub</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="elite-footer">
        <h3>{name}</h3>
        <p>© {new Date().getFullYear()} Created by eng Ahmed salah eldin | All Rights Reserved</p>
      </footer>
    </main>
  );
}

function CyberpunkTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  useEffect(() => {
    const handleScrollReveal = () => {
      const reveals = document.querySelectorAll(".cyber-reveal");
      for (let i = 0; i < reveals.length; i += 1) {
        const windowHeight = window.innerHeight;
        const revealTop = reveals[i].getBoundingClientRect().top;
        const revealPoint = 100;
        if (revealTop < windowHeight - revealPoint) {
          reveals[i].classList.add("active");
        }
      }
    };

    handleScrollReveal();
    window.addEventListener("scroll", handleScrollReveal);
    return () => window.removeEventListener("scroll", handleScrollReveal);
  }, []);

  const topSkills = (skills && skills.length ? skills : [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Bootstrap",
    "PHP",
    "SQL",
    "Git & GitHub",
  ]).slice(0, 8);

  const featuredProjects = (projects && projects.length ? projects : []).slice(0, 6);
  const firstName = (name || "Alex").split(" ")[0] || "Alex";
  const restName = (name || "Developer").split(" ").slice(1).join(" ") || "Developer";

  return (
    <main className="portfolio-template tpl-cyberpunk-pro">
      <PortfolioNav
        brand={`${(name || "DEV").split(" ")[0] || "Developer"}.`}
        links={[
          { href: "#about", label: "About" },
          { href: "#skills", label: "Skills" },
          { href: "#projects", label: "Projects" },
        ]}
        variant="dark"
      />

      <section className="cyber-hero">
        <img
          src={avatar || buildGithubAvatar(profile?.login)}
          alt="Profile avatar"
          onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
        />
        <h1>
          I'm <span>{firstName} {restName}</span>
        </h1>
        <p>{roleLine || "Full-Stack Web Developer building modern and high-performance web applications."}</p>
        <a
          href={profile?.blog || profile?.html_url || "#"}
          target="_blank"
          rel="noreferrer"
          className="cyber-btn"
        >
          Download CV
        </a>
      </section>

      <section id="about" className="cyber-section cyber-about cyber-reveal">
        <h2 className="cyber-section-title">About Me</h2>
        <p>{about}</p>
      </section>

      <section id="skills" className="cyber-section cyber-reveal">
        <h2 className="cyber-section-title">Skills</h2>
        <div className="cyber-skills">
          {topSkills.map((skill) => (
            <div className="cyber-skill" key={skill}>{skill}</div>
          ))}
        </div>
      </section>

      <section id="projects" className="cyber-section cyber-reveal">
        <h2 className="cyber-section-title">Projects</h2>
        <div className="cyber-projects">
          {featuredProjects.map((repo) => (
            <article className="cyber-project-card" key={repo.id || repo.name}>
              <h3>{repo.name}</h3>
              <p>{repo.description || "Modern project built with clean architecture and strong UX focus."}</p>
              <a href={repo.html_url} target="_blank" rel="noreferrer" className="cyber-project-link">
                View on GitHub
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="cyber-footer">
        © {new Date().getFullYear()} Created by eng Ahmed salah eldin | All Rights Reserved
      </footer>
    </main>
  );
}

function ObsidianSplitTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const topSkills = (skills && skills.length ? skills : [
    "HTML / CSS",
    "JavaScript",
    "React",
    "Bootstrap",
    "PHP",
    "SQL",
    "Git & GitHub",
    "REST APIs",
  ]).slice(0, 8);
  const featuredProjects = (projects && projects.length ? projects : []).slice(0, 6);
  const nameParts = (name || "Alex Developer").split(" ");
  const firstName = nameParts[0] || "Alex";
  const restName = nameParts.slice(1).join(" ") || "Developer";

  return (
    <main className="portfolio-template tpl-obsidian-split">
      <PortfolioNav
        brand={firstName.toUpperCase()}
        links={[
          { href: "#about", label: "ABOUT" },
          { href: "#skills", label: "SKILLS" },
          { href: "#projects", label: "PROJECTS" },
        ]}
        variant="dark"
      />

      <section className="obs-hero">
        <div className="obs-hero-left">
          <h1>
            {firstName} <br />
            <span>{restName}</span>
          </h1>
          <p>{roleLine || "Full-Stack Developer crafting scalable products with clean architecture and modern UI."}</p>
          <a
            href="#projects"
            className="obs-btn"
          >
            View Projects
          </a>
        </div>

        <div className="obs-hero-right">
          <img
            src={avatar || buildGithubAvatar(profile?.login)}
            alt="Profile avatar"
            onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
          />
        </div>
      </section>

      <section id="about" className="obs-section">
        <div className="obs-section-title">ABOUT ME</div>
        <div className="obs-section-heading">Who I Am</div>
        <p>{about}</p>
      </section>

      <section id="skills" className="obs-section">
        <div className="obs-section-title">SKILLS</div>
        <div className="obs-section-heading">Tech Stack</div>
        <div className="obs-skills">
          {topSkills.map((skill) => (
            <div className="obs-skill" key={skill}>{skill}</div>
          ))}
        </div>
      </section>

      <section id="projects" className="obs-section">
        <div className="obs-section-title">PROJECTS</div>
        <div className="obs-section-heading">Selected Work</div>
        <div className="obs-projects">
          {featuredProjects.map((repo) => (
            <article className="obs-project" key={repo.id || repo.name}>
              <div>
                <h3>{repo.name}</h3>
                <p>{repo.description || "Scalable application built with product-focused architecture."}</p>
              </div>
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                {repo.language || "General"} • ★ {repo.stargazers_count || 0}
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="obs-footer">
        <div>© {new Date().getFullYear()} Created by eng Ahmed salah eldin </div>
        <div>{profile?.location || "| All Rights Reserved"}</div>
      </footer>
    </main>
  );
}

function NextLevelTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const [loading, setLoading] = useState(true);
  const [typedText, setTypedText] = useState("");
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const typingTarget = "Full-Stack Futuristic Developer";
  const topProjects = (projects && projects.length ? projects : []).slice(0, 3);
  const topSkills = (skills && skills.length ? skills : [
    "React",
    "JavaScript",
    "API Design",
    "UI Systems",
    "Performance",
    "GitHub",
  ]).slice(0, 6);

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => window.clearTimeout(loaderTimer);
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setTypedText(typingTarget.slice(0, index));
      if (index >= typingTarget.length) {
        window.clearInterval(interval);
      }
    }, 55);

    return () => window.clearInterval(interval);
  }, [typingTarget]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${event.clientX}px`;
        cursorRef.current.style.top = `${event.clientY}px`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${event.clientX}px`;
        glowRef.current.style.top = `${event.clientY}px`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="portfolio-template tpl-next-level">
      {loading && (
        <div className="next-loader" role="status" aria-live="polite">
          <h1>Loading Experience...</h1>
        </div>
      )}

      <div className="next-cursor" ref={cursorRef} />
      <div className="next-cursor-glow" ref={glowRef} />

      <div className="next-shape"></div>
      <div className="next-shape"></div>
      <div className="next-shape"></div>

      <PortfolioNav
        brand={(name || "Ahmed").split(" ")[0]}
        links={[
          { href: "#next-about", label: "About" },
          { href: "#next-projects", label: "Projects" },
        ]}
        variant="dark"
      />

      <section className="next-hero">
        <img
          src={avatar || buildGithubAvatar(profile?.login)}
          alt="Profile avatar"
          className="next-avatar"
          onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
        />
        <h1>{name}</h1>
        <div className="next-typing">{typedText}</div>
        <p>{roleLine || "Building immersive digital experiences with motion, interaction and futuristic UI design."}</p>
        <a href={profile?.html_url || "#"} target="_blank" rel="noreferrer" className="next-btn">
          Enter The Future
        </a>
      </section>

      <section id="next-about" className="next-section">
        <article className="next-card">
          <h2>Creative Developer</h2>
          <p>{about}</p>
        </article>
      </section>

      <section id="next-projects" className="next-section">
        <div className="next-card-grid">
          {topProjects.map((repo) => (
            <article className="next-card" key={repo.id || repo.name}>
              <h3>{repo.name}</h3>
              <small>{repo.language || "General"} • ★ {repo.stargazers_count || 0}</small>
              <p>{repo.description || "Interactive project focused on premium motion and frontend quality."}</p>
              <a href={repo.html_url} target="_blank" rel="noreferrer">Open Project</a>
            </article>
          ))}
        </div>
      </section>

      <section className="next-section">
        <div className="next-chip-row">
          {topSkills.map((skill) => (
            <span key={skill} className="next-chip">{skill}</span>
          ))}
        </div>
      </section>

      <footer className="next-footer">
        © {new Date().getFullYear()}  Created by eng Ahmed salah eldin | All Rights Reserved
      </footer>
    </main>
  );
}

function CleanManropeTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  useEffect(() => {
    const handleFadeIn = () => {
      const fades = document.querySelectorAll(".clean-fade");
      fades.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 120) {
          el.classList.add("show");
        }
      });
    };

    handleFadeIn();
    window.addEventListener("scroll", handleFadeIn);
    return () => window.removeEventListener("scroll", handleFadeIn);
  }, []);

  const topSkills = (skills && skills.length ? skills : [
    "HTML & CSS",
    "JavaScript",
    "React",
    "PHP",
    "SQL",
    "REST APIs",
    "Git & GitHub",
    "UI Architecture",
  ]).slice(0, 8);
  const topProjects = (projects && projects.length ? projects : []).slice(0, 6);

  return (
    <main className="portfolio-template tpl-clean-manrope">
      <PortfolioNav
        brand={name}
        links={[
          { href: "#clean-about", label: "About" },
          { href: "#clean-skills", label: "Skills" },
          { href: "#clean-projects", label: "Projects" },
        ]}
        variant="light"
      />

      <section className="clean-hero">
        <div className="clean-hero-text">
          <h1>
            Building <span className="clean-hero-accent">Modern</span><br />Web Experiences
          </h1>
          <p>{roleLine || "Full-Stack Developer focused on clean architecture, scalable systems and premium user interfaces."}</p>
          <a href="#clean-projects" className="clean-btn">View Projects</a>
        </div>

        <div className="clean-hero-img">
          <img
            src={avatar || buildGithubAvatar(profile?.login)}
            alt="Profile avatar"
            onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
          />
        </div>
      </section>

      <section id="clean-about" className="clean-section clean-fade">
        <div className="clean-section-top">
          <div>
            <h3>ABOUT</h3>
            <h2>Who I Am</h2>
          </div>
        </div>
        <div className="clean-about">
          <p>{about}</p>
        </div>
      </section>

      <section id="clean-skills" className="clean-section clean-fade">
        <div className="clean-section-top">
          <div>
            <h3>SKILLS</h3>
            <h2>Tech Stack</h2>
          </div>
        </div>
        <div className="clean-skills">
          {topSkills.map((skill) => (
            <div className="clean-skill" key={skill}>{skill}</div>
          ))}
        </div>
      </section>

      <section id="clean-projects" className="clean-section clean-fade">
        <div className="clean-section-top">
          <div>
            <h3>PROJECTS</h3>
            <h2>Selected Work</h2>
          </div>
        </div>
        <div className="clean-projects">
          {topProjects.map((repo) => (
            <article className="clean-project" key={repo.id || repo.name}>
              <div className="clean-project-head">
                <h4>{repo.name}</h4>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="clean-project-github"
                  aria-label={`View ${repo.name} on GitHub`}
                >
                  <i className="fa-brands fa-github" aria-hidden /> GitHub
                </a>
              </div>
              <p>{repo.description || "Performance-oriented project with clean UI and scalable structure."}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="clean-footer">
         © {new Date().getFullYear()}  Created by eng Ahmed salah eldin | All Rights Reserved
      </footer>
    </main>
  );
}

function SoftCreativeTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const topSkills = (skills && skills.length ? skills : [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "PHP",
    "UI/UX",
  ]).slice(0, 8);

  const topProjects = (projects && projects.length ? projects : [
    {
      name: "Nakresh Supplement",
      description: "Modern eCommerce website with responsive layout and interactive UI.",
      html_url: "#",
    },
    {
      name: "Portfolio Dashboard",
      description: "Dynamic dashboard connected with GitHub API to display real projects.",
      html_url: "#",
    },
    {
      name: "Creative Landing Page",
      description: "Art-inspired landing page with soft visuals and elegant layout.",
      html_url: "#",
    },
  ]).slice(0, 6);

  return (
    <main className="portfolio-template tpl-soft-creative">
      <PortfolioNav
        brand={name}
        links={[
          { href: "#soft-about", label: "About" },
          { href: "#soft-skills", label: "Skills" },
          { href: "#soft-projects", label: "Projects" },
        ]}
        variant="light"
      />

      <div className="soft-bg-shape soft-shape1" />
      <div className="soft-bg-shape soft-shape2" />
      <div className="soft-bg-shape soft-shape3" />

      <div className="soft-container">
        <section className="soft-hero">
          <img
            src={avatar || buildGithubAvatar(profile?.login)}
            alt="Profile avatar"
            onError={(e) => onImageFallback(e, buildGithubAvatar(profile?.login))}
          />
          <h1>{name}</h1>
          <p>
            {roleLine || "Creative Full-Stack Developer who loves building clean, artistic and modern web experiences. I focus on design details, soft colors, and smooth user interaction."}
          </p>
        </section>

        <section id="soft-about" className="soft-about-section">
          <h2 className="soft-section-title">About</h2>
          <p className="soft-about-text">{about || "Full-Stack Developer focused on clean architecture, scalable systems and premium user interfaces."}</p>
        </section>

        <h2 className="soft-section-title">Skills</h2>
        <section id="soft-skills" className="soft-skills">
          {topSkills.map((skill) => (
            <div className="soft-skill" key={skill}>{skill}</div>
          ))}
        </section>

        <h2 className="soft-section-title">Projects</h2>
        <section id="soft-projects" className="soft-projects">
          {topProjects.map((repo) => (
            <article className="soft-project" key={repo.id || repo.name}>
              <div className="soft-project-head">
                <h3>{repo.name}</h3>
                {repo.html_url && (
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="soft-project-github"
                    aria-label={`View ${repo.name} on GitHub`}
                  >
                    <i className="fa-brands fa-github" aria-hidden /> GitHub
                  </a>
                )}
              </div>
              <p>{repo.description || "Creative project generated from your selected GitHub repositories."}</p>
            </article>
          ))}
        </section>
      </div>

      <footer className="soft-footer">
        © {new Date().getFullYear()} All Rights Reserved | Designed by <span>eng Ahmed salah eldin</span>
      </footer>
    </main>
  );
}

function ArabicModernTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const topSkills = (skills && skills.length ? skills : [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
  ]).slice(0, 8);

  const topProjects = (projects && projects.length ? projects : [
    {
      name: "Project 1",
      html_url: "#",
    },
    {
      name: "Project 2",
      html_url: "#",
    },
    {
      name: "Project 3",
      html_url: "#",
    },
  ]).slice(0, 6);

  const displayRole = roleLine || "Front-End Developer";

  return (
    <main className="portfolio-template tpl-arabic-modern">
      <PortfolioNav
        brand={name}
        links={[
          { href: "#arabic-about", label: "About" },
          { href: "#arabic-skills", label: "Skills" },
          { href: "#arabic-projects", label: "Projects" },
        ]}
        variant="dark"
      />

      <header className="arabic-modern-hero">
        <img
          src={avatar || buildGithubAvatar(profile?.login)}
          alt={name}
          onError={(e) => onImageFallback(e, buildGithubAvatar(profile?.login))}
        />
        <h1>{name}</h1>
        <p>{displayRole}</p>
      </header>

      <section id="arabic-about" className="arabic-modern-section">
        <h2>About Me</h2>
        <p>
          {about ||
            "Frontend developer focused on modern products using HTML, CSS, JavaScript, and React."}
        </p>
      </section>

      <section id="arabic-skills" className="arabic-modern-section">
        <h2>Skills</h2>
        <div className="arabic-modern-skills">
          {topSkills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section id="arabic-projects" className="arabic-modern-section">
        <h2>Projects</h2>
        <div className="arabic-modern-projects">
          {topProjects.map((repo) => (
            <a
              key={repo.id || repo.name}
              href={repo.html_url || "#"}
              target="_blank"
              rel="noreferrer"
            >
              {repo.name || "Project"}
            </a>
          ))}
        </div>
      </section>

      <footer className="arabic-modern-footer">
         © {new Date().getFullYear()}  Created by eng Ahmed salah eldin | All Rights Reserved
      </footer>
    </main>
  );
}

function ProfessionalArabicTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const topSkills = (skills && skills.length ? skills : [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "UI/UX Design",
  ]).slice(0, 8);

  const topProjects = (projects && projects.length ? projects : [
    { name: "Project One", html_url: "#" },
    { name: "Project Two", html_url: "#" },
    { name: "Project Three", html_url: "#" },
    { name: "Project Four", html_url: "#" },
  ]).slice(0, 8);

  const displayRole = roleLine || "Professional Web Developer & UI/UX Designer";

  return (
    <main className="portfolio-template tpl-professional-arabic">
      <PortfolioNav
        brand={name}
        links={[
          { href: "#pro-about", label: "About" },
          { href: "#pro-skills", label: "Skills" },
          { href: "#pro-projects", label: "Projects" },
        ]}
        variant="light"
      />

      <header className="pro-arabic-hero">
        <div className="pro-arabic-hero-inner">
          <div className="pro-arabic-hero-text">
            <h1>{name}</h1>
            <p>{displayRole}</p>
          </div>
          <div className="pro-arabic-hero-avatar">
            <img
              src={avatar || buildGithubAvatar(profile?.login)}
              alt={name}
              onError={(e) => onImageFallback(e, buildGithubAvatar(profile?.login))}
            />
          </div>
        </div>
      </header>

      <section id="pro-about" className="pro-arabic-section">
        <h2>About Me</h2>
        <div className="pro-about-container">
          <div className="about-text">
            <p>
              {about || "I am a web developer specialized in building modern websites with polished UI and smooth UX. I enjoy combining design and engineering to ship practical products."}
            </p>
          </div>
          <div className="about-image">
            <img
              src={avatar || buildGithubAvatar(profile?.login)}
              alt={name}
              onError={(e) => onImageFallback(e, buildGithubAvatar(profile?.login))}
            />
          </div>
        </div>
      </section>

      <section id="pro-skills" className="pro-arabic-section">
        <h2>Skills</h2>
        <div className="pro-skills-container">
          <div className="skills-image">
            <img
              src={avatar || buildGithubAvatar(profile?.login)}
              alt="Skills"
              onError={(e) => onImageFallback(e, buildGithubAvatar(profile?.login))}
            />
          </div>
          <div className="skills-text">
            {topSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="pro-projects" className="pro-arabic-section">
        <h2>Projects</h2>
        <div className="pro-projects-grid">
          {topProjects.map((repo) => (
            <article key={repo.id || repo.name} className="pro-project-card">
              <p>{repo.name || "Project"}</p>
              <a
                href={repo.html_url || "#"}
                target="_blank"
                rel="noreferrer"
              >
                View Project
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="pro-arabic-footer">
         © {new Date().getFullYear()}  Created by eng Ahmed salah eldin | All Rights Reserved
      </footer>
    </main>
  );
}

function ThemeTenTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const topSkills = (skills && skills.length ? skills : [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "PHP",
    "SQL",
  ]).slice(0, 8);

  const topProjects = (projects && projects.length ? projects : [
    {
      name: "Nakresh Supplement",
      description: "Storefront and dashboard for supplements with a clean shopping flow.",
      html_url: "#",
    },
    {
      name: "Portfolio Site",
      description: "Dynamic personal portfolio with modern UI and project-focused layout.",
      html_url: "#",
    },
    {
      name: "Restaurant Website",
      description: "Restaurant website with interactive menu and reservation flow.",
      html_url: "#",
    },
    {
      name: "Blog Platform",
      description: "Content publishing platform with author and post management.",
      html_url: "#",
    },
  ]).slice(0, 4);

  const displayRole = roleLine || "Full-Stack Web Developer";
  const displayAbout = about || "I am a Full-Stack web developer focused on building complete web applications with strong UI quality and maintainable backend architecture.";
  const navBrand = (name || "AN")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="portfolio-template tpl-theme-ten" lang="en">
      <PortfolioNav
        brand={navBrand}
        links={[
          { href: "#theme10-about", label: "About" },
          { href: "#theme10-skills", label: "Skills" },
          { href: "#theme10-projects", label: "Projects" },
        ]}
        variant="dark"
      />

      <header className="theme10-header">
        <div className="theme10-header-left">
          <h1>{name}</h1>
          <span>{displayRole}</span>
        </div>
        <div className="theme10-profile-img">
          <img
            src={avatar || buildGithubAvatar(profile?.login)}
            alt={name}
            onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
          />
        </div>
      </header>

      <section id="theme10-about" className="theme10-about">
        <div className="theme10-about-text">
          <h2>About Me</h2>
          <p>{displayAbout}</p>
        </div>
        <img
          src={avatar || buildGithubAvatar(profile?.login)}
          alt={`About ${name}`}
          onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
        />
      </section>

      <section id="theme10-skills" className="theme10-section">
        <h2>Skills</h2>
        <div className="theme10-skills-grid">
          {topSkills.map((skill) => (
            <article key={skill} className="theme10-skill-card">
              <h3>{skill}</h3>
              <p>Hands-on experience delivering modern, production-ready solutions.</p>
            </article>
          ))}
        </div>
      </section>

      <section id="theme10-projects" className="theme10-section">
        <h2>Projects</h2>
        <div className="theme10-projects-grid">
          {topProjects.map((repo) => (
            <article key={repo.id || repo.name} className="theme10-project-card">
              <h4>{repo.name}</h4>
              <p>{repo.description || "A polished project built with strong attention to product detail and usability."}</p>
              <a href={repo.html_url || "#"} target="_blank" rel="noreferrer">View Project</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="theme10-footer">
        <p>
           © {new Date().getFullYear()}  Created by eng Ahmed salah eldin 
          {" | "}
          <a href={profile?.html_url || "#"} target="_blank" rel="noreferrer">GitHub</a>
          {" | "}
          <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
          {" | "}
          <a href="#" target="_blank" rel="noreferrer">Twitter</a>
        </p>
      </footer>
    </main>
  );
}

function ThemeElevenTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const topSkills = (skills && skills.length ? skills : [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React",
    "Responsive Design",
    "UI/UX",
    "Git & GitHub",
    "Performance",
  ]).slice(0, 8);

  const topProjects = (projects && projects.length ? projects : []).slice(0, 4);
  const displayRole = roleLine || "Front-End Developer - I build elegant and fast user experiences.";
  const displayAbout = about || "Frontend developer focused on details, performance, and premium modern interfaces.";
  const careerPath = buildCareerPathFromGithub({ profile, projects, skills });
  useEffect(() => {
    const navLinks = document.querySelectorAll(".theme11-nav-links a");
    const pill = document.querySelector(".theme11-pill");
    if (!pill || !navLinks.length) return undefined;

    const movePill = (anchor) => {
      if (!anchor || !pill) return;
      const rect = anchor.getBoundingClientRect();
      const parentRect = anchor.parentElement?.getBoundingClientRect();
      if (!parentRect) return;
      pill.style.width = `${rect.width}px`;
      pill.style.transform = `translateX(${rect.left - parentRect.left}px)`;
    };

    movePill(navLinks[0]);

    const enterHandlers = [];
    const clickHandlers = [];
    navLinks.forEach((link) => {
      const onEnter = () => movePill(link);
      const onClick = () => movePill(link);
      link.addEventListener("mouseenter", onEnter);
      link.addEventListener("click", onClick);
      enterHandlers.push([link, onEnter]);
      clickHandlers.push([link, onClick]);
    });

    const onResize = () => movePill(navLinks[0]);
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(([link, handler]) => link.removeEventListener("mouseenter", handler));
      clickHandlers.forEach(([link, handler]) => link.removeEventListener("click", handler));
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <main className="portfolio-template tpl-theme-eleven" lang="en" dir="ltr">
      <nav className="theme11-nav">
        <div className="theme11-nav-inner">
          <div className="theme11-brand">
            <div className="theme11-brand-badge">✦</div>
            <div>{name}</div>
          </div>

          <ul className="theme11-nav-links">
            <div className="theme11-pill" />
            <li><a href="#theme11-home">Home</a></li>
            <li><a href="#theme11-about">About</a></li>
            <li><a href="#theme11-skills">Skills</a></li>
            <li><a href="#theme11-contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      <header id="theme11-home" className="theme11-header">
        <div className="theme11-container theme11-hero">
          <div>
            <div className="theme11-kicker"><span className="theme11-dot" /> Front-End Developer</div>
            <h1>I'm <span>{name}</span></h1>
            <p className="theme11-role">{displayRole}</p>
            <div className="theme11-cta">
              <a className="theme11-btn theme11-btn-primary" href="#theme11-contact">Contact Me</a>
              <a className="theme11-btn theme11-btn-ghost" href="#theme11-about">Learn More</a>
            </div>
          </div>

          <div className="theme11-photo-wrap">
            <div className="theme11-blob" />
            <div className="theme11-ring" />
            <div className="theme11-photo">
              <img
                src={avatar || buildGithubAvatar(profile?.login)}
                alt={name}
                onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
              />
            </div>
          </div>
        </div>
      </header>

      <section id="theme11-about" className="theme11-section">
        <div className="theme11-container theme11-grid2">
          <article className={`theme11-card ${!careerPath.length ? "theme11-card--full" : ""}`}>
            <h2>About Me</h2>
            <p>{displayAbout}</p>
          </article>
          {!!careerPath.length && (
            <article className="theme11-card">
              <h2>Career Path</h2>
              <p>
                {careerPath.map((item, index) => (
                  <React.Fragment key={`${item}-${index}`}>
                    - {item}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </article>
          )}
        </div>
      </section>

      <section id="theme11-skills" className="theme11-section">
        <div className="theme11-container">
          <article className="theme11-card">
            <h2>Skills</h2>
            <p>Core technologies and tools I use regularly:</p>
            <div className="theme11-skills">
              {topSkills.map((skill) => (
                <span key={skill} className="theme11-chip">{skill}</span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="theme11-contact" className="theme11-section">
        <div className="theme11-container">
          <article className="theme11-card">
            <h2>Contact</h2>
            <p>
              Email: <strong>ahmednakresh827@gmail.com</strong>
              <br />
              GitHub: <a href={profile?.html_url || "#"} target="_blank" rel="noreferrer">{profile?.html_url || "Add your GitHub link here"}</a>
            </p>
            {!!topProjects.length && (
              <div className="theme11-project-links">
                {topProjects.map((repo) => (
                  <a key={repo.id || repo.name} href={repo.html_url || "#"} target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>

      <footer className="theme11-footer"> © {new Date().getFullYear()}  Created by eng Ahmed salah eldin | All Rights Reserved</footer>
    </main>
  );
}

function ThemeTwelveTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const topSkills = (skills && skills.length ? skills : [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React",
    "Animations",
    "UI/UX",
    "Git & GitHub",
    "Performance",
  ]).slice(0, 8);

  const topProjects = (projects && projects.length ? projects : []).slice(0, 4);
  const displayRole = roleLine || "Front-End Developer creating fast, premium and eye-catching interfaces.";
  const displayAbout = about || "I transform ideas into interactive UI experiences with strong focus on motion, accessibility, and performance.";
  const careerPath = buildCareerPathFromGithub({ profile, projects, skills });
  useEffect(() => {
    const root = document.querySelector(".tpl-theme-twelve");
    if (!root) return undefined;

    const canvas = root.querySelector(".theme12-stars");
    const ctx = canvas?.getContext("2d");
    let stars = [];
    let width = 0;
    let height = 0;
    let frameId = 0;

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const count = Math.min(160, Math.floor((width * height) / 15000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;
        star.tw += 0.02;

        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;
        if (star.y < -10) star.y = height + 10;
        if (star.y > height + 10) star.y = -10;

        const alpha = 0.35 + (0.35 * Math.sin(star.tw));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
      frameId = window.requestAnimationFrame(draw);
    };

    const revealEls = root.querySelectorAll(".theme12-reveal");
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => revealObserver.observe(el));

    const navLinks = [...root.querySelectorAll(".theme12-links a")];
    const sections = navLinks
      .map((a) => root.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    const pill = root.querySelector(".theme12-active-pill");

    const movePillTo = (anchor) => {
      if (!anchor || !pill) return;
      const rect = anchor.getBoundingClientRect();
      const parentRect = anchor.parentElement?.getBoundingClientRect();
      if (!parentRect) return;
      const right = parentRect.right - rect.right + 6;
      pill.style.width = `${rect.width}px`;
      pill.style.transform = `translateX(${-right}px)`;
    };

    const setActiveByScroll = () => {
      if (!sections.length || !navLinks.length) return;
      const y = window.scrollY + 140;
      let current = sections[0].id;
      sections.forEach((section) => {
        if (section.offsetTop <= y) current = section.id;
      });
      const active = navLinks.find((a) => a.dataset.target === current) || navLinks[0];
      movePillTo(active);
    };

    if (canvas && ctx) {
      resize();
      draw();
      window.addEventListener("resize", resize);
    }

    if (navLinks.length && pill) {
      movePillTo(navLinks[0]);
      setActiveByScroll();
      navLinks.forEach((a) => {
        a.addEventListener("mouseenter", () => movePillTo(a));
        a.addEventListener("click", () => window.setTimeout(setActiveByScroll, 200));
      });
      window.addEventListener("scroll", setActiveByScroll);
      window.addEventListener("resize", setActiveByScroll);
    }

    const skillsWrap = root.querySelector(".theme12-skills");
    const onSkillClick = (event) => {
      const chip = event.target.closest(".theme12-chip");
      if (!chip) return;
      chip.animate(
        [
          { transform: "translateY(0) scale(1)" },
          { transform: "translateY(-6px) scale(1.08)" },
          { transform: "translateY(0) scale(1)" },
        ],
        { duration: 420, easing: "cubic-bezier(.2,.9,.2,1)" }
      );
    };

    if (skillsWrap) skillsWrap.addEventListener("click", onSkillClick);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (canvas && ctx) window.removeEventListener("resize", resize);
      revealObserver.disconnect();
      window.removeEventListener("scroll", setActiveByScroll);
      window.removeEventListener("resize", setActiveByScroll);
      if (skillsWrap) skillsWrap.removeEventListener("click", onSkillClick);
    };
  }, []);

  return (
    <main className="portfolio-template tpl-theme-twelve" lang="en" dir="ltr">
      <div className="theme12-aurora" />
      <canvas className="theme12-stars" />

      <nav className="theme12-nav">
        <div className="theme12-nav-inner theme12-container">
          <div className="theme12-brand">
            <div className="theme12-logo" />
            <div><b>{(name || "Ahmed").split(" ")[0]}</b> {(name || "Nakresh").split(" ").slice(1).join(" ")}</div>
          </div>

          <ul className="theme12-links">
            <div className="theme12-active-pill" />
            <li><a href="#theme12-home" data-target="theme12-home">Home</a></li>
            <li><a href="#theme12-about" data-target="theme12-about">About</a></li>
            <li><a href="#theme12-skills" data-target="theme12-skills">Skills</a></li>
            <li><a href="#theme12-contact" data-target="theme12-contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      <header id="theme12-home" className="theme12-header">
        <div className="theme12-container theme12-hero">
          <div>
            <div className="theme12-badge theme12-reveal">
              <span className="theme12-spark" />
              <span>Neon Portfolio</span>
            </div>

            <h1 className="theme12-reveal">
              I'm <span className="theme12-gradient-name">{name}</span>
            </h1>

            <p className="theme12-role theme12-reveal">
              {displayRole}
            </p>

            <div className="theme12-cta theme12-reveal">
              <a className="theme12-btn theme12-btn-primary" href="#theme12-contact">Let's Work Together</a>
              <a className="theme12-btn theme12-btn-ghost" href="#theme12-skills">View Skills</a>
            </div>
          </div>

          <div className="theme12-orb-wrap theme12-reveal">
            <div className="theme12-orb" />
            <div className="theme12-photo">
              <img
                src={avatar || buildGithubAvatar(profile?.login)}
                alt={name}
                onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
              />
            </div>
          </div>
        </div>
      </header>

      <section id="theme12-about" className="theme12-section">
        <div className="theme12-container theme12-grid2">
          <article className={`theme12-card theme12-reveal ${!careerPath.length ? "theme12-card--full" : ""}`}>
            <h2 className="theme12-title">About Me</h2>
            <p className="theme12-text">{displayAbout}</p>
          </article>

          {!!careerPath.length && (
            <article className="theme12-card theme12-reveal">
              <h2 className="theme12-title">Career Path</h2>
              <p className="theme12-text">
                {careerPath.map((item, index) => (
                  <React.Fragment key={`${item}-${index}`}>
                    - {item}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </article>
          )}
        </div>
      </section>

      <section id="theme12-skills" className="theme12-section">
        <div className="theme12-container">
          <article className="theme12-card theme12-reveal">
            <h2 className="theme12-title">Skills</h2>
            <p className="theme12-text">Hover over skills and explore the interaction effects.</p>
            <div className="theme12-skills">
              {topSkills.map((skill) => (
                <div className="theme12-chip" key={skill}><span>{skill}</span></div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="theme12-contact" className="theme12-section">
        <div className="theme12-container">
          <article className="theme12-card theme12-reveal">
            <h2 className="theme12-title">Contact</h2>
            <p className="theme12-text">
              Email: <b className="theme12-email">ahmednakresh827@gmail.com</b>
              <br />
              GitHub: <a href={profile?.html_url || "#"} target="_blank" rel="noreferrer">{profile?.html_url || "Add your GitHub link here"}</a>
            </p>
            {!!topProjects.length && (
              <div className="theme12-project-links">
                {topProjects.map((repo) => (
                  <a key={repo.id || repo.name} href={repo.html_url || "#"} target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>

      <footer className="theme12-footer"> © {new Date().getFullYear()}  Created by eng Ahmed salah eldin | All Rights Reserved</footer>
    </main>
  );
}

function ThemeThirteenTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const topSkills = (skills && skills.length ? skills : [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React",
    "UI/UX Design",
    "Creative Coding",
  ]).slice(0, 8);
  const topProjects = (projects && projects.length ? projects : []).slice(0, 6);

  const displayRole = roleLine || "Frontend Developer | UI Creative Designer";
  const displayAbout = about || "Passionate developer focused on creating unique, modern, and visually striking web interfaces.";
  return (
    <main className="portfolio-template tpl-theme-thirteen" lang="en" dir="ltr">
      <nav className="theme13-nav">
        <h2>MY PORTFOLIO</h2>
        <ul>
          <li><a href="#theme13-home">Home</a></li>
          <li><a href="#theme13-about">About</a></li>
          <li><a href="#theme13-skills">Skills</a></li>
          <li><a href="#theme13-projects">Projects</a></li>
          <li><a href="#theme13-contact">Contact</a></li>
        </ul>
      </nav>

      <section className="theme13-hero" id="theme13-home">
        <div className="theme13-hero-text">
          <h1>{name}</h1>
          <h3>{displayRole}</h3>
          <p>
            I craft rare digital experiences with bold colors and futuristic layouts. My goal is to build designs
            people remember the first time they see them.
          </p>
        </div>
        <div className="theme13-hero-image">
          <img
            src={avatar || buildGithubAvatar(profile?.login)}
            alt={`${name} profile`}
            onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
          />
        </div>
      </section>

      <section id="theme13-about">
        <div className="theme13-about">
          <h2>About Me</h2>
          <p>{displayAbout}</p>
        </div>
      </section>

      <section id="theme13-skills">
        <div className="theme13-skills">
          <h2>Skills</h2>
          <div className="theme13-skills-list">
            {topSkills.map((skill) => (
              <div key={skill} className="theme13-skill">{skill}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="theme13-projects">
        <div className="theme13-projects">
          <h2>Projects</h2>
          <div className="theme13-projects-list">
            {topProjects.map((repo) => (
              <article key={repo.id || repo.name} className="theme13-project-card">
                <h3>{repo.name}</h3>
                <small>{repo.language || "General"} • ★ {repo.stargazers_count || 0}</small>
                <p>{repo.description || "A featured project selected from GitHub repositories."}</p>
                <a href={repo.html_url || "#"} target="_blank" rel="noreferrer">View Project</a>
              </article>
            ))}
            {!topProjects.length && (
              <article className="theme13-project-card">
                <h3>No Projects Yet</h3>
                <p>Select repositories in the Projects step to display them here.</p>
              </article>
            )}
          </div>
        </div>
      </section>

      <footer id="theme13-contact" className="theme13-footer">
         © {new Date().getFullYear()}  Created by eng Ahmed salah eldin | All Rights Reserved
      </footer>
    </main>
  );
}

function ThemeFourteenTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const topSkills = (skills && skills.length ? skills : [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "UI/UX",
    "Git",
  ]).slice(0, 10);
  const topProjects = (projects && projects.length ? projects : []).slice(0, 6);
  const displayRole = roleLine || "Frontend Developer | Creative Coder";
  const displayAbout = about || "Passionate developer focused on building modern, high-performance web applications.";
  const initials = (name || "AN")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="portfolio-template tpl-theme-fourteen" lang="en" dir="ltr">
      <nav className="theme14-nav">
        <h2>{initials}</h2>
        <ul>
          <li><a href="#theme14-home">Home</a></li>
          <li><a href="#theme14-about">About</a></li>
          <li><a href="#theme14-skills">Skills</a></li>
          <li><a href="#theme14-projects">Projects</a></li>
        </ul>
      </nav>

      <section className="theme14-hero" id="theme14-home">
        <div className="theme14-hero-text">
          <h1>{name}</h1>
          <h3>{displayRole}</h3>
          <p>I craft visually immersive and interactive digital experiences with modern web technologies.</p>
        </div>
        <div className="theme14-image-wrapper">
          <img
            src={avatar || buildGithubAvatar(profile?.login)}
            alt={`${name} profile`}
            onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
          />
        </div>
      </section>

      <section className="theme14-about" id="theme14-about">
        <h2>About Me</h2>
        <p>{displayAbout}</p>
      </section>

      <section id="theme14-skills">
        <h2>Skills</h2>
        <div className="theme14-skills-container">
          {topSkills.map((skill) => (
            <div key={skill} className="theme14-skill">{skill}</div>
          ))}
        </div>
      </section>

      <section id="theme14-projects">
        <h2>Projects</h2>
        <div className="theme14-projects-grid">
          {topProjects.map((repo, index) => (
            <article key={repo.id || repo.name} className={`theme14-project-card ${index % 2 === 0 ? "odd" : "even"}`}>
              <h3>{repo.name}</h3>
              <small>{repo.language || "General"} • ★ {repo.stargazers_count || 0}</small>
              <p>{repo.description || "Modern project with dynamic interface and clean component architecture."}</p>
              <a href={repo.html_url || "#"} target="_blank" rel="noreferrer">Open Project</a>
            </article>
          ))}
          {!topProjects.length && (
            <article className="theme14-project-card odd">
              <h3>No Projects Yet</h3>
              <p>Select repositories in the Projects step to render them in this theme.</p>
            </article>
          )}
        </div>
      </section>

      <footer className="theme14-footer">
        <p> © {new Date().getFullYear()}  Created by eng Ahmed salah eldin | All Rights Reserved</p>
      </footer>
    </main>
  );
}

function ThemeFifteenTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const topSkills = (skills && skills.length ? skills : [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Responsive UI",
    "Git",
  ]).slice(0, 10);
  const topProjects = (projects && projects.length ? projects : []).slice(0, 6);
  const displayRole = roleLine || "Frontend Developer • Creative UI";
  const displayAbout = about || "I build clean, fast, and delightful web interfaces with strong attention to detail.";

  return (
    <main className="portfolio-template tpl-theme-fifteen" lang="en" dir="ltr">
      <div className="theme15-blob one" />
      <div className="theme15-blob two" />

      <nav className="theme15-nav">
        <div className="theme15-wrap theme15-nav-inner">
          <div className="theme15-brand"><span className="theme15-dot" /><span>{(name || "Ahmed").split(" ")[0]}</span></div>
          <ul className="theme15-links">
            <li><a href="#theme15-home">Home</a></li>
            <li><a href="#theme15-about">About</a></li>
            <li><a href="#theme15-skills">Skills</a></li>
            <li><a href="#theme15-projects">Projects</a></li>
          </ul>
          <button
            type="button"
            className="theme15-btn"
            onClick={() => document.querySelector("#theme15-projects")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Work
          </button>
        </div>
      </nav>

      <div className="theme15-wrap">
        <section id="theme15-home">
          <div className="theme15-hero">
            <div className="theme15-card">
              <h1 className="theme15-title">{name}</h1>
              <p className="theme15-muted theme15-strong">{displayRole}</p>
              <p className="theme15-muted theme15-intro">
                I write clean code and craft friendly, fast interfaces. I focus on the small details that make a design
                feel polished and practical at the same time.
              </p>
              <div className="theme15-hero-actions">
                <button
                  type="button"
                  className="theme15-btn"
                  onClick={() => document.querySelector("#theme15-about")?.scrollIntoView({ behavior: "smooth" })}
                >
                  About Me
                </button>
                <a className="theme15-ghost" href={profile?.html_url || "#"} target="_blank" rel="noreferrer">GitHub / CV</a>
              </div>
            </div>

            <div className="theme15-card theme15-avatar-card" aria-label="profile">
              <img
                className="theme15-avatar"
                src={avatar || buildGithubAvatar(profile?.login)}
                alt={`${name} photo`}
                onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))}
              />
              <div className="theme15-sticker">Available for projects</div>
            </div>
          </div>
        </section>

        <section id="theme15-about">
          <div className="theme15-card">
            <h2>About Me</h2>
            <p className="theme15-muted">{displayAbout}</p>
          </div>
        </section>

        <section id="theme15-skills">
          <div className="theme15-card">
            <h2>Skills</h2>
            <div className="theme15-skills">
              {topSkills.map((skill) => (
                <span key={skill} className="theme15-tag">{skill}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="theme15-projects">
          <div className="theme15-card">
            <h2>Projects</h2>
            <div className="theme15-projects">
              {topProjects.map((repo) => (
                <article className="theme15-proj" key={repo.id || repo.name}>
                  <div className="theme15-proj-name">{repo.name}</div>
                  <div className="theme15-proj-meta">{repo.description || "Clean and modern project with practical UX patterns."}</div>
                  <a href={repo.html_url || "#"} target="_blank" rel="noreferrer">Open Project</a>
                </article>
              ))}
              {!topProjects.length && (
                <article className="theme15-proj">
                  <div className="theme15-proj-name">No Projects Yet</div>
                  <div className="theme15-proj-meta">Select repositories in the Projects step to display them here.</div>
                </article>
              )}
            </div>
          </div>
        </section>

        <footer className="theme15-footer">
          <div className="theme15-card theme15-footer-inner">
             © {new Date().getFullYear()}  Created by eng Ahmed salah eldin | All Rights Reserved.
          </div>
        </footer>
      </div>
    </main>
  );
}

function KarimClassicTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const topSkills = (skills.length ? skills : ["Web Design", "Web Development", "JavaScript Development", "Responsive Design", "UI Implementation", "Front-end React"]).slice(0, 6);
  const featured = projects.length ? projects.slice(0, 3) : [
    { name: "Mealify-project", description: "A modern responsive restaurant landing page with clean sections and smooth user experience.", language: "HTML" },
    { name: "Portfolio Website", description: "Personal portfolio built with HTML, CSS, Bootstrap and JavaScript.", language: "Bootstrap" },
    { name: "Bookmark", description: "A bookmarker app with validation and localStorage persistence.", language: "JavaScript" },
  ];

  return (
    <main className="portfolio-template tpl-karim-classic">
      <nav className="kc-nav">
        <a href="#home" className="kc-brand">{name || "Karim AbuElmaati"}</a>
        <div className="kc-links"><a href="#home">Home</a><a href="#about">About</a><a href="#skills">Skills</a><a href="#contact">Contact</a></div>
      </nav>
      <section id="home" className="kc-hero">
        <div className="kc-hero-inner">
          <h5>Hello</h5>
          <h1><span>I AM</span> <b>{name || "Karim AbuElmaati"}</b></h1>
          <div className="kc-socials">
            <a href={profile?.html_url || "#"} aria-label="GitHub"><i className="fa-brands fa-github" /></a>
            <a href={profile?.blog || "#"} aria-label="LinkedIn"><i className="fa-brands fa-linkedin" /></a>
            <a href="#contact" aria-label="Contact"><i className="fa-solid fa-envelope" /></a>
          </div>
        </div>
      </section>
      <section id="about" className="kc-about">
        <div className="kc-about-img-wrap"><div className="kc-dots" /><img src={avatar} alt={name} onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))} /></div>
        <div className="kc-about-copy">
          <h2>About Me.</h2><span>{roleLine || "Front-End Developer"}</span><p>{about}</p>
          <div className="kc-buttons"><a href={profile?.html_url || "#"} target="_blank" rel="noreferrer">Download C.V</a><a href="#contact">Contact Me</a></div>
        </div>
      </section>
      <section id="skills" className="kc-services">
        <h2>Skills.</h2>
        <div className="kc-service-grid">
          {topSkills.map((skill, index) => (
            <article key={skill} className="kc-service-box">
              <span><i className={`fa-solid ${["fa-briefcase", "fa-list-check", "fa-chart-simple", "fa-binoculars", "fa-sun", "fa-calendar-week"][index] || "fa-code"}`} /></span>
              <h3>{skill}</h3><p>I build clean, responsive, user-friendly interfaces with strong attention to layout, behavior, and performance.</p>
            </article>
          ))}
        </div>
      </section>
      <section id="projects" className="kc-projects">
        <h2>My Projects</h2><p>Some of my recent work</p>
        <div className="kc-project-grid">
          {featured.map((project) => (
            <article key={project.id || project.name} className="kc-project-card">
              <h3>{project.name}</h3><p>{project.description || "Responsive project generated from your GitHub repository."}</p>
              <div><a href={project.html_url || "#"} target="_blank" rel="noreferrer">Live Demo</a><a href={profile?.html_url || "#"} target="_blank" rel="noreferrer">GitHub</a></div>
            </article>
          ))}
        </div>
      </section>
      <section id="contact" className="kc-contact">
        <h2>Contact Me.</h2>
        <div className="kc-contact-grid">
          <div><i className="fa-solid fa-location-arrow" /><h3>Address</h3><p>{profile?.location || "Mansoura / Egypt"}</p></div>
          <div><i className="fa-solid fa-envelope" /><h3>Email</h3><p>{profile?.email || "portfolio@example.com"}</p></div>
          <div><i className="fa-brands fa-github" /><h3>GitHub</h3><p>{profile?.login || "github"}</p></div>
        </div>
      </section>
      <footer className="kc-footer">Copy Right {new Date().getFullYear()} &copy; By {name || "Portfolio"} All Rights Reserved</footer>
    </main>
  );
}

function KarimBlueTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const featured = projects.length ? projects.slice(0, 3) : [
    { name: "Mealify-project", description: "A modern responsive restaurant landing page built using HTML and CSS.", language: "HTML" },
    { name: "Portfolio Website", description: "Personal portfolio built with HTML, CSS, Bootstrap and JavaScript.", language: "CSS" },
    { name: "Bookmark", description: "A bookmarker app that saves, visits, and deletes favorite websites.", language: "JavaScript" },
  ];

  return (
    <main className="portfolio-template tpl-karim-blue">
      <nav className="kb-nav"><a href="#home">KARIM-ELSAYED</a><div><a href="#home">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#projects">Portfolio</a><a href="#contact">Contact</a></div></nav>
      <section id="home" className="kb-hero">
        <div className="kb-hero-copy"><h1>Hi, I'm <span>{name || "KARIM ELSAYED"}</span></h1><h3>{roleLine || "Front-End Developer"}</h3><p>{about}</p><a href="#projects">View Work</a></div>
        <img src={avatar} alt={name} onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))} />
      </section>
      <section id="about" className="kb-about">
        <img src={avatar} alt={name} onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))} />
        <div><h2>About Me</h2><p>{about}</p><div className="kb-skill-row">{(skills.length ? skills : ["HTML", "CSS", "JavaScript", "Bootstrap", "React"]).slice(0, 6).map((skill) => <span key={skill}>{skill}</span>)}</div></div>
      </section>
      <section id="services" className="kb-services">
        <h2>My Services</h2>
        <div className="kb-service-grid">
          {[["fa-mobile-screen", "Responsive Web Design"], ["fa-screwdriver-wrench", "Bug Fixing & UI Improvements"], ["fa-bolt", "Website Optimization"]].map(([icon, title]) => (
            <article key={title}><i className={`fa-solid ${icon}`} /><h3>{title}</h3><p>I create smooth, responsive, high-performance web interfaces with a strong focus on user experience.</p></article>
          ))}
        </div>
      </section>
      <section id="projects" className="kb-projects">
        <h2>My Projects</h2><p>Some of my recent work</p>
        <div className="kb-project-grid">
          {featured.map((project) => (
            <article key={project.id || project.name}><h3>{project.name}</h3><p>{project.description || "Responsive project generated from your GitHub repository."}</p><div><a href={project.html_url || "#"} target="_blank" rel="noreferrer">Live Demo</a><a href={profile?.html_url || "#"} target="_blank" rel="noreferrer">GitHub</a></div></article>
          ))}
        </div>
      </section>
      <section id="contact" className="kb-contact"><h2>Contact Me.</h2><div className="kb-contact-grid"><div><i className="fa-solid fa-location-arrow" /><h3>Address</h3><p>{profile?.location || "Mansoura / Egypt"}</p></div><div><i className="fa-solid fa-envelope" /><h3>Email</h3><p>{profile?.email || "portfolio@example.com"}</p></div><div><i className="fa-brands fa-github" /><h3>GitHub</h3><p>{profile?.login || "github"}</p></div></div></section>
      <footer className="kb-footer">© {new Date().getFullYear()} My Portfolio</footer>
    </main>
  );
}

function KarimNeonTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  const skillList = (skills.length ? skills : ["HTML5", "CSS3", "JavaScript", "Bootstrap", "SCSS / SASS", "Figma", "Git & GitHub", "REST APIs", "Responsive Design", "UI / UX"]).slice(0, 10);
  const featured = projects.length ? projects.slice(0, 4) : [
    { name: "Analytics Dashboard", description: "Real-time data visualization dashboard with live charts and dark mode.", language: "JavaScript" },
    { name: "E-Commerce UI", description: "Fully responsive storefront with cart drawer and animated filters.", language: "CSS" },
    { name: "Dev Blog Platform", description: "Markdown-powered blog with tag filtering and dark mode support.", language: "Node.js" },
    { name: "Agency Landing Page", description: "Scroll-animated marketing site with parallax sections.", language: "Bootstrap" },
  ];

  return (
    <main className="portfolio-template tpl-karim-neon">
      <nav className="kn-nav"><a href="#hero" className="kn-logo">{name || "Karim ABuElmaati"}</a><div className="kn-links"><a href="#about">About</a><a href="#projects">Work</a><a href="#services">Services</a><a href="#contact">Contact</a></div><a href="#contact" className="kn-cta">Hire Me</a></nav>
      <section id="hero" className="kn-hero">
        <div className="kn-blob kn-blob1" /><div className="kn-blob kn-blob2" /><div className="kn-blob kn-blob3" />
        <div className="kn-hero-content"><div className="kn-tag">Available for new projects</div><h1>I Design<br /><span>&amp; Build</span><br /><em>Interfaces.</em></h1><p>{roleLine || "Frontend Developer crafting bold, high-performance web experiences."}</p><div className="kn-actions"><a href="#projects">View My Work</a><a href="#contact">Let's Talk →</a></div></div>
        <div className="kn-marquee"><div>{[...skillList, ...skillList].map((skill, index) => <span key={`${skill}-${index}`}>{skill} <b>✦</b></span>)}</div></div>
      </section>
      <section id="about" className="kn-about">
        <div className="kn-photo">{avatar ? <img src={avatar} alt={name} onError={(event) => onImageFallback(event, buildGithubAvatar(profile?.login))} /> : <span>{(name || "Karim").slice(0, 5)}</span>}<strong>6+<small>Projects Done</small></strong><em>Open to Work</em></div>
        <div><span className="kn-label">About Me</span><h2>Code with<br /><b>intention.</b></h2><p>{about}</p><div className="kn-skills">{skillList.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
      </section>
      <section id="projects" className="kn-projects">
        <div className="kn-section-head"><div><span className="kn-label">Selected Work</span><h2>Recent Projects</h2></div><a href="#contact">All Projects →</a></div>
        <div className="kn-project-grid">{featured.map((project, index) => <article key={project.id || project.name} className={`kn-project-card span-${index}`}><div className={`kn-thumb kn-thumb-${index + 1}`}><span>{String(project.name || "WORK").slice(0, 4).toUpperCase()}</span><a href={project.html_url || "#"} target="_blank" rel="noreferrer">View Project ↗</a></div><div className="kn-project-body"><div className="kn-tags"><span>{project.language || "Web App"}</span><span>Bootstrap</span></div><h3>{project.name} <b>↗</b></h3><p>{project.description || "Responsive project generated from your GitHub repository."}</p></div></article>)}</div>
      </section>
      <section id="services" className="kn-services"><span className="kn-label">What I Do</span><h2>Services I<br /><b>Offer.</b></h2><div className="kn-service-grid">{["UI Development", "Interactive JS", "Responsive Design", "Performance & SEO"].map((service, index) => <article key={service}><span>{["🎨", "⚡", "📱", "🚀"][index]}</span><h3>{service}</h3><p>Complete frontend solutions that look sharp and perform smoothly across all devices.</p></article>)}</div></section>
      <section id="contact" className="kn-contact"><span className="kn-label">Get In Touch</span><h2>Let's Build<br />Something <em>Great.</em></h2><p>Have a project in mind or want to collaborate? I'm currently open to new opportunities.</p><a href={`mailto:${profile?.email || "portfolio@example.com"}`}>{profile?.email || "portfolio@example.com"}</a><div><a href={profile?.html_url || "#"} target="_blank" rel="noreferrer">GitHub</a><a href={profile?.blog || "#"} target="_blank" rel="noreferrer">LinkedIn</a><a href="#contact">Email Me</a></div></section>
      <footer className="kn-footer"><p>© {new Date().getFullYear()} {name || "Portfolio"}. Built with HTML, CSS, Bootstrap & JS.</p><div><a href="#about">About</a><a href="#projects">Work</a><a href="#services">Services</a><a href="#contact">Contact</a></div><a href="#hero">Back to Top ↑</a></footer>
    </main>
  );
}

function ProjectGrid({ projects, className = "v2-grid" }) {
  return (
    <div className={className}>
      {projects.map((repo) => (
        <article key={repo.id || repo.name} className="v2-project-card">
          <h4>{repo.name}</h4>
          <small>
            {repo.language || "General"} • ★ {repo.stargazers_count || 0}
          </small>
          <p>{repo.description || "Project generated from selected repositories."}</p>
          <a href={repo.html_url} target="_blank" rel="noreferrer">
            Open Repo
          </a>
        </article>
      ))}
    </div>
  );
}

function NeonTemplate({ name, roleLine, about, avatar, projects, skills }) {
  return (
    <main className="portfolio-template tpl-neon v2-shell">
      <section className="v2-neon-hero">
        <div>
          <p className="v2-eyebrow">AI Portfolio</p>
          <h1>{name}</h1>
          <p className="v2-role">{roleLine}</p>
          <div className="v2-chip-row">
            {skills.slice(0, 6).map((skill) => (
              <span key={skill} className="v2-chip">{skill}</span>
            ))}
          </div>
        </div>
        {avatar && <img src={avatar} alt="avatar" className="v2-avatar-lg" onError={(event) => onImageFallback(event)} />}
      </section>

      <section className="v2-panel">
        <h3>About Me</h3>
        <p>{about}</p>
      </section>

      <section className="v2-panel">
        <h3>Featured Projects</h3>
        <ProjectGrid projects={projects} />
      </section>
    </main>
  );
}

function ProfessionalTemplate({ name, roleLine, about, avatar, projects, profile, skills }) {
  return (
    <main className="portfolio-template tpl-pro v2-shell">
      <aside className="v2-side-panel">
        {avatar && <img src={avatar} alt="avatar" className="v2-avatar-xl" onError={(event) => onImageFallback(event)} />}
        <h2>{name}</h2>
        <p>{roleLine}</p>

        <div className="v2-stat-grid">
          <div><strong>{profile?.public_repos || 0}</strong><span>Repos</span></div>
          <div><strong>{profile?.followers || 0}</strong><span>Followers</span></div>
          <div><strong>{projects.length}</strong><span>Selected</span></div>
        </div>

        <div className="v2-chip-row">
          {skills.slice(0, 10).map((skill) => (
            <span key={skill} className="v2-chip">{skill}</span>
          ))}
        </div>
      </aside>

      <section className="v2-main-stack">
        <section className="v2-panel">
          <h3>Professional Summary</h3>
          <p>{about}</p>
        </section>
        <section className="v2-panel">
          <h3>Project Portfolio</h3>
          <ProjectGrid projects={projects} />
        </section>
      </section>
    </main>
  );
}

function MagazineTemplate({ name, roleLine, about, avatar, projects, skills }) {
  const [first, ...rest] = projects;

  return (
    <main className="portfolio-template tpl-magazine v2-shell">
      <section className="v2-mag-cover">
        <div>
          <p className="v2-eyebrow">Creative Developer</p>
          <h1>{name}</h1>
          <p className="v2-role">{roleLine}</p>
        </div>
        {avatar && <img src={avatar} alt="avatar" className="v2-avatar-lg" onError={(event) => onImageFallback(event)} />}
      </section>

      <section className="v2-mag-layout">
        <article className="v2-panel v2-about-block">
          <h3>About</h3>
          <p>{about}</p>
          <div className="v2-chip-row">
            {skills.slice(0, 8).map((skill) => (
              <span key={skill} className="v2-chip">{skill}</span>
            ))}
          </div>
        </article>

        {first && (
          <article className="v2-panel v2-featured-block">
            <h4>{first.name}</h4>
            <small>{first.language || "General"} • ★ {first.stargazers_count || 0}</small>
            <p>{first.description || "Flagship project generated from selected repositories."}</p>
            <a href={first.html_url} target="_blank" rel="noreferrer">View Case</a>
          </article>
        )}

        {rest.slice(0, 3).map((repo) => (
          <article key={repo.id || repo.name} className="v2-panel v2-mini-block">
            <h4>{repo.name}</h4>
            <p>{repo.description || "Selected project from GitHub profile."}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function TerminalTemplate({ name, roleLine, about, projects, skills, profile }) {
  return (
    <main className="portfolio-template tpl-terminal v2-shell">
      <section className="v2-terminal-block">
        <p>$ whoami</p>
        <h1>{name}</h1>
        <p>{roleLine}</p>
      </section>

      <section className="v2-terminal-block">
        <p>$ cat about.md</p>
        <p>{about}</p>
      </section>

      <section className="v2-terminal-block">
        <p>$ ls skills</p>
        <div className="v2-chip-row">
          {skills.slice(0, 12).map((skill) => (
            <span key={skill} className="v2-chip">{skill}</span>
          ))}
        </div>
      </section>

      <section className="v2-terminal-block">
        <p>$ tree projects/</p>
        <ProjectGrid projects={projects} className="v2-grid v2-terminal-grid" />
      </section>

      <footer className="v2-terminal-footer">
        <span>{profile?.location || "Remote"}</span>
        <span>{profile?.company || "Independent"}</span>
        <span>{profile?.blog || "No website"}</span>
      </footer>
    </main>
  );
}

function EditorialTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  return (
    <main className="portfolio-template tpl-editorial v2-shell">
      <section className="v2-ed-left">
        <header className="v2-ed-nav">
          <strong>{name}</strong>
          <nav>
            <span>HOME</span>
            <span>WORK</span>
            <span>ABOUT</span>
            <span>CONTACT</span>
          </nav>
        </header>

        <section className="v2-ed-hero">
          <div className="v2-ed-title">
            <h1>{name}</h1>
            <h2>{roleLine}</h2>
            <p>{about}</p>
          </div>
          {avatar && <img src={avatar} alt="avatar" className="v2-ed-avatar" onError={(event) => onImageFallback(event)} />}
        </section>

        <section className="v2-ed-skills">
          {skills.slice(0, 10).map((skill) => (
            <span key={skill} className="v2-chip">{skill}</span>
          ))}
        </section>
      </section>

      <section className="v2-ed-right">
        <h3>CASE STUDIES</h3>
        {projects.map((repo) => (
          <article className="v2-ed-case" key={repo.id || repo.name}>
            <div className="v2-ed-thumb">{(repo.name || "P").slice(0, 1).toUpperCase()}</div>
            <div>
              <h4>{repo.name}</h4>
              <small>{repo.language || "General"} • ★ {repo.stargazers_count || 0}</small>
              <p>{repo.description || "A product-focused case study built from selected GitHub work."}</p>
              <a href={repo.html_url} target="_blank" rel="noreferrer">Learn more</a>
            </div>
          </article>
        ))}

        <footer className="v2-ed-footer">
          <span>{profile?.location || "Remote"}</span>
          <span>{profile?.blog || profile?.html_url || "Portfolio"}</span>
        </footer>
      </section>
    </main>
  );
}

function ArabicTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  return (
    <main className="portfolio-template tpl-arabic v2-shell" dir="ltr">
      <header className="v2-ar-top">
        <strong>{name}</strong>
        <nav>
          <span>Home</span>
          <span>About</span>
          <span>Projects</span>
          <span>Contact</span>
        </nav>
      </header>

      <section className="v2-ar-main">
        <article className="v2-ar-profile">
          {avatar && <img src={avatar} alt="avatar" className="v2-avatar-xl" onError={(event) => onImageFallback(event)} />}
          <h1>{name}</h1>
          <h2>{roleLine}</h2>
          <p>{about}</p>
          <div className="v2-chip-row">
            {skills.slice(0, 10).map((skill) => (
              <span key={skill} className="v2-chip">{skill}</span>
            ))}
          </div>
        </article>

        <article className="v2-ar-projects">
          <h3>Featured Projects</h3>
          <div className="v2-ar-grid">
            {projects.map((repo) => (
              <article key={repo.id || repo.name} className="v2-ar-card">
                <h4>{repo.name}</h4>
                <small>{repo.language || "General"} • ★ {repo.stargazers_count || 0}</small>
                <p>{repo.description || "A selected GitHub project showcased in this portfolio."}</p>
                <a href={repo.html_url} target="_blank" rel="noreferrer">View Project</a>
              </article>
            ))}
          </div>
        </article>
      </section>

      <footer className="v2-ar-footer">
        <span>{profile?.company || "Freelancer"}</span>
        <span>{profile?.location || "Remote"}</span>
      </footer>
    </main>
  );
}

function CorporateTemplate({ name, roleLine, about, projects, profile, skills }) {
  return (
    <main className="portfolio-template tpl-corporate v2-shell">
      <section className="v2-corp-hero">
        <h1>{name}</h1>
        <p>{roleLine}</p>
      </section>

      <section className="v2-corp-kpis">
        <article><strong>{profile?.public_repos || 0}</strong><span>Total Repos</span></article>
        <article><strong>{projects.length}</strong><span>Selected Projects</span></article>
        <article><strong>{skills.length}</strong><span>Skills</span></article>
      </section>

      <section className="v2-corp-two-col">
        <article className="v2-panel">
          <h3>Executive Summary</h3>
          <p>{about}</p>
        </article>
        <article className="v2-panel">
          <h3>Technology Stack</h3>
          <div className="v2-chip-row">
            {skills.slice(0, 14).map((skill) => (
              <span key={skill} className="v2-chip">{skill}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="v2-panel">
        <h3>Project Pipeline</h3>
        <ProjectGrid projects={projects} />
      </section>
    </main>
  );
}

function ClassicTemplate({ name, roleLine, about, avatar, projects, skills, profile }) {
  return (
    <main className="portfolio-template tpl-classic v2-shell">
      <header className="v2-classic-header">
        <div>
          <h1>{name}</h1>
          <p>{roleLine}</p>
        </div>
        {avatar && <img src={avatar} alt="avatar" className="v2-avatar-lg" onError={(event) => onImageFallback(event)} />}
      </header>

      <section className="v2-classic-sections">
        <article className="v2-panel">
          <h3>About</h3>
          <p>{about}</p>
        </article>
        <article className="v2-panel">
          <h3>Skills</h3>
          <div className="v2-chip-row">
            {skills.slice(0, 12).map((skill) => (
              <span key={skill} className="v2-chip">{skill}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="v2-panel">
        <h3>Projects</h3>
        <ProjectGrid projects={projects} />
      </section>

      <footer className="v2-classic-footer">
        <span>{profile?.location || "Remote"}</span>
        <span>{profile?.blog || profile?.html_url || "Portfolio"}</span>
      </footer>
    </main>
  );
}

const TEMPLATE_COMPONENTS = {
  neon: NeonTemplate,
  aquaGlass: AquaGlassTemplate,
  eliteGlow: EliteGlowTemplate,
  cyberpunkPro: CyberpunkTemplate,
  obsidianSplit: ObsidianSplitTemplate,
  nextLevel: NextLevelTemplate,
  cleanManrope: CleanManropeTemplate,
  softCreative: SoftCreativeTemplate,
  arabicModern: ArabicModernTemplate,
  professionalArabic: ProfessionalArabicTemplate,
  themeTen: ThemeTenTemplate,
  themeEleven: ThemeElevenTemplate,
  themeTwelve: ThemeTwelveTemplate,
  themeThirteen: ThemeThirteenTemplate,
  themeFourteen: ThemeFourteenTemplate,
  themeFifteen: ThemeFifteenTemplate,
  karimClassic: KarimClassicTemplate,
  karimBlue: KarimBlueTemplate,
  karimNeon: KarimNeonTemplate,
  pro: ProfessionalTemplate,
  magazine: MagazineTemplate,
  terminal: TerminalTemplate,
  editorial: EditorialTemplate,
  arabic: ArabicTemplate,
  corporate: CorporateTemplate,
  classic: ClassicTemplate,
};

export function PortfolioTemplatePreview({
  activeTheme,
  name,
  roleLine,
  about,
  avatar,
  projects,
  skills,
  profile,
}) {
  const safeTheme = supportedThemes.has(activeTheme) ? activeTheme : "aqua-glass";
  const templateKind = templateByTheme[safeTheme] || "aquaGlass";
  const TemplateComponent = TEMPLATE_COMPONENTS[templateKind];

  if (!TemplateComponent) return null;

  return (
    <div className={`portfolio-page-shell preview-only theme-${safeTheme}`}>
      <TemplateComponent
        name={name}
        roleLine={roleLine}
        about={about}
        avatar={avatar}
        projects={Array.isArray(projects) ? projects : []}
        skills={Array.isArray(skills) ? skills : []}
        profile={profile}
      />
    </div>
  );
}

function PortfolioPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isPublishMode = params.get("mode") === "publish";
  const isPreviewMode = params.get("mode") === "preview";
  const shouldAutoPrint = params.get("autoprint") === "1";
  const requestedTheme = params.get("theme") || localStorage.getItem("portfolio_theme") || "aqua-glass";
  const activeTheme = supportedThemes.has(requestedTheme) ? requestedTheme : "aqua-glass";
  const templateKind = templateByTheme[activeTheme] || "neon";

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const username = normalizeGithubUsername(
    userData?.github || userData?.githubUsername || "github"
  );
  const displayName = userData?.fullName || userData?.name || "Alex";
  const selectedProjects = JSON.parse(localStorage.getItem("selectedProjects") || "[]");

  const customSkills = JSON.parse(localStorage.getItem(`about_custom_skills_${username}`) || "[]");
  const removedSkills = JSON.parse(localStorage.getItem(`about_removed_skills_${username}`) || "[]");

  const aboutText =
    localStorage.getItem(`about_bio_${username}`) ||
    localStorage.getItem("about_bio") ||
    "Full Stack Engineer passionate about building performant products.";

  const [githubProfile, setGithubProfile] = useState(null);
  const [githubRepos, setGithubRepos] = useState(() => {
    const repoKeys = [
      `github_repos_${username}`,
      "github_repos",
      "repos_cache",
      "repos",
    ];

    for (const key of repoKeys) {
      try {
        const cached = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(cached) && cached.length) return cached;
      } catch {
        // ignore invalid cache
      }
    }

    return [];
  });

  useEffect(() => {
    const handleLocalAnchorClick = (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || !link.closest(".portfolio-page-shell")) return;

      const sectionId = link.getAttribute("href")?.slice(1);
      if (!sectionId) {
        event.preventDefault();
        return;
      }

      const target = document.getElementById(sectionId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    document.addEventListener("click", handleLocalAnchorClick);
    return () => document.removeEventListener("click", handleLocalAnchorClick);
  }, []);

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

        const repoKeys = [
          `github_repos_${username}`,
          "github_repos",
          "repos_cache",
          "repos",
        ];

        for (const key of repoKeys) {
          try {
            const cached = JSON.parse(localStorage.getItem(key) || "[]");
            if (Array.isArray(cached) && cached.length) {
              setGithubRepos(cached);
              break;
            }
          } catch {
            // ignore invalid cache
          }
        }
      }
    }

    loadGithubData();
    return () => {
      mounted = false;
    };
  }, [username]);

  useEffect(() => {
    if (!isPublishMode || !shouldAutoPrint) return;
    const timer = window.setTimeout(() => {
      window.print();
    }, 450);
    return () => window.clearTimeout(timer);
  }, [isPublishMode, shouldAutoPrint]);

  const projects = (() => {
    if (!githubRepos.length) return [];
    const selected = githubRepos.filter((repo) => selectedProjects.includes(repo.name));
    if (selected.length) return selected.slice(0, 8);
    return githubRepos.slice(0, 8);
  })();

  const skills = (() => {
    const langs = Array.from(new Set(githubRepos.map((repo) => repo.language))).filter(Boolean);
    const map = new Map();
    [...langs, ...customSkills].forEach((skill) => {
      const clean = String(skill || "").trim();
      if (!clean) return;
      const key = clean.toLowerCase();
      if (!map.has(key) && !removedSkills.includes(key)) map.set(key, clean);
    });
    return Array.from(map.values());
  })();

  const roleLine = githubProfile?.bio || "Full Stack Engineer // AI Enthusiast";
  const avatarSrc = githubProfile?.avatar_url || buildGithubAvatar(username);

  function handleSavePdf() {
    window.print();
  }

  return (
    <div className={`portfolio-page-shell theme-${activeTheme} ${isPublishMode ? "publish-only" : ""} ${isPreviewMode ? "preview-only" : ""}`}>
      {!isPublishMode && !isPreviewMode && (
        <header className="portfolio-topbar no-print">
          <div>
            <strong>Portfolio Preview</strong>
            <small> Theme: {activeTheme}</small>
          </div>
          <div className="portfolio-topbar-actions">
            <Link to="/theme" className="theme-back-link">Back to Theme</Link>
            <button type="button" className="theme-finish-btn" onClick={handleSavePdf}>
              Save as PDF
            </button>
          </div>
        </header>
      )}

      {(() => {
        const TemplateComponent = TEMPLATE_COMPONENTS[templateKind];
        const templateProps = {
          name: displayName,
          roleLine,
          about: aboutText,
          avatar: avatarSrc,
          projects,
          skills,
          profile: githubProfile,
        };
        return TemplateComponent ? <TemplateComponent {...templateProps} /> : null;
      })()}
    </div>
  );
}

export default PortfolioPage;

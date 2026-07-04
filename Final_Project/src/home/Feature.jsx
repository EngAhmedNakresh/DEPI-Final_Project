import React from "react";
import { useNavigate } from "react-router-dom";
import "./feature.css";

export default function Feature() {
  return (
    // سكشن المميزات الرئيسي. قيمة id مستخدمة في روابط النافبار داخل الهوم.
    <div className="landing-root" id="feature">
      {/* شريط أسماء وهمية يعطي إحساس أن المنتج موثوق ومستخدم من جهات مختلفة. */}
      <nav className="navbar landing-nav rounded-4  py-3 flex-wrap justify-content-around gap-3 gap-md-5">
        <span className="nav-item"> <i className="fa fa-code"></i> TechCorp</span>
        <span className="nav-item"><i className="fa-solid fa-box"></i> DevStudio</span>
        <span className="nav-item">🔗 OpenSource</span>
        <span className="nav-item"><i className="fa fa-terminal"></i> TerminalUI</span>
      </nav>

      {/* عنوان السكشن الذي يقدم كروت المميزات الموجودة بالأسفل. */}
      <section className="text-center hero-section container">
        <h1 className="hero-title">Everything you need to showcase your work</h1>
        <p className="hero-subtitle">
          We bridge the gap between your code and your future employer. No lorem ipsum, just real projects.
        </p>
      </section>

      {/* شبكة متجاوبة من Bootstrap تحتوي على كروت المميزات الثلاثة. */}
      <section className="container features-section ">
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-4">
            {/* يشرح ميزة مزامنة مشاريع GitHub تلقائيا. */}
            <FeatureCard
              icon="🔄"
              title="Auto-Sync Repos"
              description="Connect your GitHub account and we'll automatically parse your starred and pinned repositories to find your best work."
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            {/* يشرح كيف يحول الذكاء الاصطناعي الشغل التقني إلى قصة مفهومة للتوظيف. */}
            <FeatureCard
              icon="✨"
              title="AI Storytelling"
              description="Our LLM analyzes your READMEs and commits to rewrite technical jargon into compelling case studies for recruiters."
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            {/* يشرح جزء التخصيص بدون كتابة كود. */}
            <FeatureCard
              icon="🧩"
              title="No-Code Builder"
              description="Customize the look and feel with a drag-and-drop interface. Change themes, layouts, and fonts without writing CSS."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// كومبوننت كارت قابل لإعادة الاستخدام داخل شبكة المميزات.
function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card h-100">
      {/* الرمز البصري الخاص بالميزة. */}
      <div className="feature-icon">{icon}</div>

      {/* اسم الميزة. */}
      <h3>{title}</h3>

      {/* شرح مختصر للميزة. */}
      <p>{description}</p>
    </div>
  );
}


/* ================= سكشن المطورين ================= */

export function DeveloperSection() {
  return (
    // سكشن يشرح لماذا المنتج مناسب للمطورين. قيمة id مستخدمة في روابط النافبار.
    <section className="dev-section container-fluid" id="work">
      <div className="container">
        <div className="row align-items-center">
          {/* العمود الشمال: شرح نصي وقائمة المميزات. */}
          <div className="col-md-6 dev-left">
            {/* العنوان الرئيسي لسكشن طريقة العمل للمطورين. */}
            <h2 className="dev-title">
              Built for developers,<br />
              <span>by developers.</span>
            </h2>

            {/* فقرة قصيرة تربط المنتج بأدوات وطريقة تفكير المطورين. */}
            <p className="dev-desc">
              You focus on the logic, we handle the presentation. PortfolioGenie speaks
              your language Markdown, Git, and JSON.
            </p>

            {/* قائمة بأهم مميزات طريقة الاستخدام. */}
            <div className="dev-features">
              {/* ميزة: المستخدم يرى البورتفوليو مباشرة أثناء التعديل. */}
              <div className="dev-feature">
                <span className="check-icon">✓</span>
                <div className="feature-text">
                  <strong>Live Preview</strong>
                  <p>See your portfolio update instantly as you make changes.</p>
                </div>
              </div>

              {/* ميزة: المستخدم يستطيع نشر البورتفوليو على دومين خاص. */}
              <div className="dev-feature">
                <span className="check-icon">✓</span>
                <div className="feature-text">
                  <strong>Custom Domain</strong>
                  <p>Use your own domain name to look more professional.</p>
                </div>
              </div>

              {/* ميزة: المحتوى الناتج يكون جاهزا أكثر للظهور في محركات البحث. */}
              <div className="dev-feature">
                <span className="check-icon">✓</span>
                <div className="feature-text">
                  <strong>SEO Optimized</strong>
                  <p>Built-in optimization to help recruiters find you faster.</p>
                </div>
              </div>
            </div>
          </div>

          {/* العمود اليمين: شكل نافذة كود للعرض البصري فقط. */}
          <div className="col-md-6">
            <div className="code-window">
              {/* هيدر محرر كود وهمي يحتوي على نقاط النافذة واسم الملف. */}
              <div className="code-header">
                <div className="window-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="file-name">config.js</span>
              </div>

              {/* كود ثابت للعرض فقط كتشبيه لفكرة إعداد البورتفوليو. */}
              <pre className="code-content">
                <span className="keyword">import</span> {'{ Portfolio }'} <span className="keyword">from</span> <span className="string">'@genie/core'</span>;<br />
                <br />
                <span className="keyword">const</span> config = {'{'}<br />
                &nbsp;&nbsp;theme: <span className="string">'cyber-dark'</span>,<br />
                &nbsp;&nbsp;source: <span className="string">'github'</span>,<br />
                &nbsp;&nbsp;username: <span className="string">'dev_wizard'</span>,<br />
                &nbsp;&nbsp;ai_enhanced: <span className="boolean">true</span>,<br />
                &nbsp;&nbsp;sections: [<span className="string">'hero'</span>, <span className="string">'projects'</span>, <span className="string">'skills'</span>]<br />
                {'};'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= سكشن الدعوة للتسجيل ================= */

export function CTASection() {
  // هوك من React Router يستخدم لنقل المستخدم إلى صفحة التسجيل عند الضغط.
  const navigate = useNavigate();

  return (
    // آخر سكشن دعوة لاتخاذ إجراء. قيمة id مستخدمة في رابط Pricing داخل النافبار.
    <section className="cta-section glow-bg" id="Pricing">
      {/* طبقات إضاءة زخرفية خلف كارت الدعوة للتسجيل. */}
      <span className="orb orb-1"></span>
      <span className="orb orb-2"></span>
      <span className="orb orb-3"></span>

      {/* كارت في المنتصف يشجع الزائر على البدء. */}
      <div className="cta-card">
        {/* عنوان الدعوة للتسجيل. */}
        <h2 className="hero-title">Ready to level up your career?</h2>

        {/* نص داعم يوضح سبب البدء. */}
        <p>
          Join thousands of developers who have landed their dream jobs with a
          portfolio that actually represents their skills.
        </p>

        {/* زر الدعوة الرئيسي: ينقل المستخدم لصفحة التسجيل بدون إعادة تحميل التطبيق. */}
        <button
          type="button"
          className="btn CTA-btn py-2 px-4"
          onClick={() => navigate("/signup")}
        >
          <i className="fa-solid fa-rocket"></i> Start Building for Free
        </button>

        {/* نص صغير لطمأنة المستخدم أسفل الزر. */}
        <small>No credit card required. Free tier forever.</small>
      </div>
    </section>
  );
}

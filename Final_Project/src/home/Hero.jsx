import React, { useEffect } from "react";

function Hero() {
  // يضيف حركة ميلان ثلاثية الأبعاد بسيطة للكارت حسب حركة الماوس.
  useEffect(() => {
    const handleMouseMove = (e) => {
      // نحول مكان الماوس إلى قيم دوران صغيرة.
      const x = (window.innerWidth / 2 - e.pageX) / 40;
      const y = (window.innerHeight / 2 - e.pageY) / 40;

      // كارت المعاينة هو شكل المتصفح الوهمي الموجود يمين الهيرو.
      const previewCard = document.querySelector(".browser-card");
      if (previewCard) {
        previewCard.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
      }
    };

    // نضيف مستمع حركة الماوس عند ظهور الكومبوننت.
    window.addEventListener("mousemove", handleMouseMove);

    // نحذف المستمع عند الخروج من الصفحة حتى لا يحدث استهلاك زائد للذاكرة.
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    // الهيرو هو أول سكشن رئيسي يظهر في صفحة الهوم.
    <section className="hero glow-bg">

      {/* طبقات إضاءة زخرفية خلف محتوى الهيرو. */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* حاوية Bootstrap تجعل محتوى الهيرو في المنتصف ومتجاوب مع الشاشات. */}
      <div className="container hero-wrapper">
        <div className="row align-items-center">

          {/* العمود الشمال: الرسالة التسويقية والأزرار الأساسية. */}
          <div className="col-lg-6 text-light hero-left">
            {/* شارة صغيرة فوق العنوان الرئيسي. */}
            <div className="badge-live">● AI V2.0 Now Live</div>

            {/* العنوان الرئيسي الذي يوضح قيمة المنتج. */}
            <h1 className="hero-title">
              Your Code,<br />
              <span>Your Story,</span><br />
              Your Portfolio.
            </h1>

            {/* وصف قصير يشرح وظيفة PortfolioGenie. */}
            <p className="hero-text">
              Stop wasting time fighting CSS frameworks. Let our AI analyze your GitHub repositories and generate a hire-ready portfolio in seconds.
            </p>

            {/* أزرار الإجراءات الأساسية: مزامنة GitHub ومشاهدة أمثلة. */}
            <div className="hero-buttons">
              <a href="https://github.com/EngAhmedNakresh" target="_blank" className="btn-primary-glow">
                <i className="fa-brands fa-github"></i> Sync with GitHub
              </a>
              <a href="https://themewagon.com/theme-tag/portfolio-template/" target="_blank" className="btn-secondary-dark">
                View Examples
              </a>
            </div>
          </div>

          {/* العمود اليمين: معاينة على شكل متصفح توضح شكل البورتفوليو الناتج. */}
          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className="browser-card">

              {/* شريط المتصفح العلوي: النقاط الملونة والرابط الوهمي. */}
              <div className="browser-top">
                <div className="dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="fake-url">
                  portfolio-genie.dev/johndoe
                </div>
              </div>

              {/* معاينة بيانات البروفايل: الصورة، الاسم، الوظيفة، والتقنيات. */}
              <div className="profile-section">
                <div className="avatar">
                  <img src={`${import.meta.env.BASE_URL}img/me.png`} alt="Ahmed Salah el-din" />
                </div>
                <div>
                  <h4>Ahmed Salah el-din</h4>
                  <p className="role">Full Stack Web Developer</p>
                  <div className="tech-stack">
                    <span>React</span>
                    <span>Node</span>
                    <span>TypeScript</span>
                  </div>
                </div>
              </div>

              {/* كروت صغيرة وهمية تمثل أجزاء من محتوى البورتفوليو. */}
              <div className="mini-cards">
                <div className="mini-card"></div>
                <div className="mini-card"></div>
              </div>

              {/* كارت أكبر يمثل مشروع مميز أو سكشن من البورتفوليو. */}
              <div className="large-card"></div>

              {/* شريط تقدم وهمي يعطي إحساس أن البورتفوليو يتم بناؤه. */}
              <div className="progress-container">
                <div className="progress-bar"></div>
              </div>

              {/* شارة حالة وهمية توضح أن عملية البناء اكتملت. */}
              <div className="build-badge">
                ● Build complete: 200ms
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;

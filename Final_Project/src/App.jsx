import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import Feature, { CTASection, DeveloperSection } from "./home/Feature";
import Hero from "./home/Hero";

function App() {
  return (
    <>
      {/* شريط التنقل العام للزائر قبل تسجيل الدخول. */}
      <Navbar />

      {/* أول جزء في الهوم: العنوان الرئيسي، زرار البدء، ومعاينة لفكرة البورتفوليو. */}
      <Hero />

      {/* كروت المميزات التي تشرح قيمة PortfolioGenie للمستخدم. */}
      <Feature />

      {/* سكشن يشرح خطوات عمل المنتج للمطورين بشكل مبسط. */}
      <DeveloperSection />

      {/* دعوة أخيرة للمستخدم عشان يبدأ إنشاء حساب وبناء البورتفوليو. */}
      <CTASection />

      {/* الفوتر العام وفيه روابط ومعلومات ختامية عن الموقع. */}
      <Footer />
    </>
  );
}

export default App;

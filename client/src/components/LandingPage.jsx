import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import lottie from "lottie-web";
import {
  TrendingUp,
  Activity,
  Sparkles,
  CalendarClock,
  Handshake,
  PiggyBank,
  Globe,
  LogIn,
  Github,
  BarChart3,
  Receipt,
  ArrowRight,
  Menu,
  X,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { isUserAuthenticated } from "../utils/local-storage-helper";

/**
 * Clean SVG Lottie player with robust lifecycle management
 */
function LottiePlayer({ animationPath, className = "" }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (animRef.current) {
      animRef.current.destroy();
      animRef.current = null;
    }

    try {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: animationPath,
      });
    } catch (err) {
      console.error("Lottie load error:", err);
    }

    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [animationPath]);

  return <div ref={containerRef} className={className} />;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const authenticated = isUserAuthenticated();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    localStorage.setItem("hisabkitab_visited_before", "true");

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clicking brand name scrolls smoothly to top of landing page
  const handleBrandClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Launch App: Compulsory Login/Signup check (Zero Guest Mode)
  const handleLaunchApp = (targetPath = "/app") => {
    if (authenticated) {
      navigate(targetPath);
    } else {
      navigate("/login");
    }
  };

  // 6 Core Features (Screenshot 1 format: green outline icons next to 2-line text)
  const features = [
    {
      icon: TrendingUp,
      text: "Gain total cashflow clarity through automated transaction tagging",
    },
    {
      icon: Activity,
      text: "Reduce stress and anxiety through real-time budget guardrails",
    },
    {
      icon: Sparkles,
      text: "Enhance decision-making with instant visual analytics",
    },
    {
      icon: CalendarClock,
      text: "Eliminate surprise auto-debits with proactive bill tracking",
    },
    {
      icon: Handshake,
      text: "Alleviate debt tension with clean bilateral Udhaar logs",
    },
    {
      icon: PiggyBank,
      text: "Ease into consistent wealth accumulation with Gullak goals",
    },
  ];

  // 5 Interactive Showcase Modules (Screenshot 2 bottom collection)
  const modules = [
    {
      id: "records",
      name: "Expense Ledger",
      lottiePath: "/records.json",
      title: "Real-Time Expense Logging with Auto-Tagging",
      description:
        "Capture every rupee spent in seconds. Filter by category, payment method, or date range with zero latency and full cloud synchronization.",
      route: "/app/recordlist",
    },
    {
      id: "charts",
      name: "Spending Analytics",
      lottiePath: "/charts.json",
      title: "High-Resolution Spending Telemetry",
      description:
        "Category donut distributions and monthly burn velocity curves turn raw logs into actionable intelligence.",
      route: "/app",
    },
    {
      id: "bills",
      name: "Bills & Subscriptions",
      lottiePath: "/bills.json",
      title: "Proactive Recurring Bill Watchdog",
      description:
        "Audit recurring subscriptions, calculate monthly overhead, and eliminate forgotten auto-debits before they occur.",
      route: "/app/subscriptions",
    },
    {
      id: "udhaar",
      name: "Udhaar Tracker",
      lottiePath: "/udhaar.json",
      title: "Peer-to-Peer Lend & Borrow Bookkeeping",
      description:
        "Keep a bilateral running ledger of loans given or received among friends and colleagues, with instant settlement tracking.",
      route: "/app/debts",
    },
    {
      id: "gullak",
      name: "Gullak Goals",
      lottiePath: "/gullak.json",
      title: "Goal-Driven Savings with Milestones",
      description:
        "Revive the joy of the traditional Gullak piggy bank. Break ambitious savings targets into effortless daily micro-milestones.",
      route: "/app/gullak",
    },
  ];

  // 3 Testimonials / Quotes (Screenshot 3 format: white cards with orange quote mark)
  const testimonials = [
    {
      quote:
        "Great little app, just what I needed. I love the clean design and how effortless it is to log daily expenses. The spending analytics and Gullak goals provide peace of mind in under thirty seconds a day.",
      author: "Polly F",
    },
    {
      quote:
        "HisabKitab is the perfect personal finance command center. I use it for tracking subscriptions, splitting expenses with roommates, and monitoring monthly burn. No ads, cloud sync, and excellent UI.",
      author: "Will Burton-Edwards",
    },
    {
      quote:
        "Very nicely done app. I used to feel overwhelmed by complex spreadsheet budgeting, but HisabKitab makes every transaction crystal clear. In my opinion the UI is clean, straightforward, and a pleasure to use.",
      author: "Milka Vuorio",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans selection:bg-[#00C58D] selection:text-white antialiased overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. FLOATING ISLAND NAVBAR WITH DYNAMIC FROSTED GLASS (SCREENSHOT 1, 2, 3, 4) */}
      {/* ========================================================================= */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl transition-all duration-300">
        <nav
          className={`glass3d ${
            isScrolled ? "glass3d-scrolled" : ""
          } px-6 sm:px-8 py-3.5 flex items-center justify-between transition-all duration-300`}
        >
          {/* Logo & Brand - Click scrolls smoothly to top */}
          <div
            onClick={handleBrandClick}
            className="flex items-center gap-3 cursor-pointer group select-none"
            title="HisabKitab Home"
          >
            <img
              src="/expenses.png"
              alt="HisabKitab Logo"
              className="w-8 h-8 rounded-lg object-contain shadow-sm group-hover:scale-105 transition-transform"
            />
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-[#00C58D] transition-colors">
              HisabKitab
            </span>
          </div>

          {/* Nav Links + Green CTA */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#modules"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Modules
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Philosophy
            </a>
            <a
              href="https://mailmeatdarshan.github.io/HisabKitabShowCase/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Docs
            </a>

            {/* Try for Free Green Pill Button (Compulsory Login/Signup) */}
            <button
              onClick={() => handleLaunchApp("/app")}
              className="bg-[#00C58D] hover:bg-[#00b07e] active:scale-[0.98] text-white font-semibold text-sm px-5 py-2 rounded-full shadow-sm shadow-[#00C58D]/30 transition-all duration-200"
            >
              {authenticated ? "Open App" : "Try for Free"}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 hover:text-slate-900 rounded-lg focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown with Frosted Glass */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-5 glass3d glass3d-scrolled rounded-2xl flex flex-col gap-3">
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 py-1"
            >
              Pricing
            </a>
            <a
              href="#modules"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 py-1"
            >
              Modules
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 py-1"
            >
              Philosophy
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLaunchApp("/app");
              }}
              className="w-full mt-2 bg-[#00C58D] text-white font-semibold text-sm py-2.5 rounded-full shadow-sm"
            >
              {authenticated ? "Open App" : "Try for Free"}
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (EXACT SCREENSHOT 1: GRAPHIC LEFT, HEADLINE RIGHT) */}
      {/* ========================================================================= */}
      <section className="pt-32 sm:pt-40 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT: Clean Tablet / Player Illustration Frame */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Tablet Frame */}
              <div className="rounded-[32px] border-[5px] border-slate-100 bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                {/* Screen Area */}
                <div className="w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/20 border border-slate-100/80 p-2 flex items-center justify-center overflow-hidden">
                  <LottiePlayer
                    animationPath="/records.json"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Bottom Media Controls Bar (inspired by TryNoice tablet player) */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00C58D] animate-pulse" />
                    <span className="text-xs font-semibold text-slate-600">
                      Ledger Active
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#00C58D]">
                    Secure Cloud Sync
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Typography & 3 Black Badges in a Row */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start text-left lg:pl-6">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-slate-900 tracking-tight leading-[1.12] mb-4">
              Focus. Budget. Save. <br />
              <span className="text-[#00C58D]">With effortless clarity.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mb-8">
              Transform financial chaos into peace of mind. Log expenses, monitor
              budget guardrails, track debts, and achieve goals without intrusive ads
              or predatory tracking.
            </p>

            {/* 3 Download / Access Badges in a Row (Zero Guest Mode - Enforce Sign In) */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Badge 1: Web Browser */}
              <button
                onClick={() => handleLaunchApp("/app")}
                className="bg-black text-white hover:bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-3 shadow-md transition-all group"
              >
                <Globe className="w-6 h-6 text-white group-hover:scale-105 transition-transform" />
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase tracking-wider text-slate-300 font-medium">
                    USE IT IN YOUR
                  </div>
                  <div className="text-xs font-bold text-white tracking-wide">
                    Web Browser
                  </div>
                </div>
              </button>

              {/* Badge 2: Sign In / Create Account */}
              <button
                onClick={() => navigate(authenticated ? "/app" : "/login")}
                className="bg-black text-white hover:bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-3 shadow-md transition-all group"
              >
                <LogIn className="w-6 h-6 text-[#00C58D] group-hover:scale-105 transition-transform" />
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase tracking-wider text-slate-300 font-medium">
                    {authenticated ? "SIGNED IN" : "ACCOUNT ACCESS"}
                  </div>
                  <div className="text-xs font-bold text-white tracking-wide">
                    {authenticated ? "Open App" : "Login / Signup"}
                  </div>
                </div>
              </button>

              {/* Badge 3: GitHub Open Source */}
              <a
                href="https://github.com/mailmeatdarshan/HisabKitab"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white hover:bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-3 shadow-md transition-all group"
              >
                <Github className="w-6 h-6 text-slate-200 group-hover:scale-105 transition-transform" />
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase tracking-wider text-slate-300 font-medium">
                    STAR ON GITHUB
                  </div>
                  <div className="text-xs font-bold text-white tracking-wide">
                    Open Source
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 3. 6 FEATURE HIGHLIGHTS GRID (EXACT SCREENSHOT 1: BORDERLESS 3x2 GRID)  */}
        {/* ======================================================================= */}
        <div className="mt-20 pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
          {features.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="text-[#00C58D] flex-shrink-0 mt-0.5">
                  <IconComp className="w-6 h-6 stroke-[2]" />
                </div>
                <p className="text-sm font-medium text-slate-700 leading-snug">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DEEP DIVE FEATURE SECTION (EXACT SCREENSHOT 2) */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: Text with Blue Highlight & Divided Feature Rows */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
              Dive Into a <span className="text-[#4361EE]">World of Financial Clarity</span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-8 max-w-lg">
              Experience the ultimate spending clarity with our advanced, client-side
              aggregation technology, creating truly actionable personal finance insights.
            </p>

            {/* 3 Divided Feature Rows */}
            <div className="w-full max-w-md flex flex-col">
              <div className="py-3.5 border-b border-slate-100 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Effortlessly log and categorize daily transactions
                </span>
              </div>

              <div className="py-3.5 border-b border-slate-100 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Advanced client-rendered analytics and monthly trend curves
                </span>
              </div>

              <div className="py-3.5 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Secure encrypted database storage with zero telemetry tracking
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Phone Mockup Frame (Screenshot 2 layout) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-64 sm:w-72 h-[480px] rounded-[44px] border-[7px] border-slate-800 bg-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-between p-4">
              {/* Speaker / Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mb-2" />

              {/* Inside Phone: charts.json Lottie Animation */}
              <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                <LottiePlayer
                  animationPath="/charts.json"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Phone Bottom Home Bar */}
              <div className="w-28 h-1 bg-slate-300 rounded-full mt-2" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EXPLORE COLLECTION OF MODULES (SCREENSHOT 2 BOTTOM TITLE & TABS) */}
      {/* ========================================================================= */}
      <section id="modules" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Explore the Collection of{" "}
            <span className="text-[#F97316]">Purpose-Built Modules</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Switch between modules to preview the fluid tools inside HisabKitab.
          </p>
        </div>

        {/* Minimal Tab Switcher */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {modules.map((mod, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(index)}
                className={`px-4 sm:px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {mod.name}
              </button>
            );
          })}
        </div>

        {/* Tab Showcase Content */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-100 bg-[#FAFAFA] p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Narrative */}
            <div className="flex flex-col items-start text-left">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {modules[activeTab].title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {modules[activeTab].description}
              </p>
              <button
                onClick={() => handleLaunchApp(modules[activeTab].route)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-[#00C58D] hover:bg-[#00b07e] shadow-sm transition-all"
              >
                <span>Launch {modules[activeTab].name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Lottie Animation */}
            <div className="w-full h-64 sm:h-72 flex items-center justify-center bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <LottiePlayer
                key={modules[activeTab].lottiePath}
                animationPath={modules[activeTab].lottiePath}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. "LOVED BY PEOPLE" SECTION (EXACT SCREENSHOT 3) */}
      {/* ========================================================================= */}
      <section id="testimonials" className="relative pt-12 pb-24 bg-[#FFF9F3] mt-12">
        {/* Curved Amber/Orange Wavy Ribbon (Screenshot 3 Top) */}
        <div className="w-full overflow-hidden leading-none absolute top-0 left-0">
          <svg
            className="w-full h-12 sm:h-16"
            viewBox="0 0 1440 80"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C360,75 720,5 1080,60 C1260,80 1380,30 1440,20 L1440,0 L0,0 Z"
              fill="#F6A65D"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {/* Centered Heading in Warm Orange (Screenshot 3) */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F67E4B] tracking-tight">
              Loved by people
            </h2>
          </div>

          {/* 3 White Floating Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col justify-between"
              >
                <div>
                  {/* Large Orange Double Quote Mark (Screenshot 3) */}
                  <div className="text-[#F67E4B] text-4xl font-serif font-black leading-none mb-3 select-none">
                    “
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {item.quote}
                  </p>
                </div>
                <div className="text-right text-xs font-semibold text-[#F67E4B] mt-6">
                  — {item.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRICING & COMMITMENT CARDS (EXACT SCREENSHOT 4) */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-16 bg-white max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: Quarterly / Community Edition */}
          <div className="bg-[#FFF4F5] border border-pink-100/70 rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Community Edition
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Trial Period: Lifetime
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">
                ₹0 per month
              </div>
              <div className="text-xs text-slate-500">
                100% Free Forever
              </div>
            </div>
          </div>

          {/* Card 2: Cloud Sync & Security */}
          <div className="bg-[#FFF4F5] border border-pink-100/70 rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Secure Cloud Sync
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Trial Period: Lifetime
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">
                Zero Tracking
              </div>
              <div className="text-xs text-slate-500">
                Encrypted Storage
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ORGANIC DARK WAVE SEPARATOR (EXACT SCREENSHOT 4) */}
      {/* ========================================================================= */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          className="w-full h-16 sm:h-24 block"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,45 C320,115 580,10 920,65 C1160,110 1340,35 1440,45 L1440,120 L0,120 Z"
            fill="#181A20"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 9. DARK MINIMALIST FOOTER (EXACT SCREENSHOT 4: #181A20) */}
      {/* ========================================================================= */}
      <footer className="bg-[#181A20] text-slate-400 pt-8 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
            {/* Col 1: Brand, Socials, Store Badges (Screenshot 4) */}
            <div className="md:col-span-5 flex flex-col items-start">
              {/* Logo */}
              <div
                onClick={handleBrandClick}
                className="flex items-center gap-2.5 cursor-pointer mb-5 group"
                title="Back to Top"
              >
                <img
                  src="/expenses.png"
                  alt="HisabKitab Logo"
                  className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
                />
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#00C58D] transition-colors">
                  HisabKitab
                </span>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-4 text-slate-400 mb-6">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/mailmeatdarshan/HisabKitab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>

              {/* Access Badges in Footer */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => handleLaunchApp("/app")}
                  className="bg-[#24262E] hover:bg-[#2D303A] text-white rounded-lg px-3.5 py-2 flex items-center gap-3 w-48 transition-colors text-left"
                >
                  <Globe className="w-5 h-5 text-white" />
                  <div className="leading-tight">
                    <div className="text-[8px] uppercase tracking-wider text-slate-400">
                      USE IT IN YOUR
                    </div>
                    <div className="text-xs font-bold text-white">
                      Web Browser
                    </div>
                  </div>
                </button>

                <a
                  href="https://github.com/mailmeatdarshan/HisabKitab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#24262E] hover:bg-[#2D303A] text-white rounded-lg px-3.5 py-2 flex items-center gap-3 w-48 transition-colors text-left"
                >
                  <Github className="w-5 h-5 text-white" />
                  <div className="leading-tight">
                    <div className="text-[8px] uppercase tracking-wider text-slate-400">
                      GET IT ON
                    </div>
                    <div className="text-xs font-bold text-white">
                      GitHub Repo
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Col 2: Support */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-white mb-4">
                Support
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li>
                  <a
                    href="https://mailmeatdarshan.github.io/HisabKitabShowCase/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/mailmeatdarshan/HisabKitab/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Report Issues
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/mailmeatdarshan/HisabKitab/discussions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Submit Feedback
                  </a>
                </li>
                <li>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Operational Status
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="md:col-span-3">
              <h4 className="text-sm font-semibold text-white mb-4">
                Resources
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li>
                  <a
                    href="https://mailmeatdarshan.github.io/HisabKitabShowCase/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://mailmeatdarshan.github.io/HisabKitabShowCase/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Frequently Asked Questions
                  </a>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Terms of Service
                  </span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <a
                    href="https://github.com/mailmeatdarshan/HisabKitab/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Release Notes
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Community */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-white mb-4">
                Account
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="hover:text-white transition-colors text-left"
                  >
                    Sign In to Account
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/signup")}
                    className="hover:text-white transition-colors text-left"
                  >
                    Create Free Account
                  </button>
                </li>
                <li>
                  <a
                    href="https://github.com/mailmeatdarshan/HisabKitab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub Open Source
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Row (Screenshot 4) */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              © 2026, all rights reserved. Made with ❤️ in India.
            </div>
            <div className="flex items-center gap-4">
              <span>Sitemap</span>
              <span>•</span>
              <a
                href="https://github.com/mailmeatdarshan/HisabKitab"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-400 transition-colors"
              >
                Open Source
              </a>
              <span>•</span>
              <span>Privacy First</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

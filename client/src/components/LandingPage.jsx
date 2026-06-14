import React, { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { isUserAuthenticated } from "../utils/local-storage-helper";
import axiosInstance from "../utils/data-access";

export default function LandingPage() {
  const navigate = useNavigate();
  const authenticated = isUserAuthenticated();
  const hasVisited = localStorage.getItem("hisabkitab_visited_before");

  useEffect(() => {
    if (!hasVisited) {
      localStorage.setItem("hisabkitab_visited_before", "true");
    }
  }, [hasVisited]);

  if (hasVisited) {
    return <Navigate to="/app" replace />;
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      const panels = document.querySelectorAll(".glass-panel");
      panels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
          panel.style.boxShadow = `0 10px 30px rgba(31, 43, 200, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)`;
        } else {
          panel.style.boxShadow = "";
        }
      });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axiosInstance.post("/auth/signout");
    } catch (error) {
      console.error("Logout failed: ", error);
    } finally {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  const handleScrollToMockup = (e) => {
    e.preventDefault();
    const element = document.getElementById("mockup");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-page-container w-full min-h-screen relative overflow-x-hidden">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-divider-subtle">
        <div className="flex justify-between items-center px-4 sm:px-8 md:px-margin-safe py-base max-w-[1728px] mx-auto">
          <div className="flex items-center gap-2 sm:gap-md cursor-pointer" onClick={() => navigate("/app")}>
            <img
              alt="HisabKitab Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              src="https://lh3.googleusercontent.com/aida/AP1WRLuRMAcz5O7FEEgIgqKC5mIVbjb2H_CncxnVoX1Y5nzF8XAPr1fTSjPfzJYOSzDcaEU-V4TpccxA-pmwhq47saTSjtAM9owmoh7yKmsEwDo0sI4BZg_WFg1xr5p3GCBwnRGgMgh9P-HPi9jeWJ5vhrLj5eGIxwp6HQcGU40YkFmGJLqLIZjAsWsKnjwGWZhgUPcUgXNmEXWyUl6b0sOHn0-PnzNYOrxJ5Td0jUg6ePMTN_v3YiiYCyFm_NWH"
            />
            <span className="font-h3 text-xl sm:text-h3 font-bold tracking-tighter text-on-surface">HisabKitab</span>
          </div>
          <div className="hidden md:flex items-center gap-xl">
            <button
              onClick={() => navigate("/app")}
              className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/app")}
              className="text-text-muted font-medium hover:text-primary transition-colors duration-200 font-body-md text-body-md"
            >
              Analytics
            </button>
            <a
              className="text-text-muted font-medium hover:text-primary transition-colors duration-200 font-body-md text-body-md"
              href="https://mailmeatdarshan.github.io/HisabKitabShowCase/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
            <a
              className="text-text-muted font-medium hover:text-primary transition-colors duration-200 font-body-md text-body-md"
              href="#philosophy"
            >
              Philosophy
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-base">
            {authenticated ? (
              <>
                <button
                  onClick={() => navigate("/app")}
                  className="text-text-muted font-medium font-body-md hover:text-primary transition-colors text-xs sm:text-body-md"
                >
                  Go to App
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-on-surface text-surface px-3 sm:px-4 py-1.5 font-bold text-xs sm:text-sm rounded shadow-sm hover:opacity-90 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-text-muted font-medium font-body-md hover:text-primary transition-colors text-xs sm:text-body-md"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/app")}
                  className="bg-on-surface text-surface px-3 sm:px-4 py-1.5 font-bold text-xs sm:text-sm rounded shadow-sm hover:opacity-90 transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-24 sm:pt-32">
        {/* Hero Section */}
        <section className="px-4 sm:px-8 md:px-margin-safe max-w-[1728px] mx-auto mb-16 sm:mb-24 lg:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
            <div className="lg:col-span-5 pt-4 sm:pt-xl">
              <div className="flex items-center gap-sm mb-md">
                <span className="w-2 h-2 rounded-full bg-accent-lime shadow-[0_0_8px_#A4D433]"></span>
                <span className="font-mono-telemetry text-mono-telemetry text-text-muted uppercase tracking-[0.2em]">
                  Status: Ready to track
                </span>
              </div>
              <h1 className="font-hero-headline text-3xl sm:text-5xl md:text-6xl lg:text-hero-headline mb-lg">
                The smart <br className="hidden sm:inline" />
                dashboard for <br />
                <span className="text-primary">your daily expenses.</span>
              </h1>
              <p className="font-body-lg text-body-md sm:text-body-lg text-text-muted mb-xl max-w-md">
                Simple, elegant, and secure tracking for your personal money. Take control of your daily spending,
                analyze your habits, and save more with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-md">
                <button
                  onClick={() => navigate("/app")}
                  className="w-full sm:w-auto bg-primary text-on-primary px-lg py-md font-bold text-body-md rounded-lg shadow-xl hover:translate-y-[-2px] transition-all text-center"
                >
                  Start Tracking Now
                </button>
                <button
                  onClick={handleScrollToMockup}
                  className="w-full sm:w-auto border border-divider-subtle text-on-surface px-lg py-md font-bold text-body-md rounded-lg hover:bg-surface-container transition-all flex items-center justify-center gap-xs"
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  See How It Works
                </button>
              </div>
            </div>
            {/* Dashboard Mockup */}
            <div id="mockup" className="lg:col-span-7 relative w-full mt-12 lg:mt-0">
              <div className="glass-panel rounded-xl overflow-hidden shadow-2xl inner-glow">
                {/* Mockup Header */}
                <div className="bg-surface-container-highest border-b border-divider-subtle px-md py-sm flex justify-between items-center">
                  <div className="flex gap-xs">
                    <div className="w-3 h-3 rounded-full bg-divider-subtle"></div>
                    <div className="w-3 h-3 rounded-full bg-divider-subtle"></div>
                    <div className="w-3 h-3 rounded-full bg-divider-subtle"></div>
                  </div>
                  <span className="font-mono-telemetry text-mono-telemetry text-text-muted">
                    Dashboard Preview
                  </span>
                </div>
                {/* Mockup Content */}
                <div className="p-4 sm:p-lg grid grid-cols-1 md:grid-cols-3 gap-md bg-white">
                  <div className="col-span-1 md:col-span-2 space-y-md">
                    <div className="h-48 border border-divider-subtle rounded p-md relative overflow-hidden">
                      <div className="absolute top-md right-md flex flex-col items-end">
                        <span className="font-mono-telemetry text-mono-telemetry text-text-muted">Monthly Savings</span>
                        <span className="font-h3 text-h3 font-bold text-accent-lime">+12.4%</span>
                      </div>
                      {/* Sparkline SVG */}
                      <svg className="w-full h-full" viewBox="0 0 400 100">
                        <path
                          className="data-thread"
                          d="M0,80 L40,75 L80,85 L120,60 L160,65 L200,40 L240,45 L280,20 L320,25 L360,5 L400,10"
                          fill="none"
                          stroke="#1F2BC8"
                          strokeWidth="2"
                        ></path>
                        <path
                          d="M0,80 L40,75 L80,85 L120,60 L160,65 L200,40 L240,45 L280,20 L320,25 L360,5 L400,10 V100 H0 Z"
                          fill="url(#grad1)"
                          opacity="0.1"
                        ></path>
                        <defs>
                          <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: "#1F2BC8", stopOpacity: 1 }}></stop>
                            <stop offset="100%" style={{ stopColor: "#1F2BC8", stopOpacity: 0 }}></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                      <div className="border border-divider-subtle p-4 sm:p-md rounded">
                        <span className="font-mono-telemetry text-mono-telemetry text-text-muted block mb-xs">
                          Available Balance
                        </span>
                        <span className="font-h3 text-h3 font-bold">₹12,450.00</span>
                      </div>
                      <div className="border border-divider-subtle p-4 sm:p-md rounded">
                        <span className="font-mono-telemetry text-mono-telemetry text-text-muted block mb-xs">
                          Monthly Expenses
                        </span>
                        <span className="font-h3 text-h3 font-bold text-error">₹3,210.15</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l border-divider-subtle pt-md md:pt-0 md:pl-md space-y-md">
                    <span className="font-mono-telemetry text-mono-telemetry text-text-muted block border-b border-divider-subtle pb-xs mt-4 md:mt-0">
                      Recent Transactions
                    </span>
                    <div className="space-y-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="font-mono-data text-mono-data text-on-surface">Groceries</span>
                          <span className="font-mono-telemetry text-mono-telemetry text-text-muted">14:20:05</span>
                        </div>
                        <span className="font-mono-data text-mono-data text-error">-₹45.00</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="font-mono-data text-mono-data text-on-surface">Salary Credit</span>
                          <span className="font-mono-telemetry text-mono-telemetry text-text-muted">12:11:42</span>
                        </div>
                        <span className="font-mono-data text-mono-data text-accent-lime">+₹112.50</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="font-mono-data text-mono-data text-on-surface">Streaming Subscription</span>
                          <span className="font-mono-telemetry text-mono-telemetry text-text-muted">09:05:12</span>
                        </div>
                        <span className="font-mono-data text-mono-data text-error">-₹12.99</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Floating Elements */}
              <div className="absolute -bottom-10 -left-10 glass-panel p-md rounded shadow-lg animate-bounce duration-[3000ms] hidden sm:block">
                <span className="font-mono-telemetry text-mono-telemetry text-text-muted block">Data Protected</span>
                <div className="flex items-center gap-xs">
                  <span className="font-h3 text-h3 font-bold">100%</span>
                  <span className="material-symbols-outlined text-accent-lime">check_circle</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Principles */}
        <section id="philosophy" className="bg-surface-container py-xl border-y border-divider-subtle mb-16 sm:mb-24 lg:mb-32">
          <div className="px-4 sm:px-8 md:px-margin-safe max-w-[1728px] mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-xl gap-4">
              <div>
                <span className="font-mono-telemetry text-mono-telemetry text-primary uppercase tracking-[0.2em] mb-sm block">
                  Simple Philosophy
                </span>
                <h2 className="font-h1 text-3xl sm:text-4xl lg:text-h1">Your daily money, organized.</h2>
              </div>
              <p className="font-body-md text-body-md text-text-muted max-w-sm mb-xs">
                We remove the complexity of traditional banking to give you a clear, straightforward picture of your
                daily budget.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div className="p-lg border border-divider-subtle bg-white hover:border-primary transition-colors">
                <span className="font-mono-telemetry text-mono-telemetry text-text-muted mb-md block">01 / INSTANT</span>
                <h3 className="font-h3 text-h3 mb-md">Instant Updates</h3>
                <p className="font-body-md text-body-md text-text-muted">
                  Add expenses in seconds. Your charts and statistics update instantly so you always know where you stand.
                </p>
              </div>
              <div className="p-lg border border-divider-subtle bg-white hover:border-primary transition-colors">
                <span className="font-mono-telemetry text-mono-telemetry text-text-muted mb-md block">
                  02 / INSIGHTS
                </span>
                <h3 className="font-h3 text-h3 mb-md">Easy Categorizing</h3>
                <p className="font-body-md text-body-md text-text-muted">
                  Quickly categorize your spending (like food, travel, utilities) to easily see where your money goes.
                </p>
              </div>
              <div className="p-lg border border-divider-subtle bg-white hover:border-primary transition-colors">
                <span className="font-mono-telemetry text-mono-telemetry text-text-muted mb-md block">
                  03 / BUDGETS
                </span>
                <h3 className="font-h3 text-h3 mb-md">Smart Savings</h3>
                <p className="font-body-md text-body-md text-text-muted">
                  Plan your future budgets using simple insights based on your past spending habits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-4 sm:px-8 md:px-margin-safe max-w-[1728px] mx-auto mb-16 sm:mb-24 lg:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl mb-xl">
            <div className="space-y-lg">
              <span className="font-mono-telemetry text-mono-telemetry text-primary uppercase tracking-[0.2em]">
                App Features
              </span>
              <h2 className="font-h1 text-3xl sm:text-4xl lg:text-h1">
                Turn daily spending <br className="hidden sm:inline" />
                into smart savings.
              </h2>
              <div className="space-y-md">
                <div className="flex items-start gap-md group">
                  <div className="w-10 h-10 flex items-center justify-center border border-divider-subtle rounded group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined">analytics</span>
                  </div>
                  <div>
                    <h4 className="font-h3 text-h3 text-lg mb-xs">Simple Filtering</h4>
                    <p className="font-body-md text-body-md text-text-muted">
                      Quickly filter your expenses by category, date, or amount to find exactly what you're looking for.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-md group">
                  <div className="w-10 h-10 flex items-center justify-center border border-divider-subtle rounded group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined">rule</span>
                  </div>
                  <div>
                    <h4 className="font-h3 text-h3 text-lg mb-xs">Budget Alerts</h4>
                    <p className="font-body-md text-body-md text-text-muted">
                      Stay on track with your spending goals and keep your budget in check without the stress.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface-container rounded-xl p-6 md:p-xl flex items-center justify-center border border-divider-subtle relative overflow-hidden mt-8 lg:mt-0">
              <div className="absolute inset-0 opacity-10"></div>
              <div className="relative z-10 glass-panel p-lg rounded shadow-xl w-full max-w-sm">
                <div className="flex justify-between items-center mb-md">
                  <span className="font-mono-telemetry text-mono-telemetry text-text-muted">Weekly Spend</span>
                  <span className="px-xs py-1 rounded bg-accent-lime/20 text-accent-lime text-[10px] font-bold">
                    On Budget
                  </span>
                </div>
                <div className="space-y-sm">
                  <div className="h-2 bg-divider-subtle rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3"></div>
                  </div>
                  <div className="h-2 bg-divider-subtle rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/2"></div>
                  </div>
                  <div className="h-2 bg-divider-subtle rounded-full overflow-hidden">
                    <div className="h-full bg-accent-lime w-4/5"></div>
                  </div>
                </div>
                <div className="mt-md pt-md border-t border-divider-subtle">
                  <span className="font-mono-data text-mono-data text-on-surface">
                    TIP: Consider reducing dining out this week
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl flex-row-reverse mt-12 sm:mt-16 lg:mt-20">
            <div className="order-2 lg:order-1 bg-surface-container rounded-xl p-6 md:p-xl flex items-center justify-center border border-divider-subtle mt-8 lg:mt-0">
              <div className="w-full space-y-md">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-md">
                  <div className="flex-1 bg-white border border-divider-subtle p-4 sm:p-md rounded">
                    <span className="font-mono-telemetry text-mono-telemetry text-text-muted block mb-xs">
                      Monthly Rent
                    </span>
                    <span className="font-h3 text-h3 font-bold text-on-surface">₹4,120</span>
                  </div>
                  <div className="flex-1 bg-white border border-divider-subtle p-4 sm:p-md rounded">
                    <span className="font-mono-telemetry text-mono-telemetry text-text-muted block mb-xs">
                      Groceries
                    </span>
                    <span className="font-h3 text-h3 font-bold text-accent-lime">₹1,890</span>
                  </div>
                </div>
                <div className="bg-white border border-divider-subtle p-4 sm:p-md rounded">
                  <span className="font-mono-telemetry text-mono-telemetry text-text-muted block mb-sm">
                    Savings Trend
                  </span>
                  <div className="flex items-end gap-1 h-24">
                    <div className="bg-primary/20 w-full h-1/2 rounded-t-sm"></div>
                    <div className="bg-primary/20 w-full h-2/3 rounded-t-sm"></div>
                    <div className="bg-primary/20 w-full h-3/4 rounded-t-sm"></div>
                    <div className="bg-primary w-full h-full rounded-t-sm"></div>
                    <div className="bg-primary/40 w-full h-5/6 rounded-t-sm border-t-2 border-dashed border-primary"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-lg lg:pl-xl">
              <span className="font-mono-telemetry text-mono-telemetry text-primary uppercase tracking-[0.2em]">
                Financial Peace of Mind
              </span>
              <h2 className="font-h1 text-3xl sm:text-4xl lg:text-h1">
                Take control of <br className="hidden sm:inline" />
                your daily budget.
              </h2>
              <p className="font-body-lg text-body-lg text-text-muted">
                Stop wondering where your salary went. HisabKitab gives you a clear and simple view of your budget,
                helping you save more money.
              </p>
              <ul className="space-y-sm">
                <li className="flex items-center gap-sm font-mono-data text-mono-data text-on-surface">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Simple and clean design
                </li>
                <li className="flex items-center gap-sm font-mono-data text-mono-data text-on-surface">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Secure local storage (Guest mode)
                </li>
                <li className="flex items-center gap-sm font-mono-data text-mono-data text-on-surface">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Export reports to CSV and PDF
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white py-xl border-t border-divider-subtle">
          <div className="px-4 sm:px-8 md:px-margin-safe max-w-[1728px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              <div className="p-lg border-l-2 border-primary bg-surface-container/30">
                <p className="font-body-md text-body-md text-on-surface italic mb-lg">
                  "The clean layout and lack of cluttered ads is exactly what I needed. No fluff—just simple tracking."
                </p>
                <div className="flex flex-col">
                  <span className="font-mono-data text-mono-data font-bold">Aman Gupta</span>
                  <span className="font-mono-telemetry text-mono-telemetry text-text-muted">
                    Software Engineer
                  </span>
                </div>
              </div>
              <div className="p-lg border-l-2 border-divider-subtle bg-surface-container/30">
                <p className="font-body-md text-body-md text-on-surface italic mb-lg">
                  "I finally have a handle on my monthly spending. The charts are super intuitive and help me save every
                  month."
                </p>
                <div className="flex flex-col">
                  <span className="font-mono-data text-mono-data font-bold">Neha Sharma</span>
                  <span className="font-mono-telemetry text-mono-telemetry text-text-muted">
                    Graphic Designer
                  </span>
                </div>
              </div>
              <div className="p-lg border-l-2 border-divider-subtle bg-surface-container/30">
                <p className="font-body-md text-body-md text-on-surface italic mb-lg">
                  "HisabKitab treats my daily money with the care it deserves. It has completely changed how I manage my
                  salary."
                </p>
                <div className="flex flex-col">
                  <span className="font-mono-data text-mono-data font-bold">Rahul Verma</span>
                  <span className="font-mono-telemetry text-mono-telemetry text-text-muted">
                    Student
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-[120px] bg-white relative overflow-hidden border-y border-divider-subtle">
          <div className="absolute inset-0 z-0 opacity-5">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,#1F2BC8_0,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
          <div className="px-4 sm:px-8 md:px-margin-safe max-w-[1728px] mx-auto relative z-10 text-center">
            <h2 className="font-hero-headline text-3xl sm:text-5xl lg:text-hero-headline mb-lg">
              Built for simplicity. <br className="hidden sm:inline" />
              Ready today.
            </h2>
            <p className="font-body-lg text-body-lg text-text-muted mb-xl max-w-2xl mx-auto">
              Join thousands of everyday users who manage their daily budgets and expenses with absolute ease.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-md max-w-xs sm:max-w-none mx-auto">
              <button
                onClick={() => navigate("/app")}
                className="bg-on-surface text-surface px-xl py-md font-bold text-body-md rounded shadow-xl hover:scale-105 transition-transform"
              >
                Get Started for Free
              </button>
              <a
                href="https://mailmeatdarshan.github.io/HisabKitabShowCase/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-divider-subtle text-on-surface px-xl py-md font-bold text-body-md rounded hover:bg-surface-container transition-all flex items-center justify-center"
              >
                Documentation
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background-deep border-t border-divider-subtle w-full py-xl">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-lg px-4 sm:px-8 md:px-margin-safe max-w-[1728px] mx-auto">
          <div className="col-span-2">
            <div className="flex items-center gap-sm mb-md">
              <img
                alt="Logo"
                className="w-6 h-6"
                src="https://lh3.googleusercontent.com/aida/AP1WRLuRMAcz5O7FEEgIgqKC5mIVbjb2H_CncxnVoX1Y5nzF8XAPr1fTSjPfzJYOSzDcaEU-V4TpccxA-pmwhq47saTSjtAM9owmoh7yKmsEwDo0sI4BZg_WFg1xr5p3GCBwnRGgMgh9P-HPi9jeWJ5vhrLj5eGIxwp6HQcGU40YkFmGJLqLIZjAsWsKnjwGWZhgUPcUgXNmEXWyUl6b0sOHn0-PnzNYOrxJ5Td0jUg6ePMTN_v3YiiYCyFm_NWH"
              />
              <span className="font-h3 text-h3 text-on-surface font-bold tracking-tighter">HisabKitab</span>
            </div>
            <p className="font-mono-data text-mono-data text-text-muted mb-md max-w-xs">
              Simple and smart expense tracking for everyone. Organize your daily budget and achieve your saving goals.
            </p>
            <div className="flex gap-md">
              <span className="material-symbols-outlined text-text-muted hover:text-accent-cyan-soft cursor-pointer">
                share
              </span>
              <span className="material-symbols-outlined text-text-muted hover:text-accent-cyan-soft cursor-pointer">
                shield
              </span>
              <span className="material-symbols-outlined text-text-muted hover:text-accent-cyan-soft cursor-pointer">
                help
              </span>
            </div>
          </div>
          <div>
            <h5 className="font-mono-telemetry text-mono-telemetry text-on-surface uppercase tracking-[0.1em] mb-md">
              Features
            </h5>
            <ul className="space-y-sm">
              <li>
                <button
                  onClick={() => navigate("/app")}
                  className="font-mono-data text-mono-data text-text-muted hover:text-accent-cyan-soft transition-colors text-left"
                >
                  Expense Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/app")}
                  className="font-mono-data text-mono-data text-text-muted hover:text-accent-cyan-soft transition-colors text-left"
                >
                  Charts & Insights
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/app")}
                  className="font-mono-data text-mono-data text-text-muted hover:text-accent-cyan-soft transition-colors text-left"
                >
                  Cloud Backup
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/app")}
                  className="font-mono-data text-mono-data text-text-muted hover:text-accent-cyan-soft transition-colors text-left"
                >
                  Guest Mode
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono-telemetry text-mono-telemetry text-on-surface uppercase tracking-[0.1em] mb-md">
              App Links
            </h5>
            <ul className="space-y-sm">
              <li>
                <a
                  className="font-mono-data text-mono-data text-text-muted hover:text-accent-cyan-soft transition-colors"
                  href="https://mailmeatdarshan.github.io/HisabKitabShowCase/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  className="font-mono-data text-mono-data text-text-muted hover:text-accent-cyan-soft transition-colors"
                  href="https://mailmeatdarshan.github.io/HisabKitabShowCase/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FAQ
                </a>
              </li>
              <li>
                <span className="font-mono-data text-mono-data text-text-muted cursor-default block">System Status: Active</span>
              </li>
              <li>
                <span className="font-mono-data text-mono-data text-text-muted cursor-default block">Security: Encrypted</span>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono-telemetry text-mono-telemetry text-on-surface uppercase tracking-[0.1em] mb-md">
              Company
            </h5>
            <ul className="space-y-sm">
              <li>
                <span className="font-mono-data text-mono-data text-text-muted cursor-default block">Privacy Policy</span>
              </li>
              <li>
                <span className="font-mono-data text-mono-data text-text-muted cursor-default block">Terms of Service</span>
              </li>
              <li>
                <span className="font-mono-data text-mono-data text-text-muted cursor-default block">Data Processing</span>
              </li>
              <li>
                <span className="font-mono-data text-mono-data text-text-muted cursor-default block">Compliance</span>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono-telemetry text-mono-telemetry text-on-surface uppercase tracking-[0.1em] mb-md">
              Get Help
            </h5>
            <ul className="space-y-sm">
              <li>
                <span className="font-mono-data text-mono-data text-text-muted cursor-default block">Help Center</span>
              </li>
              <li>
                <span className="font-mono-data text-mono-data text-text-muted cursor-default block">Community</span>
              </li>
              <li>
                <span className="font-mono-data text-mono-data text-text-muted cursor-default block">Contact Devs</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-xl pt-lg border-t border-divider-subtle px-4 sm:px-8 md:px-margin-safe max-w-[1728px] mx-auto flex flex-col md:flex-row justify-between items-center gap-md text-center md:text-left">
          <span className="font-mono-data text-mono-data text-text-muted">
            © 2024 HisabKitab Personal Finance. All rights reserved.
          </span>
          <div className="flex items-center gap-lg mt-4 md:mt-0">
            <span className="font-mono-telemetry text-mono-telemetry text-text-muted">SECURE DATA: 100%</span>
            <span className="font-mono-telemetry text-mono-telemetry text-accent-lime">CLOUD SYNC: READY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

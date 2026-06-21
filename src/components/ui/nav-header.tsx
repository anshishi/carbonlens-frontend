import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const TABS = ["Home", "Tracker", "Dashboard", "Leaderboard", "Tips"];
const SECTION_IDS: Record<string, string> = {
  Home: "home",
  Tracker: "tracker",
  Dashboard: "dashboard",
  Leaderboard: "leaderboard",
  Tips: "tips",
};

/**
 * NavHeader - Pill-style header bar with animated sliding cursor.
 * Implements smooth scrolling to sections and monitors scroll triggers to update active tabs.
 */
export function NavHeader() {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll movements to dynamically set the active nav item
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (const tab of TABS) {
        const section = document.getElementById(SECTION_IDS[tab]);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(tab);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    const target = document.getElementById(SECTION_IDS[tab]);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 max-w-7xl mx-auto">
      {/* Desktop Pill Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-[#121a18]/90 border border-primary/20 rounded-full py-1.5 px-3 shadow-glow backdrop-blur-md">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleTabClick("Home");
          }}
          className="flex items-center gap-2 mr-6 pl-3 group"
        >
          <span className="font-serif font-black text-[#f1f5f3] tracking-wide text-lg">
            CarbonLens
          </span>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </a>

        <div className="flex items-center gap-0.5">
          {TABS.map((tab) => {
            const isHovered = hoveredTab === tab;
            const isActive = activeTab === tab;
            // The cursor should be on the hovered tab, or active tab if nothing is hovered
            const showCursor = isHovered || (hoveredTab === null && isActive);

            return (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                onMouseEnter={() => setHoveredTab(tab)}
                onMouseLeave={() => setHoveredTab(null)}
                className="relative px-4 py-1.5 text-sm font-sans font-semibold rounded-full transition-colors duration-200 outline-none"
                style={{
                  color: showCursor ? "#0a0f0d" : "#9ca8a4",
                }}
              >
                {showCursor && (
                  <motion.div
                    layoutId="desktop-nav-cursor"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Top Pill Bar */}
      <div className="md:hidden w-full flex items-center justify-between bg-[#121a18]/95 border border-primary/20 rounded-full py-2 px-5 shadow-glow backdrop-blur-md">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleTabClick("Home");
          }}
          className="flex items-center gap-2"
        >
          <span className="font-serif font-bold text-[#f1f5f3] tracking-wide">
            CarbonLens
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </a>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-[#f1f5f3] hover:text-primary transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 md:hidden bg-[#121a18] border border-primary/20 rounded-3xl p-6 shadow-glow flex flex-col gap-4 z-40 backdrop-blur-lg"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`w-full py-3 px-4 text-left font-sans font-semibold rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-[#0a0f0d] shadow-glow"
                      : "text-[#9ca8a4] hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
export default NavHeader;

import { useState } from "react";
import NavHeader from "./components/ui/nav-header";
import Hero from "./components/sections/Hero";
import DashboardPreview from "./components/sections/DashboardPreview";
import Tracker from "./components/sections/Tracker";
import Dashboard from "./components/sections/Dashboard";
import Tips from "./components/sections/Tips";
import Leaderboard from "./components/sections/Leaderboard";
import Gamification from "./components/sections/Gamification";

/**
 * Main App Component.
 * Orchestrates all page sections and triggers data synchronization across metrics
 * components when a user logs a new activity.
 */
function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleActivityLogged = () => {
    // Incrementing refreshTrigger cascades to trigger refetching across all child sections
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="bg-background min-h-screen text-[#9ca8a4]">
      {/* Floating Header Navbar */}
      <NavHeader />

      {/* Section 1: Hero Section */}
      <Hero />

      {/* Section 2: 3D Scroll Reveal Mockup Dashboard */}
      <DashboardPreview />

      {/* Section 3: Activity Tracker */}
      <Tracker onActivityLogged={handleActivityLogged} />

      {/* Section 4: Live Data Insights Dashboard */}
      <Dashboard refreshTrigger={refreshTrigger} />

      {/* Section 5: Personalized Tips & Advice */}
      <Tips refreshTrigger={refreshTrigger} />

      {/* Section 6: Global Community Leaderboard */}
      <Leaderboard refreshTrigger={refreshTrigger} />

      {/* Section 7: Streaks and Badges Gamification */}
      <Gamification refreshTrigger={refreshTrigger} />

      {/* Footer */}
      <footer className="border-t border-primary/5 bg-[#121a18]/25 py-12 text-center text-xs font-sans text-zinc-600">
        <p className="mb-2">© {new Date().getFullYear()} CarbonLens. All rights reserved.</p>
        <p>Providing precision calculations for global ecological transition.</p>
      </footer>
    </div>
  );
}

export default App;

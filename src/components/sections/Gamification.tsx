import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchStreak } from "../../lib/api";
import type { StreakResponse } from "../../lib/api";
import { Flame, Sparkles } from "lucide-react";

interface GamificationProps {
  refreshTrigger: number;
}

const BADGE_TEMPLATES = [
  {
    id: "Plant Power",
    name: "Plant Power",
    description: "Logged 5+ vegetarian meals to limit agriculture impact.",
    icon: "🌱",
    colorClass: "border-primary/30 text-primary bg-primary/5 shadow-glow",
  },
  {
    id: "Eco Warrior",
    name: "Eco Warrior",
    description: "Maintained average emissions below 5 kg CO2 per day.",
    icon: "🛡️",
    colorClass: "border-secondary/30 text-secondary bg-secondary/5 shadow-glow",
  },
  {
    id: "7-Day Streak",
    name: "7-Day Streak",
    description: "Maintained tracking for 7 consecutive days.",
    icon: "👑",
    colorClass: "border-accent-magenta/40 text-accent-magenta bg-accent-magenta/5 shadow-glow-magenta animate-pulse",
    isMilestone: true,
  },
];

/**
 * Gamification - Shows logging streaks and environmental badges.
 */
export function Gamification({ refreshTrigger }: GamificationProps) {
  const [streakData, setStreakData] = useState<StreakResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        setLoading(true);
        const data = await fetchStreak();
        setStreakData(data);
        setError(null);
      } catch (err: any) {
        console.error("Streak error:", err);
        setError("Failed to fetch streak data.");
      } finally {
        setLoading(false);
      }
    };
    loadStreak();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <section className="py-24 px-4 bg-background border-t border-primary/5">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="h-10 bg-[#121a18] rounded-xl w-48 animate-pulse mx-auto" />
          <div className="h-28 bg-[#121a18] rounded-3xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-[#121a18] rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !streakData) {
    return (
      <section className="py-24 px-4 bg-background border-t border-primary/5 text-center text-danger font-semibold">
        <p>⚠️ {error || "No streak details available."}</p>
      </section>
    );
  }

  const streak = streakData.streak_days;
  const unlockedBadges = streakData.badges;

  return (
    <section className="py-24 px-4 bg-background border-t border-primary/5">
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium font-serif mb-4 text-[#f1f5f3]">
            Milestones & Badges
          </h2>
          <p className="text-[#9ca8a4] max-w-xl mx-auto font-sans">
            Build sustainable habits, maintain your daily logging streak, and unlock special eco achievements.
          </p>
        </div>

        {/* Streak Flame Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#121a18] border border-primary/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 shadow-glow"
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              {streak > 0 && (
                <div className="absolute inset-0 bg-warning/20 rounded-full blur-md animate-ping" />
              )}
              <div className="p-4 rounded-2xl bg-warning/15 text-warning relative z-10">
                <Flame size={32} strokeWidth={2.5} className={streak > 0 ? "animate-pulse" : ""} />
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-medium font-serif text-[#f1f5f3] mb-1">
                <span className="font-sans font-bold">{streak}</span> Day Logging Streak
              </h3>
              <p className="text-[#9ca8a4] text-sm font-sans">
                {streak > 0
                  ? "Your streak is active! Log tomorrow to keep it glowing."
                  : "Log your first activity to start your streak today!"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border border-primary/20 bg-[#0a0f0d] px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles size={14} className="animate-spin" />
            {unlockedBadges.length} Badge{unlockedBadges.length !== 1 && "s"} Unlocked
          </div>
        </motion.div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BADGE_TEMPLATES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`border rounded-3xl p-6 flex flex-col items-center text-center transition-all ${
                  isUnlocked
                    ? `${badge.colorClass} scale-[1.02]`
                    : "border-primary/5 bg-[#121a18]/25 opacity-30 select-none grayscale"
                }`}
              >
                {/* Badge Icon */}
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl text-4xl mb-4 border border-inherit bg-[#0a0f0d] shadow-sm relative">
                  {badge.icon}
                  {isUnlocked && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-ping" />
                  )}
                </div>

                {/* Badge Title */}
                <h4 className="text-lg font-medium font-serif text-[#f1f5f3] mb-2">
                  {badge.name}
                </h4>

                {/* Badge Description */}
                <p className="text-xs text-[#9ca8a4] font-sans leading-relaxed">
                  {badge.description}
                </p>

                {/* Badge Status Button/Label */}
                <div className="mt-5">
                  {isUnlocked ? (
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f1f5f3] border border-inherit px-3 py-1 rounded-full">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-600 border border-zinc-800 px-3 py-1 rounded-full">
                      Locked
                    </span>
                  )}
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
export default Gamification;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchLeaderboard } from "../../lib/api";
import type { UserLeaderboardEntry } from "../../lib/api";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardProps {
  refreshTrigger: number;
}

/**
 * Leaderboard - Rankings table.
 * Highlights the active user "You" and adds medal icons to the top 3 spots.
 */
export function Leaderboard({ refreshTrigger }: LeaderboardProps) {
  const [users, setUsers] = useState<UserLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await fetchLeaderboard();
        setUsers(data);
        setError(null);
      } catch (err: any) {
        console.error("Leaderboard error:", err);
        setError("Failed to load community leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <section id="leaderboard" className="py-24 px-4 bg-background">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="h-10 bg-[#121a18] rounded-xl w-48 animate-pulse mx-auto" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-[#121a18] border border-primary/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="leaderboard" className="py-24 px-4 bg-background text-center text-danger font-semibold">
        <p>⚠️ {error}</p>
      </section>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        // Rank 1: Special Magenta Trophy highlight
        return <Trophy className="text-accent-magenta drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" size={24} />;
      case 2:
        return <Medal className="text-[#a1a1aa]" size={24} />;
      case 3:
        return <Medal className="text-[#b45309]" size={24} />;
      default:
        return <span className="font-sans font-bold text-sm text-[#9ca8a4]">{rank}</span>;
    }
  };

  return (
    <section id="leaderboard" className="py-24 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium font-serif mb-4 text-[#f1f5f3]">
            Green Leaderboard
          </h2>
          <p className="text-[#9ca8a4] max-w-xl mx-auto font-sans">
            Compare footprints across our awareness community. Ranks are based on total emissions—lower scores are better.
          </p>
        </div>

        {/* Leaderboard Table List */}
        <div className="space-y-3.5">
          {users.map((user, index) => {
            const isMe = user.id === 1;
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border transition-all ${
                  isMe
                    ? "bg-[#121a18] border-primary shadow-glow scale-[1.01]" // Glow background for 'You'
                    : "bg-[#121a18]/60 border-primary/5 hover:border-primary/10 hover:bg-[#121a18]/80"
                }`}
              >
                
                {/* Left side: Rank and name */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getRankIcon(user.rank)}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className={`font-sans font-bold ${isMe ? "text-primary text-base" : "text-[#f1f5f3] text-sm md:text-base"}`}>
                      {user.name} {isMe && <span className="text-[10px] bg-primary/20 text-primary border border-primary/25 rounded-md px-1.5 py-0.5 ml-2 uppercase font-extrabold tracking-wider">You</span>}
                    </span>
                    {user.streak_days > 0 && (
                      <span className="text-xs font-semibold text-warning/85 flex items-center gap-1 mt-0.5">
                        🔥 {user.streak_days} Day Streak
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side: Emissions score */}
                <div className="text-right flex items-center gap-6">
                  {/* Badges preview */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    {user.badges.slice(0, 2).map((badge) => (
                      <span
                        key={badge}
                        className="text-[10px] font-bold border border-primary/20 bg-surface/50 text-[#9ca8a4] rounded-full px-2.5 py-0.5"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="font-sans text-sm md:text-base font-bold text-[#f1f5f3]">
                    {user.total_co2.toFixed(1)}{" "}
                    <span className="text-xs text-[#9ca8a4] font-sans font-medium">kg CO2</span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
export default Leaderboard;

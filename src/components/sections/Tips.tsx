import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchTips } from "../../lib/api";
import type { TipsResponse } from "../../lib/api";
import { Lightbulb, Leaf, ShieldAlert, Sparkles, Compass } from "lucide-react";

interface TipsProps {
  refreshTrigger: number;
}

// Icons to rotate for the cards
const CARD_ICONS = [Lightbulb, Leaf, Compass, Sparkles];

/**
 * Tips - Displays dynamic, personalized recommendations.
 */
export function Tips({ refreshTrigger }: TipsProps) {
  const [tipsData, setTipsData] = useState<TipsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTips = async () => {
      try {
        setLoading(true);
        const data = await fetchTips();
        setTipsData(data);
        setError(null);
      } catch (err: any) {
        console.error("Tips error:", err);
        setError("Failed to load personalized tips.");
      } finally {
        setLoading(false);
      }
    };
    loadTips();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <section id="tips" className="py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="h-10 bg-[#121a18] rounded-xl w-48 animate-pulse mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-[#121a18] border border-primary/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !tipsData) {
    return (
      <section id="tips" className="py-24 px-4 bg-background text-center text-danger font-semibold">
        <p>⚠️ {error || "No tips available."}</p>
      </section>
    );
  }

  const category = tipsData.highest_emission_category;
  const tipsList = tipsData.tips;

  return (
    <section id="tips" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium font-serif mb-4 text-[#f1f5f3]">
            Personalized Tips
          </h2>
          
          {category ? (
            <div className="inline-flex items-center gap-2 border border-secondary/20 bg-surface px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-secondary shadow-md mt-2 mb-4">
              <ShieldAlert size={14} className="text-secondary" />
              Highest impact detected: <span className="text-[#f1f5f3] font-bold">{category}</span>
            </div>
          ) : (
            <p className="text-primary text-sm font-semibold mb-4">You have zero logged emissions. Great job!</p>
          )}

          <p className="text-[#9ca8a4] max-w-xl mx-auto font-sans mt-2">
            Targeted strategies designed to address your highest carbon-impact areas and help you cut emissions effectively.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tipsList.map((tipText, index) => {
            const Icon = CARD_ICONS[index % CARD_ICONS.length];
            const isBlue = index % 2 === 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -5 }}
                className="bg-[#121a18] border border-primary/10 rounded-3xl p-6 md:p-8 flex flex-col items-start shadow-md hover:shadow-glow transition-all"
              >
                {/* Icon wrapper */}
                <div
                  className={`p-3 rounded-2xl mb-6 ${
                    isBlue ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon size={24} />
                </div>

                {/* Subtitle / Tip Title */}
                <h3 className="text-xl font-medium font-serif text-[#f1f5f3] mb-3 leading-tight">
                  Strategy #<span className="font-sans font-semibold">{index + 1}</span>
                </h3>

                {/* Tip Description */}
                <p className="text-[#9ca8a4] font-sans text-sm md:text-base leading-relaxed">
                  {tipText}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
export default Tips;

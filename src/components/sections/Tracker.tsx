import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logActivity } from "../../lib/api";
import { Loader2, Plus, Sparkles } from "lucide-react";

interface TrackerProps {
  onActivityLogged: () => void;
}

const CATEGORIES = [
  { id: "transport", label: "Transport" },
  { id: "food", label: "Food" },
  { id: "energy", label: "Energy" },
  { id: "waste", label: "Waste" },
];

const SUBTYPES_CONFIG: Record<string, Record<string, { label: string; unit: string }>> = {
  transport: {
    car: { label: "Car Travel", unit: "km" },
    bus: { label: "Bus Transit", unit: "km" },
    bike: { label: "Bicycle Ride", unit: "km" },
    flight: { label: "Air Travel", unit: "km" },
  },
  food: {
    beef: { label: "Beef", unit: "kg" },
    chicken: { label: "Chicken", unit: "kg" },
    vegetarian_meal: { label: "Vegetarian Meal", unit: "meals" },
    dairy: { label: "Dairy & Milk", unit: "kg" },
  },
  energy: {
    electricity: { label: "Electricity Usage", unit: "kWh" },
    lpg: { label: "LPG (Gas Bottle)", unit: "kg" },
  },
  waste: {
    general: { label: "General Trash", unit: "kg" },
    recycled: { label: "Recycling / Compost", unit: "kg" },
  },
};

/**
 * Tracker - Activity logging section.
 * Renders tab selections, forms, and handles POST submissions.
 */
export function Tracker({ onActivityLogged }: TrackerProps) {
  const [activeCategory, setActiveCategory] = useState("transport");
  const [subtype, setSubtype] = useState("car");
  const [value, setValue] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "savings" } | null>(null);

  // Set default subtype when category changes
  useEffect(() => {
    const defaultSubtype = Object.keys(SUBTYPES_CONFIG[activeCategory])[0];
    setSubtype(defaultSubtype);
    setError(null);
  }, [activeCategory]);

  // Reset toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: { category: string; subtype: string; value: number; date?: string } = {
        category: activeCategory,
        subtype,
        value: Number(value),
      };
      
      if (date) {
        payload.date = date;
      }

      const response = await logActivity(payload);
      
      // Clear inputs
      setValue("");
      
      // Determine positive (emission) or negative (savings) message
      const co2 = response.co2_kg;
      if (co2 < 0) {
        setToast({
          message: `Eco Savings! ${Math.abs(co2).toFixed(1)} kg CO2 saved.`,
          type: "savings"
        });
      } else {
        setToast({
          message: `Logged! +${co2.toFixed(1)} kg CO2 footprint added.`,
          type: "success"
        });
      }

      // Notify parent to reload other sections (Dashboard, Streak, Leaderboard)
      onActivityLogged();
    } catch (err: any) {
      setError(err?.message || "Failed to log activity. Please verify backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const currentUnit = SUBTYPES_CONFIG[activeCategory][subtype]?.unit || "units";

  return (
    <section id="tracker" className="py-24 px-4 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto z-10 relative">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium font-serif mb-4 text-[#f1f5f3]">
            Log Your Activities
          </h2>
          <p className="text-[#9ca8a4] max-w-xl mx-auto font-sans">
            Submit your daily activities. We'll crunch the numbers instantly and compute your footprint using vetted emission factors.
          </p>
        </div>

        {/* Logging Box */}
        <div className="bg-[#121a18] border border-primary/20 rounded-3xl p-6 md:p-10 shadow-glow relative">
          
          {/* Category Tabs */}
          <div className="flex justify-between border-b border-primary/10 pb-4 mb-8 overflow-x-auto gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative pb-3 px-4 text-base font-semibold font-sans transition-colors outline-none whitespace-nowrap ${
                    isActive ? "text-primary font-bold" : "text-[#9ca8a4] hover:text-primary/70"
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <motion.div
                      layoutId="active-tracker-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Subtype Dropdown */}
              <div className="flex flex-col gap-2">
                <label htmlFor="subtype-select" className="text-sm font-bold uppercase tracking-wider text-primary">
                  Activity Type
                </label>
                <select
                  id="subtype-select"
                  value={subtype}
                  onChange={(e) => setSubtype(e.target.value)}
                  className="bg-[#0a0f0d] border border-primary/15 rounded-xl px-4 py-3 text-[#f1f5f3] focus:outline-none focus:ring-1 focus:ring-primary hover:border-primary/30 transition-all font-sans font-semibold cursor-pointer"
                >
                  {Object.entries(SUBTYPES_CONFIG[activeCategory]).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Numeric Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="value-input" className="text-sm font-bold uppercase tracking-wider text-primary flex justify-between">
                  <span>Amount</span>
                  <span className="text-[#9ca8a4] normal-case font-medium">({currentUnit})</span>
                </label>
                <div className="relative">
                  <input
                    id="value-input"
                    type="number"
                    step="any"
                    min="0"
                    placeholder={`e.g. 15`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-[#0a0f0d] border border-primary/15 rounded-xl pl-4 pr-16 py-3 text-[#f1f5f3] placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary hover:border-primary/30 transition-all font-sans font-semibold"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#9ca8a4] pointer-events-none">
                    {currentUnit}
                  </div>
                </div>
              </div>

              {/* Date Input */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="date-input" className="text-sm font-bold uppercase tracking-wider text-primary">
                  Date <span className="text-zinc-500 font-medium normal-case">(Optional, defaults to Today)</span>
                </label>
                <input
                  id="date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-[#0a0f0d] border border-primary/15 rounded-xl px-4 py-3 text-[#f1f5f3] focus:outline-none focus:ring-1 focus:ring-primary hover:border-primary/30 transition-all font-sans font-medium cursor-pointer"
                />
              </div>

            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-danger font-sans text-sm font-bold"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-primary text-[#0a0f0d] font-sans font-black rounded-xl hover:bg-primary/95 transition-all shadow-glow flex items-center justify-center gap-2 outline-none disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Plus size={18} strokeWidth={3} />
                  Log Activity
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Custom Toast Alert - Blue Accent Color Theme */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#11181f] border border-secondary/40 text-secondary px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md"
            >
              <div className="p-2 rounded-full bg-secondary/15">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <span className="font-sans font-extrabold text-sm">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
export default Tracker;

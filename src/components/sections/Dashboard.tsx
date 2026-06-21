import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  fetchDashboardSummary,
  fetchLeaderboard,
  fetchActivities,
} from "../../lib/api";
import type { DashboardSummary } from "../../lib/api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Award, Calendar, Flame, TrendingUp } from "lucide-react";

interface DashboardProps {
  refreshTrigger: number;
}

const COLORS = {
  transport: "#2dd4a7", // Teal-Green
  food: "#38bdf8",      // Blue
  energy: "#f0b860",    // Amber
  waste: "#ec4899",     // Magenta
};

const CATEGORY_NAMES = {
  transport: "Transport",
  food: "Food",
  energy: "Energy",
  waste: "Waste",
};

/**
 * AnimatedCounter - Simple count-up effect on mount.
 */
function AnimatedCounter({ value, decimals = 1 }: { value: number; decimals?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCurrent(end);
      return;
    }

    const duration = 1200; // ms
    const increment = end / (duration / 16); // ~60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCurrent(end);
      } else {
        setCurrent(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{current.toFixed(decimals)}</span>;
}

/**
 * Dashboard - Metrics, donut breakdown, and 7-day trend chart.
 */
export function Dashboard({ refreshTrigger }: DashboardProps) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Load summary
        const summaryData = await fetchDashboardSummary();
        setSummary(summaryData);

        // Load leaderboard to extract User 1's rank
        const leaderboard = await fetchLeaderboard();
        const me = leaderboard.find((u) => u.id === 1);
        if (me) {
          setRank(me.rank);
        }

        // Load 7-day activities to construct trend data
        const activities = await fetchActivities("7days");
        
        // Group activities by local date for chart
        const data = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const offset = d.getTimezoneOffset();
          const localD = new Date(d.getTime() - (offset * 60 * 1000));
          const dateStr = localD.toISOString().split("T")[0];

          const dayActs = activities.filter((a) => a.date === dateStr);
          const totalCo2 = dayActs.reduce((sum, a) => sum + a.co2_kg, 0);
          const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

          data.push({
            date: dateStr,
            label: dayLabel,
            co2: Number(totalCo2.toFixed(2)),
          });
        }
        setChartData(data);
        setError(null);
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard metrics. Ensure server is active.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <section id="dashboard" className="py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Dashboard Title Skeleton */}
          <div className="h-10 bg-[#121a18] rounded-xl w-48 animate-pulse mx-auto" />
          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-[#121a18] border border-primary/5 rounded-2xl animate-pulse" />
            ))}
          </div>
          {/* Charts Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-80 bg-[#121a18] border border-primary/5 rounded-3xl animate-pulse" />
            <div className="h-80 bg-[#121a18] border border-primary/5 rounded-3xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !summary) {
    return (
      <section id="dashboard" className="py-24 px-4 bg-background text-center text-danger font-semibold">
        <p>⚠️ {error || "No dashboard data available."}</p>
      </section>
    );
  }

  // Format category breakdown for Pie Chart
  const pieData = Object.entries(summary.category_breakdown)
    .map(([key, val]) => ({
      name: CATEGORY_NAMES[key as keyof typeof CATEGORY_NAMES] || key,
      value: val,
      key: key as keyof typeof COLORS,
    }))
    .filter((item) => item.value > 0 || item.value < 0); // Include negative (waste savings) but filter absolute 0

  // Color code emissions status (Today's emission)
  const getTodayColor = (co2: number) => {
    if (co2 < 5) return "text-primary";      // Green/Teal (Low)
    if (co2 <= 15) return "text-warning";    // Amber (Medium)
    return "text-danger";                    // Red-Orange (High)
  };

  const trendIsUp = summary.trend_vs_last_week > 0;
  const trendColor = trendIsUp ? "text-danger" : "text-primary";

  return (
    <section id="dashboard" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium font-serif mb-4 text-[#f1f5f3]">
            Performance Insights
          </h2>
          <p className="text-[#9ca8a4] max-w-xl mx-auto font-sans">
            A comprehensive snapshot of your greenhouse gas footprint, emission trends, and relative community ranking.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          
          {/* Card 1: Today's CO2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#121a18] border border-primary/10 rounded-2xl p-6 shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Today's CO2</span>
              <Calendar size={18} className="text-primary" />
            </div>
            <p className={`text-4xl font-sans font-bold ${getTodayColor(summary.today_total_co2)}`}>
              <AnimatedCounter value={summary.today_total_co2} />
              <span className="text-sm font-sans font-medium text-[#9ca8a4] ml-1">kg</span>
            </p>
            <p className="text-xs text-[#9ca8a4] mt-2">Emissions logged today</p>
          </motion.div>

          {/* Card 2: This Week's CO2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#121a18] border border-primary/10 rounded-2xl p-6 shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">This Week</span>
              <Flame size={18} className="text-primary" />
            </div>
            <p className="text-4xl font-sans font-bold text-[#f1f5f3]">
              <AnimatedCounter value={summary.this_week_total_co2} />
              <span className="text-sm font-sans font-medium text-[#9ca8a4] ml-1">kg</span>
            </p>
            <p className="text-xs text-[#9ca8a4] mt-2">Cumulative last 7 days</p>
          </motion.div>

          {/* Card 3: Trend */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#121a18] border border-primary/10 rounded-2xl p-6 shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Weekly Trend</span>
              <TrendingUp size={18} className="text-[#9ca8a4]" />
            </div>
            <div className="flex items-center gap-1.5">
              <p className={`text-4xl font-sans font-bold ${trendColor}`}>
                {trendIsUp ? "+" : ""}
                <AnimatedCounter value={summary.trend_vs_last_week} decimals={1} />
                <span className="text-sm font-sans font-medium text-[#9ca8a4] ml-1">%</span>
              </p>
              {trendIsUp ? (
                <ArrowUpRight className="text-danger" size={24} />
              ) : (
                <ArrowDownRight className="text-primary" size={24} />
              )}
            </div>
            <p className="text-xs text-[#9ca8a4] mt-2">Vs. previous 7-day period</p>
          </motion.div>

          {/* Card 4: Rank */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#121a18] border border-primary/10 rounded-2xl p-6 shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Global Rank</span>
              <Award size={18} className="text-primary" />
            </div>
            <p className="text-4xl font-sans font-bold text-[#f1f5f3]">
              #{rank !== null ? rank : "—"}
            </p>
            <p className="text-xs text-[#9ca8a4] mt-2">Leaderboard position</p>
          </motion.div>

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Chart 1: Donut Breakdown */}
          <div className="bg-[#121a18] border border-primary/10 rounded-3xl p-6 md:p-8 shadow-md">
            <h3 className="text-xl font-medium font-serif mb-6 text-[#f1f5f3]">Category Distribution</h3>
            
            <div className="h-64 flex flex-col md:flex-row items-center justify-center gap-6">
              {pieData.length > 0 ? (
                <>
                  <div className="w-full h-48 md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.key]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#121a18",
                            border: "1px solid rgba(45, 212, 167, 0.2)",
                            borderRadius: "10px",
                          }}
                          itemStyle={{ color: "#f1f5f3", fontFamily: "Manrope" }}
                          formatter={(value: any) => [`${Number(value).toFixed(1)}%`]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-col gap-2.5 w-full md:w-1/2">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[item.key] }}
                          />
                          <span className="font-semibold text-[#f1f5f3]">{item.name}</span>
                        </div>
                        <span className="font-mono text-[#9ca8a4]">{item.value.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-zinc-600 font-sans text-sm">No activity recorded to generate breakdown.</p>
              )}
            </div>
          </div>

          {/* Chart 2: 7-Day Trend */}
          <div className="bg-[#121a18] border border-primary/10 rounded-3xl p-6 md:p-8 shadow-md">
            <h3 className="text-xl font-medium font-serif mb-6 text-[#f1f5f3]">7-Day Trend</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2623" />
                  <XAxis
                    dataKey="label"
                    stroke="#5a6864"
                    fontSize={11}
                    fontFamily="Manrope"
                    dy={10}
                  />
                  <YAxis
                    stroke="#5a6864"
                    fontSize={11}
                    fontFamily="Manrope"
                    dx={-5}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#121a18",
                      border: "1px solid rgba(45, 212, 167, 0.2)",
                      borderRadius: "10px",
                    }}
                    labelStyle={{ color: "#2dd4a7", fontWeight: "bold" }}
                    itemStyle={{ color: "#f1f5f3", fontFamily: "Manrope" }}
                    formatter={(value: any) => [`${value} kg CO2`]}
                  />
                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke="#2dd4a7"
                    strokeWidth={3}
                    dot={{ fill: "#2dd4a7", strokeWidth: 1, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
export default Dashboard;

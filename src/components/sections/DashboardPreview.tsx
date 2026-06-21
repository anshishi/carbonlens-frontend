import { ContainerScroll } from "../ui/container-scroll-animation";
import { Calendar, Flame, TrendingDown, Award } from "lucide-react";

/**
 * DashboardPreview - Wrapper for ContainerScroll animation.
 * Displays a premium mock dashboard in the 3D scroll card.
 */
export function DashboardPreview() {
  return (
    <section className="bg-background relative -mt-36 md:-mt-48 pointer-events-none">
      <ContainerScroll
        titleComponent={
          <h2 className="text-3xl md:text-6xl font-medium font-serif text-[#f1f5f3] leading-tight">
            Track Your Impact, <br />
            <span className="text-primary">See Real Results</span>
          </h2>
        }
      >
        <div className="w-full h-full p-4 md:p-8 flex flex-col justify-between">
          {/* Header Bar Mock */}
          <div className="flex items-center justify-between border-b border-primary/10 pb-4 mb-4 md:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-primary" />
              <span className="text-sm font-bold font-sans text-[#f1f5f3]">Dashboard Overview</span>
            </div>
            <div className="w-24 h-6 rounded-full bg-primary/10 border border-primary/15" />
          </div>

          {/* 4 Stat Cards Mock */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            
            {/* Card 1 */}
            <div className="bg-[#121a18] border border-primary/5 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[#9ca8a4] mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider">Today's CO2</span>
                <Calendar size={14} className="text-primary" />
              </div>
              <div className="text-lg md:text-2xl font-sans font-bold text-primary">12.4 kg</div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#121a18] border border-primary/5 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[#9ca8a4] mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider">Streak</span>
                <Flame size={14} className="text-primary" />
              </div>
              <div className="text-lg md:text-2xl font-sans font-bold text-[#f1f5f3]">4 Days</div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#121a18] border border-primary/5 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[#9ca8a4] mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider">Trend</span>
                <TrendingDown size={14} className="text-primary" />
              </div>
              <div className="text-lg md:text-2xl font-sans font-bold text-primary">-18.4%</div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#121a18] border border-primary/5 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[#9ca8a4] mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider">Rank</span>
                <Award size={14} className="text-primary" />
              </div>
              <div className="text-lg md:text-2xl font-sans font-bold text-[#f1f5f3]">#2</div>
            </div>

          </div>

          {/* Graphic Grid Mock */}
          <div className="flex-1 bg-[#121a18]/45 border border-primary/5 rounded-2xl p-4 flex gap-4">
            {/* Left Box (Mock Chart) */}
            <div className="flex-1 border border-primary/5 rounded-xl bg-[#0a0f0d] flex items-center justify-center relative overflow-hidden">
              {/* Fake Line Chart SVG */}
              <svg className="w-full h-full opacity-35" viewBox="0 0 400 150">
                <path
                  d="M 10 130 Q 80 80, 150 110 T 300 40 T 390 20"
                  fill="none"
                  stroke="#2dd4a7"
                  strokeWidth="3"
                />
                <circle cx="150" cy="110" r="4" fill="#2dd4a7" />
                <circle cx="300" cy="40" r="4" fill="#2dd4a7" />
                <line x1="10" y1="135" x2="390" y2="135" stroke="#1c2623" strokeWidth="1" />
              </svg>
            </div>
            
            {/* Right Box (Mock Info) */}
            <div className="w-1/3 hidden md:flex flex-col justify-between border border-primary/5 rounded-xl bg-[#0a0f0d] p-4">
              <div className="w-full h-4 bg-primary/10 rounded" />
              <div className="w-full h-4 bg-primary/5 rounded" />
              <div className="w-4/5 h-4 bg-primary/5 rounded" />
              <div className="w-2/3 h-4 bg-primary/5 rounded" />
            </div>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
export default DashboardPreview;

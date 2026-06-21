import { motion } from "framer-motion";
import DottedSurface from "../ui/dotted-surface";

/**
 * Hero section for CarbonLens.
 * Features the DottedSurface background and introduction CTA.
 */
export function Hero() {
  const handleScrollToTracker = () => {
    const trackerSection = document.getElementById("tracker");
    if (trackerSection) {
      trackerSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-background"
    >
      {/* 3D Particle wave background */}
      <DottedSurface />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f0d]/10 to-[#0a0f0d] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto z-10 flex flex-col items-center"
      >
        {/* Animated tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-primary/20 bg-surface px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-primary shadow-glow mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Join the Green Transition
        </motion.div>

        {/* Title */}
        <h1 className="text-4xl md:text-7xl font-medium font-serif text-[#f1f5f3] leading-none mb-6">
          Carbon<span className="text-primary">Lens</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl font-sans font-medium text-[#9ca8a4] max-w-2xl mx-auto mb-10 leading-relaxed">
          See your impact clearly. Track it. Reduce it. Empower your ecological footprint with precision calculations.
        </p>

        {/* Action Button with special magenta glow pop */}
        <motion.button
          onClick={handleScrollToTracker}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-primary text-[#0a0f0d] font-sans font-extrabold text-base md:text-lg rounded-full transition-all duration-300 shadow-glow hover:shadow-glow-magenta outline-none hover:bg-primary/95 border border-primary/10"
        >
          Start Tracking
        </motion.button>
      </motion.div>
    </section>
  );
}
export default Hero;

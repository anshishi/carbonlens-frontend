import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

interface ContainerScrollProps {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}

/**
 * ContainerScroll - A scroll-triggered 3D card tilting animation.
 * Smoothly rotates and scales the inner dashboard preview card as the user scrolls.
 */
export const ContainerScroll = ({ titleComponent, children }: ContainerScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start animation as container enters, finalize when it's fully in view
    offset: ["start end", "end start"],
  });

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.85, 0.95] : [1.05, 1];
  };

  // Maps scroll progress to rotation (20deg tilt down to 0deg flat)
  const rotate = useTransform(scrollYProgress, [0, 0.35], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.35], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.35], [0, -70]);

  return (
    <div
      className="h-[50rem] md:h-[70rem] flex items-center justify-center relative p-4 md:p-10"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-20 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

interface HeaderProps {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}

export const Header = ({ translate, titleComponent }: HeaderProps) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center mb-8 md:mb-12"
    >
      {titleComponent}
    </motion.div>
  );
};

interface CardProps {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}

export const Card = ({ rotate, scale, children }: CardProps) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
      }}
      className="max-w-5xl mx-auto h-[26rem] md:h-[38rem] w-full border border-primary/20 p-2 md:p-4 bg-[#121a18] rounded-[24px] shadow-glow"
    >
      <div className="h-full w-full overflow-hidden rounded-[18px] bg-[#0a0f0d] border border-primary/10">
        {children}
      </div>
    </motion.div>
  );
};

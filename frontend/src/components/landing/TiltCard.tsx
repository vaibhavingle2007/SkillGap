"use client";

import { useRef, ReactNode, CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  tiltStrength?: number;
}

export default function TiltCard({ children, className = "", tiltStrength = 10, glowColor = "rgba(99, 102, 241, 0.3)" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [tiltStrength, -tiltStrength]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-tiltStrength, tiltStrength]), {
    stiffness: 300,
    damping: 30,
  });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!ref.current || shouldReduce) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
  };

  const handlePointerLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
        "--gx": `${x.get() * 100}%`,
        "--gy": `${y.get() * 100}%`,
      } as CSSProperties & Record<`--${string}`, string>}
      className={`relative ${className}`}
    >
      {/* Glow effect following cursor */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at var(--gx) var(--gy), ${glowColor} 0%, transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

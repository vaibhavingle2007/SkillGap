"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export default function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: RevealProps) {
  const shouldReduce = useReducedMotion();

  const directions = {
    up: { y: 28, x: 0 },
    down: { y: -28, x: 0 },
    left: { y: 0, x: 28 },
    right: { y: 0, x: -28 },
  };

  const d = directions[direction];

  return (
    <motion.div
      initial={shouldReduce ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: d.y, x: d.x }}
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >

      {children}
    </motion.div>
  );
}

"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

// Custom easing — "easeOutExpo" feel: fast start, long gentle settle.
// This is what gives animations a premium, fluid feel.
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
const EASE_OUT_QUINT = [0.16, 1, 0.3, 1] as const;

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 16,
  ...props
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.7, delay, ease: EASE_OUT_EXPO }
      }
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStagger({
  children,
  className,
  stagger = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : stagger,
            delayChildren: prefersReducedMotion ? 0 : 0.05,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({
  children,
  className,
  y = 20,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      variants={
        prefersReducedMotion
          ? {
              hidden: { opacity: 1 },
              show: { opacity: 1 },
            }
          : {
              hidden: { opacity: 0, y },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: EASE_OUT_QUINT },
              },
            }
      }
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

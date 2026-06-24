"use client"; 
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import type { LucideIcon } from "lucide-react";
interface ActionItem {
  title: string;
  body: string;
  iconBg: string;
  iconColor: string;
  icon: LucideIcon;
}
interface ActionCardProps {
  a: ActionItem;
  index: number;
}
export default function ActionCard({ a, index }: ActionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const tiltX = useSpring(useTransform(mouseY, [0, 1], [7, -7]), { damping: 20, stiffness: 220 });
  const tiltY = useSpring(useTransform(mouseX, [0, 1], [-7, 7]), { damping: 20, stiffness: 220 });
  const glowX = useTransform(mouseX, [0, 1], [0, 300]);
  const glowY = useTransform(mouseY, [0, 1], [0, 180]);
  const glowBg = useMotionTemplate`radial-gradient(240px circle at ${glowX}px ${glowY}px, rgba(220,38,38,0.14), transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); }}
      //initial={{ opacity: 0, y: 25 }}
    //  whileInView={{ opacity: 1, y: 0 }}
      //viewport={{ once: true, margin: "-100px" }}
     // transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      className="relative rounded-2xl p-6 border border-neutral-200 hover:border-ink-950 bg-white overflow-hidden cursor-pointer group shadow-sm transition-colors duration-300"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: glowBg }}
      />

      <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
        <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${a.iconBg}`}>
          <a.icon size={22} className={a.iconColor} />
        </div>
        <h3 className="font-display text-lg font-bold text-ink-950 mb-2 transition-all duration-300 group-hover:translate-x-1 group-hover:text-danger-600 select-none">
          {a.title}
        </h3>
        <p className="text-sm text-ink-500 leading-relaxed select-none transition-all duration-300 group-hover:text-ink-700">
          {a.body}
        </p>
      </div>
    </motion.div>
  );
}

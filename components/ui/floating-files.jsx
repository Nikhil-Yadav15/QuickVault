"use client";
import { motion } from "framer-motion";
import { FileText, Image, Film, Music, Archive, Code, FileSpreadsheet, Presentation } from "lucide-react";

const fileTypes = [
  { Icon: FileText, color: "#10b981", label: "DOC", x: -80, y: -120, delay: 0 },
  { Icon: Image, color: "#06b6d4", label: "IMG", x: 100, y: -80, delay: 0.3 },
  { Icon: Film, color: "#8b5cf6", label: "MP4", x: -120, y: 40, delay: 0.6 },
  { Icon: Music, color: "#f59e0b", label: "MP3", x: 80, y: 80, delay: 0.9 },
  { Icon: Archive, color: "#ef4444", label: "ZIP", x: 0, y: -160, delay: 1.2 },
  { Icon: Code, color: "#3b82f6", label: "JS", x: 130, y: 10, delay: 0.4 },
  { Icon: FileSpreadsheet, color: "#22c55e", label: "CSV", x: -140, y: -40, delay: 0.7 },
  { Icon: Presentation, color: "#ec4899", label: "PPT", x: 40, y: 140, delay: 1.0 },
];

function FloatingFileCard({ Icon, color, label, x, y, delay }) {
  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{
        opacity: [0, 1, 1, 0.8, 1],
        scale: [0.3, 1, 1.05, 0.95, 1],
        x: [0, x * 0.8, x, x * 1.05, x],
        y: [0, y * 0.8, y, y * 1.05, y],
        rotateY: [0, 15, -10, 5, 0],
        rotateX: [0, -10, 5, -3, 0],
      }}
      transition={{
        duration: 2,
        delay: delay,
        ease: "easeOut",
      }}
      style={{ perspective: "800px" }}
    >
      <motion.div
        className="relative p-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg cursor-default"
        style={{
          background: `linear-gradient(135deg, ${color}15, ${color}08)`,
          boxShadow: `0 8px 32px ${color}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
        animate={{
          y: [0, -8, 0, 6, 0],
          rotateZ: [0, 2, 0, -2, 0],
        }}
        transition={{
          duration: 4 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.2,
          boxShadow: `0 12px 40px ${color}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
        }}
      >
        <Icon size={28} style={{ color }} strokeWidth={1.5} />
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0"
          style={{
            background: `linear-gradient(135deg, ${color}30, transparent)`,
          }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: delay + 1 }}
        />
      </motion.div>
      <span className="text-[10px] font-mono text-white/30 tracking-wider">{label}</span>
    </motion.div>
  );
}

// Animated connection lines between file nodes
function ConnectionLines() {
  const paths = [
    "M0,0 Q60,-80 100,-60",
    "M0,0 Q-40,-60 -80,-40",
    "M0,0 Q50,40 80,80",
    "M0,0 Q-60,20 -120,40",
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="url(#line-grad)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 + i * 0.3, ease: "easeOut" }}
          style={{ transform: "translate(50%, 50%)" }}
        />
      ))}
    </svg>
  );
}

// Central pulsing hub
function CenterHub() {
  return (
    <motion.div
      className="absolute flex items-center justify-center"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "backOut" }}
    >
      <motion.div
        className="w-16 h-16 rounded-full border border-emerald-500/20 flex items-center justify-center"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
        }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(16,185,129,0.1), 0 0 40px rgba(16,185,129,0.05)",
            "0 0 30px rgba(16,185,129,0.2), 0 0 60px rgba(16,185,129,0.1)",
            "0 0 20px rgba(16,185,129,0.1), 0 0 40px rgba(16,185,129,0.05)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      {/* Outer ring pulse */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border border-emerald-500/10"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      />
    </motion.div>
  );
}

export default function FloatingFiles({ className = "" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ minHeight: "320px" }}>
      <ConnectionLines />
      <CenterHub />
      {fileTypes.map((file, i) => (
        <FloatingFileCard key={i} {...file} />
      ))}
    </div>
  );
}

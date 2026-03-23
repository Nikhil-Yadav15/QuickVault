"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PARTICLE_COUNT = 40;
const COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#22c55e", "#ec4899"];
const SHAPES = ["circle", "square", "star"];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function Particle({ color, shape, delay }) {
  const angle = randomBetween(0, 360);
  const distance = randomBetween(80, 260);
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;
  const size = randomBetween(4, 10);
  const rotation = randomBetween(0, 720);
  const duration = randomBetween(1.2, 2.2);

  const shapeClass =
    shape === "circle"
      ? "rounded-full"
      : shape === "star"
      ? "rotate-45"
      : "rounded-sm";

  return (
    <motion.div
      className={`absolute ${shapeClass}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}80`,
        left: "50%",
        top: "50%",
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{
        x,
        y,
        opacity: [1, 1, 0],
        scale: [1, 1.2, 0.3],
        rotate: rotation,
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  );
}

export default function ConfettiBurst({ trigger }) {
  const [particles, setParticles] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: Date.now() + i,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        delay: randomBetween(0, 0.3),
      }));
      setParticles(newParticles);
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
        setParticles([]);
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-50 overflow-visible"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {particles.map((p) => (
            <Particle key={p.id} color={p.color} shape={p.shape} delay={p.delay} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

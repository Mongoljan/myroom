"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation } from "motion/react";
import { cn } from "@/lib/utils";

type SparklesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = ({
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  speed = 4,
  particleColor = "#FFFFFF",
  particleDensity = 120,
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    controls.start({ opacity: 1, transition: { duration: 1 } });

    type Particle = {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      opacityDir: number;
    };

    let particles: Particle[] = [];
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Recreate particles on resize
      const count = Math.floor(
        (canvas.width * canvas.height) / (400 * 400 / particleDensity)
      );
      particles = Array.from({ length: Math.max(count, 20) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: minSize + Math.random() * (maxSize - minSize),
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random(),
        opacityDir: Math.random() > 0.5 ? 1 : -1,
      }));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.opacity));
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacityDir * (speed / 400);

        if (p.opacity <= 0.05 || p.opacity >= 1) p.opacityDir *= -1;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [minSize, maxSize, speed, particleColor, particleDensity, controls]);

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ background }}
      />
    </motion.div>
  );
};

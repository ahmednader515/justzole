"use client";

import { useEffect, useRef } from "react";

export function CyberAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    let visible = false;
    let width = 0;
    let height = 0;
    let drops: number[] = [];
    const cell = 23;
    function resize() {
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      drops = Array.from(
        { length: Math.ceil(width / cell) },
        () => (Math.random() * -height) / cell,
      );
    }
    function draw(now: number) {
      if (!visible || reduced.matches || document.hidden) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(draw);
      if (now - previous < 75) return;
      previous = now;
      context!.fillStyle = "rgba(8, 7, 10, 0.13)";
      context!.fillRect(0, 0, width, height);
      context!.font = "11px monospace";
      drops.forEach((drop, index) => {
        context!.fillStyle = index % 5 === 0 ? "#ff6375" : "#a52134";
        context!.fillText(
          "01ZX/<>"[Math.floor(Math.random() * 7)],
          index * cell,
          drop * cell,
        );
        drops[index] =
          drop * cell > height && Math.random() > 0.98 ? 0 : drop + 0.45;
      });
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (visible && !reduced.matches && !document.hidden)
        frame = requestAnimationFrame(draw);
      else context!.clearRect(0, 0, width, height);
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <div className="cyber-atmosphere" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="cyber-grid" />
      <div className="cyber-scan" />
    </div>
  );
}

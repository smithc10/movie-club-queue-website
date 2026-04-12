import { useEffect, useRef } from "react";
import type { FallbackProps } from "react-error-boundary";

function StaticCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(draw);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />;
}

export function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ position: "relative", overflow: "hidden" }}>
      <StaticCanvas />
      <div className="bg-card rounded-2xl border border-primary/50 p-8 max-w-md w-full text-center" style={{ position: "relative", zIndex: 10 }}>
        <div className="text-4xl font-bold text-foreground mb-4">Technical Difficulties</div>
        <p className="text-muted-foreground mb-2">
          {error.message || "An unexpected error occurred"}
        </p>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={280}
      style={{ border: "1px solid black", touchAction: "none" }}
    />
  );
}

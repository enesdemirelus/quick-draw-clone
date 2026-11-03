"use client";

import axios from "axios";
import { useRef, type PointerEvent } from "react";

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  async function handlePredict() {
    const pixels = getPixels();
    if (!pixels) return;

    try {
      const { data } = await axios.post("http://localhost:8000/predict", {
        pixels,
      });

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handlePointerDown(e: PointerEvent<HTMLCanvasElement>) {
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  function getPixels() {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const smallCanvas = document.createElement("canvas");
    smallCanvas.width = 28;
    smallCanvas.height = 28;

    const ctx = smallCanvas.getContext("2d");
    if (!ctx) return null;

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(canvas, 0, 0, 28, 28);

    const { data } = ctx.getImageData(0, 0, 28, 28);
    const pixels: number[] = [];

    for (let i = 3; i < data.length; i += 4) {
      pixels.push(data[i]);
    }

    return pixels;
  }

  function handleDelete() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function handlePointerMove(e: PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;

    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  }

  function handlePointerUp() {
    isDrawing.current = false;
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ border: "1px solid black", touchAction: "none" }}
      />
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
      <button type="button" onClick={handlePredict}>
        Predict
      </button>
    </div>
  );
}

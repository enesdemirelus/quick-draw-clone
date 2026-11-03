"use client";

import axios from "axios";
import { useRef, useState, type PointerEvent } from "react";

type Prediction = {
  label: string;
  probability: number;
};

type Status = "idle" | "loading" | "error";

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const [hasDrawing, setHasDrawing] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  async function handlePredict() {
    const pixels = getPixels();
    if (!pixels) return;

    setStatus("loading");

    try {
      const { data } = await axios.post<{ predictions: Prediction[] }>(
        "http://localhost:8000/predict",
        { pixels },
      );

      setPredictions(data.predictions);
      setStatus("idle");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  function handlePointerDown(e: PointerEvent<HTMLCanvasElement>) {
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    setHasDrawing(true);

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

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    setPredictions([]);
    setStatus("idle");
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

  const [top, ...rest] = predictions;

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="block cursor-crosshair rounded-xl bg-white"
            style={{ touchAction: "none" }}
          />
          {!hasDrawing && (
            <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-stone-400">
              Draw here
            </p>
          )}
        </div>

        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasDrawing}
            className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handlePredict}
            disabled={!hasDrawing || status === "loading"}
            className="flex-1 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? "Guessing…" : "Guess"}
          </button>
        </div>
      </div>

      <section className="w-full max-w-74 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:min-h-74">
        <h2 className="text-xs font-medium uppercase tracking-wider text-stone-400">
          Prediction
        </h2>

        {status === "error" ? (
          <p className="mt-3 text-sm text-red-600">
            Couldn&apos;t reach the API. Is it running on localhost:8000?
          </p>
        ) : top ? (
          <>
            <p className="mt-2 text-sm text-stone-500">I think it&apos;s a…</p>
            <p className="text-3xl font-semibold capitalize">{top.label}</p>

            <ul className="mt-6 space-y-3">
              {[top, ...rest].map((p) => (
                <li key={p.label}>
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-stone-700">{p.label}</span>
                    <span className="tabular-nums text-stone-500">
                      {(p.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-stone-900 transition-[width] duration-500"
                      style={{ width: `${p.probability * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-sm text-stone-400">
            Draw something, then press Guess.
          </p>
        )}
      </section>
    </div>
  );
}

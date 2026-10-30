from pathlib import Path

import numpy as np
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model import CNN

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


CLASSES = ["cat", "dog", "house", "car", "tree", "apple", "fish", "bicycle", "star", "airplane"]

MODEL_PATH = Path(__file__).parent.parent / "ml" / "best_model.pt"

model = CNN()
model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
model.eval()

class DrawingRequest(BaseModel):
    pixels: list[float]


def preprocess(pixels: list[float]) -> torch.Tensor:
    if len(pixels) != 784:
        raise HTTPException(status_code=400, detail="Expected 784 pixels")

    x = np.array(pixels, dtype=np.float32) / 255.0
    x = (x - 0.5) / 0.5
    return torch.from_numpy(x).reshape(1, 1, 28, 28)

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(req: DrawingRequest):
    x = preprocess(req.pixels)

    with torch.no_grad():
        probs = torch.softmax(model(x), dim=1)[0]

    top = torch.topk(probs, 3)
    return {
        "predictions": [
            {"label": CLASSES[i], "probability": round(p.item(), 4)}
            for p, i in zip(top.values, top.indices)
        ]
    }
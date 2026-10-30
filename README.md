# quick-draw-clone

A doodle classifier inspired by Google's [Quick, Draw!](https://quickdraw.withgoogle.com/). Draw something, and a CNN guesses what it is.

Trained on 10 classes from the [Quick, Draw! dataset](https://github.com/googlecreativelab/quickdraw-dataset):

`cat` · `dog` · `house` · `car` · `tree` · `apple` · `fish` · `bicycle` · `star` · `airplane`

![Sample drawings](apps/ml/images/samples.png)

## Project structure

```
apps/
├── ml/    # data download, exploration, model training (PyTorch)
├── api/   # inference API (coming soon)
└── web/   # Next.js drawing app (coming soon)
```

## Model

A small CNN on 28×28 grayscale bitmaps:

| Layer | Output |
| --- | --- |
| Conv 3×3 (32) → ReLU → MaxPool | 32 × 14 × 14 |
| Conv 3×3 (64) → ReLU → MaxPool | 64 × 7 × 7 |
| Conv 3×3 (128) → ReLU → MaxPool | 128 × 3 × 3 |
| Flatten → Linear (128) → ReLU → Dropout 0.3 | 128 |
| Linear | 10 |

**Training setup**

- 30,000 drawings per class (300,000 total)
- Split: 216,000 train / 24,000 validation / 60,000 test
- Pixels scaled to `[-1, 1]`
- AdamW (lr `3e-4`, weight decay `1e-2`), batch size 128, 10 epochs
- Best checkpoint chosen by validation loss

## Results

**Test accuracy: 94.4%** (test loss 0.174)

![Training curves](apps/ml/images/model.png)

Validation accuracy levels off around 94.7% while training accuracy keeps rising, so the model starts to overfit after about 5 epochs.

## Running the ML part

```bash
cd apps/ml
pip install torch numpy matplotlib jupyter
```

Then run the notebooks in order:

1. `01_download_data.ipynb`: downloads the `.npy` files into `data/` (~1.1 GB)
2. `02_explore_data.ipynb`: shows one example per class
3. `03_train_model.ipynb`: trains the CNN and saves `best_model.pt`

Training uses Apple Silicon (`mps`) if available, otherwise CPU.

## Roadmap

- [ ] Next.js app with a drawing canvas
- [ ] API to serve predictions
- [x] Train the classifier

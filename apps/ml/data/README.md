# data

Training data for the model. Files here are **not committed** (see root `.gitignore`); only this README is tracked.

## How to get it

Run `apps/ml/01_download_data.ipynb` from `apps/ml/`. It downloads each class into this folder and skips files that already exist.

## Contents

One file per class from the [Quick, Draw! dataset](https://github.com/googlecreativelab/quickdraw-dataset) (`numpy_bitmap` format):

```
data/
├── airplane.npy
├── apple.npy
├── bicycle.npy
├── car.npy
├── cat.npy
├── dog.npy
├── fish.npy
├── house.npy
├── star.npy
└── tree.npy
```

Total size is roughly 1.1 GB (~100–140 MB per class).

## Format

Each `.npy` is a `uint8` array of shape `(N, 784)`: `N` drawings, each a flattened 28×28 grayscale bitmap (0 = background, 255 = stroke).

```python
import numpy as np

x = np.load("data/cat.npy")   # (N, 784)
img = x[0].reshape(28, 28)
```

Source URL pattern: `https://storage.googleapis.com/quickdraw_dataset/full/numpy_bitmap/<class>.npy`

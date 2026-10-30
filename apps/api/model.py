import torch
from torch import nn

class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),    # (32, 28, 28)
            nn.ReLU(),
            nn.MaxPool2d(2),                               # (32, 14, 14)

            nn.Conv2d(32, 64, kernel_size=3, padding=1),   # (64, 14, 14)
            nn.ReLU(),
            nn.MaxPool2d(2),                               # (64, 7, 7)

            nn.Conv2d(64, 128, kernel_size=3, padding=1),  # (128, 7, 7)
            nn.ReLU(),
            nn.MaxPool2d(2),                               # (128, 3, 3)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),                                  # 128 * 3 * 3 = 1152
            nn.Linear(1152, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 10),
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x
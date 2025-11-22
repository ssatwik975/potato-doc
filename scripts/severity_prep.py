import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms, datasets
import numpy as np
import cv2
import csv
import os

# ---------- CONFIG ----------
# Update this path to point to your image dataset folder
DATA_DIR = 'PlantVillage' 
CKPT_PATH = 'models/best_classifier.pth'
CSV_FILE = 'pseudo_severity.csv'
# ----------------------------

class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.gradients = None
        self.activations = None
        
        # Register hooks
        target_layer.register_forward_hook(self.save_activation)
        target_layer.register_full_backward_hook(self.save_gradient)

    def save_activation(self, module, input, output):
        self.activations = output

    def save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def __call__(self, x, class_idx):
        # Forward pass
        output = self.model(x)
        self.model.zero_grad()
        
        # Backward pass for the specific class
        score = output[0, class_idx]
        score.backward()
        
        # Generate CAM
        gradients = self.gradients.mean(dim=(2, 3), keepdim=True)
        activations = self.activations
        
        cam = (gradients * activations).sum(dim=1, keepdim=True)
        cam = F.relu(cam)
        
        # Normalize to 0-1
        if cam.max() > 0:
            cam = cam / cam.max()
            
        return cam.detach().cpu().numpy()[0, 0]

def generate_pseudo_labels():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Generating labels on {device}...")
    
    # 1. Load your pre-trained classifier
    model = models.resnet34(pretrained=False)
    model.fc = nn.Linear(model.fc.in_features, 3) # Assuming 3 classes
    
    if os.path.exists(CKPT_PATH):
        print(f"Loading weights from {CKPT_PATH}")
        state = torch.load(CKPT_PATH, map_location=device)
        # Handle if state dict is wrapped
        if 'model_state' in state: state = state['model_state']
        model.load_state_dict(state, strict=False)
    else:
        print(f"Warning: {CKPT_PATH} not found. Using random weights (results will be garbage).")
    
    model = model.to(device)
    model.eval()
    
    # Hook into the last convolutional layer (layer4 for ResNet)
    grad_cam = GradCAM(model, model.layer4)
    
    # 2. Setup Data
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    if not os.path.exists(DATA_DIR):
        print(f"Error: '{DATA_DIR}' not found. Please set DATA_DIR in the script.")
        return

    dataset = datasets.ImageFolder(DATA_DIR, transform=transform)
    print(f"Found {len(dataset)} images.")
    
    results = []
    
    # 3. Process Images
    for i in range(len(dataset)):
        img, label = dataset[i]
        path = dataset.samples[i][0]
        
        img_tensor = img.unsqueeze(0).to(device).requires_grad_(True)
        
        # Get Heatmap
        mask = grad_cam(img_tensor, label)
        
        # Resize heatmap to original image size
        mask_resized = cv2.resize(mask, (224, 224))
        
        # Threshold to approximate lesion mask (intensity > 0.4)
        lesion_pixels = np.sum(mask_resized > 0.4)
        total_pixels = 224 * 224
        
        # Calculate severity ratio
        severity = lesion_pixels / total_pixels
        
        # Heuristic scaling (GradCAM is coarse, so we scale up small activations)
        severity = min(severity * 3.0, 1.0)
        
        results.append({
            'path': path,
            'class': label,
            'severity': f"{severity:.4f}"
        })
        
        if i % 50 == 0:
            print(f"Processed {i}/{len(dataset)}")

    # 4. Save to CSV
    with open(CSV_FILE, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['path', 'class', 'severity'])
        writer.writeheader()
        writer.writerows(results)
        
    print(f"Done! Pseudo-labels saved to {CSV_FILE}")

if __name__ == "__main__":
    generate_pseudo_labels()
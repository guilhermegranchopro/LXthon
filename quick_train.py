#!/usr/bin/env python3
"""
Quick Model Training Script for Demo
Creates a lightweight model for fast testing
"""

import os
import json
import numpy as np
import cv2
from pathlib import Path
import tensorflow as tf
from sklearn.model_selection import train_test_split

# Set random seeds
np.random.seed(42)
tf.random.set_seed(42)

def create_simple_unet(input_shape=(256, 256, 3)):
    """Create a simplified U-Net for quick training"""
    inputs = tf.keras.layers.Input(shape=input_shape)
    
    # Encoder
    c1 = tf.keras.layers.Conv2D(32, 3, activation='relu', padding='same')(inputs)
    c1 = tf.keras.layers.Conv2D(32, 3, activation='relu', padding='same')(c1)
    p1 = tf.keras.layers.MaxPooling2D((2, 2))(c1)
    
    c2 = tf.keras.layers.Conv2D(64, 3, activation='relu', padding='same')(p1)
    c2 = tf.keras.layers.Conv2D(64, 3, activation='relu', padding='same')(c2)
    p2 = tf.keras.layers.MaxPooling2D((2, 2))(c2)
    
    c3 = tf.keras.layers.Conv2D(128, 3, activation='relu', padding='same')(p2)
    c3 = tf.keras.layers.Conv2D(128, 3, activation='relu', padding='same')(c3)
    p3 = tf.keras.layers.MaxPooling2D((2, 2))(c3)
    
    # Bridge
    c4 = tf.keras.layers.Conv2D(256, 3, activation='relu', padding='same')(p3)
    c4 = tf.keras.layers.Conv2D(256, 3, activation='relu', padding='same')(c4)
    
    # Decoder
    u5 = tf.keras.layers.UpSampling2D((2, 2))(c4)
    u5 = tf.keras.layers.concatenate([u5, c3])
    c5 = tf.keras.layers.Conv2D(128, 3, activation='relu', padding='same')(u5)
    c5 = tf.keras.layers.Conv2D(128, 3, activation='relu', padding='same')(c5)
    
    u6 = tf.keras.layers.UpSampling2D((2, 2))(c5)
    u6 = tf.keras.layers.concatenate([u6, c2])
    c6 = tf.keras.layers.Conv2D(64, 3, activation='relu', padding='same')(u6)
    c6 = tf.keras.layers.Conv2D(64, 3, activation='relu', padding='same')(c6)
    
    u7 = tf.keras.layers.UpSampling2D((2, 2))(c6)
    u7 = tf.keras.layers.concatenate([u7, c1])
    c7 = tf.keras.layers.Conv2D(32, 3, activation='relu', padding='same')(u7)
    c7 = tf.keras.layers.Conv2D(32, 3, activation='relu', padding='same')(c7)
    
    outputs = tf.keras.layers.Conv2D(1, 1, activation='sigmoid')(c7)
    
    return tf.keras.Model(inputs, outputs)

def load_sample_data(data_dir, max_samples=50, target_size=(256, 256)):
    """Load a small sample of data for quick training"""
    data_dir = Path(data_dir)
    images = []
    masks = []
    
    # Get first few samples
    png_files = list(data_dir.glob("*.png"))[:max_samples]
    
    for img_path in png_files:
        geojson_path = data_dir / f"{img_path.stem}.geojson"
        if not geojson_path.exists():
            continue
            
        # Load image
        image = cv2.imread(str(img_path))
        if image is None:
            continue
        
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, target_size)
        image = image.astype(np.float32) / 255.0
        
        # Create simple mask (for demo, create random-like mask based on image)
        # In real training, you'd parse the GeoJSON
        mask = np.zeros(target_size, dtype=np.float32)
        
        # Simple edge detection as proxy for vessels
        gray = cv2.cvtColor((image * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        mask = (edges > 0).astype(np.float32)
        
        images.append(image)
        masks.append(mask)
    
    return np.array(images), np.array(masks)

def main():
    print("🚀 Quick Model Training for Demo")
    print("=" * 50)
    
    # Check if we have the dataset
    train_dir = "dataset/train_dataset_mc"
    if not os.path.exists(train_dir):
        print("❌ Dataset not found, creating dummy model...")
        
        # Create models directory
        os.makedirs('backend/models', exist_ok=True)
        
        # Create and save a dummy model
        model = create_simple_unet()
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        # Create dummy data for model structure
        dummy_x = np.random.random((1, 256, 256, 3))
        dummy_y = np.random.random((1, 256, 256, 1))
        
        # Fit one step to initialize weights
        model.fit(dummy_x, dummy_y, epochs=1, verbose=0)
        
        # Save model
        model.save('backend/models/unet_eye_segmentation.keras')
        print("✅ Dummy model created and saved!")
        return
    
    print("📊 Loading sample data...")
    X, y = load_sample_data(train_dir, max_samples=50)
    
    if len(X) == 0:
        print("❌ No valid data found!")
        return
    
    print(f"Loaded {len(X)} samples")
    
    # Add channel dimension to masks
    y = np.expand_dims(y, axis=-1)
    
    # Split data
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Create model
    print("🏗️ Building model...")
    model = create_simple_unet()
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    print(f"Model parameters: {model.count_params():,}")
    
    # Create models directory
    os.makedirs('backend/models', exist_ok=True)
    
    # Train for a few epochs
    print("🚀 Training model (quick demo)...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=10,  # Quick training
        batch_size=8,
        verbose=1
    )
    
    # Save model
    model.save('backend/models/unet_eye_segmentation.keras')
    
    # Evaluate
    val_loss, val_acc = model.evaluate(X_val, y_val, verbose=0)
    print(f"\n📈 Final Results:")
    print(f"Validation Loss: {val_loss:.4f}")
    print(f"Validation Accuracy: {val_acc:.4f}")
    
    print("\n✅ Quick training completed!")
    print("🔧 Model saved to 'backend/models/unet_eye_segmentation.keras'")

if __name__ == "__main__":
    main()

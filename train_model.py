#!/usr/bin/env python3
"""
Eye Blood Vessel Segmentation Model Training
Training script for U-Net model using the ITS challenge dataset
"""

import os
import json
import numpy as np
import cv2
from pathlib import Path
import tensorflow as tf
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from tensorflow.keras import layers, Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import geojson
from shapely.geometry import Polygon
import rasterio.features

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

class EyeVesselDataset:
    def __init__(self, data_dir, target_size=(512, 512)):
        self.data_dir = Path(data_dir)
        self.target_size = target_size
        self.image_paths = []
        self.geojson_paths = []
        
        # Find all image-geojson pairs
        for img_file in self.data_dir.glob("*.png"):
            geojson_file = self.data_dir / f"{img_file.stem}.geojson"
            if geojson_file.exists():
                self.image_paths.append(img_file)
                self.geojson_paths.append(geojson_file)
        
        print(f"Found {len(self.image_paths)} image-annotation pairs")
    
    def geojson_to_mask(self, geojson_path, image_shape):
        """Convert GeoJSON annotation to binary mask"""
        try:
            with open(geojson_path, 'r') as f:
                geojson_data = json.load(f)
            
            mask = np.zeros(image_shape[:2], dtype=np.uint8)
            
            # Process features
            if 'features' in geojson_data:
                for feature in geojson_data['features']:
                    if feature['geometry']['type'] == 'Polygon':
                        coordinates = feature['geometry']['coordinates'][0]
                        # Convert coordinates to polygon
                        polygon_coords = np.array(coordinates, dtype=np.int32)
                        cv2.fillPoly(mask, [polygon_coords], 255)
                    elif feature['geometry']['type'] == 'LineString':
                        coordinates = feature['geometry']['coordinates']
                        # Draw thick lines for blood vessels
                        for i in range(len(coordinates) - 1):
                            pt1 = tuple(map(int, coordinates[i]))
                            pt2 = tuple(map(int, coordinates[i + 1]))
                            cv2.line(mask, pt1, pt2, 255, thickness=3)
            
            return mask
        except Exception as e:
            print(f"Error processing {geojson_path}: {e}")
            return np.zeros(image_shape[:2], dtype=np.uint8)
    
    def load_data(self):
        """Load and preprocess all data"""
        images = []
        masks = []
        
        for img_path, geojson_path in zip(self.image_paths, self.geojson_paths):
            # Load image
            image = cv2.imread(str(img_path))
            if image is None:
                continue
            
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            image = cv2.resize(image, self.target_size)
            
            # Generate mask
            mask = self.geojson_to_mask(geojson_path, image.shape)
            mask = cv2.resize(mask, self.target_size)
            
            # Normalize
            image = image.astype(np.float32) / 255.0
            mask = (mask > 127).astype(np.float32)  # Binary mask
            
            images.append(image)
            masks.append(mask)
        
        return np.array(images), np.array(masks)

def dice_loss(y_true, y_pred):
    """Dice loss function for segmentation"""
    smooth = 1e-6
    intersection = tf.reduce_sum(y_true * y_pred)
    union = tf.reduce_sum(y_true) + tf.reduce_sum(y_pred)
    dice = (2.0 * intersection + smooth) / (union + smooth)
    return 1.0 - dice

def combined_loss(y_true, y_pred):
    """Combined Binary Cross-Entropy and Dice Loss"""
    bce = tf.keras.losses.binary_crossentropy(y_true, y_pred)
    dice = dice_loss(y_true, y_pred)
    return bce + dice

def dice_coefficient(y_true, y_pred):
    """Dice coefficient metric"""
    smooth = 1e-6
    y_true_f = tf.cast(tf.reshape(y_true, [-1]), tf.float32)
    y_pred_f = tf.cast(tf.reshape(y_pred, [-1]), tf.float32)
    y_pred_f = tf.cast(y_pred_f > 0.5, tf.float32)
    intersection = tf.reduce_sum(y_true_f * y_pred_f)
    return (2.0 * intersection + smooth) / (tf.reduce_sum(y_true_f) + tf.reduce_sum(y_pred_f) + smooth)

def f1_score(y_true, y_pred):
    """F1 Score metric"""
    y_pred = tf.cast(y_pred > 0.5, tf.float32)
    tp = tf.reduce_sum(y_true * y_pred)
    fp = tf.reduce_sum((1 - y_true) * y_pred)
    fn = tf.reduce_sum(y_true * (1 - y_pred))
    
    precision = tp / (tp + fp + tf.keras.backend.epsilon())
    recall = tp / (tp + fn + tf.keras.backend.epsilon())
    
    return 2 * precision * recall / (precision + recall + tf.keras.backend.epsilon())

def build_unet(input_shape=(512, 512, 3)):
    """Build U-Net architecture for eye vessel segmentation"""
    inputs = layers.Input(shape=input_shape)
    
    # Encoder
    conv1 = layers.Conv2D(64, 3, activation='relu', padding='same')(inputs)
    conv1 = layers.Conv2D(64, 3, activation='relu', padding='same')(conv1)
    pool1 = layers.MaxPooling2D(pool_size=(2, 2))(conv1)
    
    conv2 = layers.Conv2D(128, 3, activation='relu', padding='same')(pool1)
    conv2 = layers.Conv2D(128, 3, activation='relu', padding='same')(conv2)
    pool2 = layers.MaxPooling2D(pool_size=(2, 2))(conv2)
    
    conv3 = layers.Conv2D(256, 3, activation='relu', padding='same')(pool2)
    conv3 = layers.Conv2D(256, 3, activation='relu', padding='same')(conv3)
    pool3 = layers.MaxPooling2D(pool_size=(2, 2))(conv3)
    
    conv4 = layers.Conv2D(512, 3, activation='relu', padding='same')(pool3)
    conv4 = layers.Conv2D(512, 3, activation='relu', padding='same')(conv4)
    drop4 = layers.Dropout(0.5)(conv4)
    pool4 = layers.MaxPooling2D(pool_size=(2, 2))(drop4)
    
    # Bridge
    conv5 = layers.Conv2D(1024, 3, activation='relu', padding='same')(pool4)
    conv5 = layers.Conv2D(1024, 3, activation='relu', padding='same')(conv5)
    drop5 = layers.Dropout(0.5)(conv5)
    
    # Decoder
    up6 = layers.Conv2D(512, 2, activation='relu', padding='same')(layers.UpSampling2D(size=(2, 2))(drop5))
    merge6 = layers.concatenate([drop4, up6], axis=3)
    conv6 = layers.Conv2D(512, 3, activation='relu', padding='same')(merge6)
    conv6 = layers.Conv2D(512, 3, activation='relu', padding='same')(conv6)
    
    up7 = layers.Conv2D(256, 2, activation='relu', padding='same')(layers.UpSampling2D(size=(2, 2))(conv6))
    merge7 = layers.concatenate([conv3, up7], axis=3)
    conv7 = layers.Conv2D(256, 3, activation='relu', padding='same')(merge7)
    conv7 = layers.Conv2D(256, 3, activation='relu', padding='same')(conv7)
    
    up8 = layers.Conv2D(128, 2, activation='relu', padding='same')(layers.UpSampling2D(size=(2, 2))(conv7))
    merge8 = layers.concatenate([conv2, up8], axis=3)
    conv8 = layers.Conv2D(128, 3, activation='relu', padding='same')(merge8)
    conv8 = layers.Conv2D(128, 3, activation='relu', padding='same')(conv8)
    
    up9 = layers.Conv2D(64, 2, activation='relu', padding='same')(layers.UpSampling2D(size=(2, 2))(conv8))
    merge9 = layers.concatenate([conv1, up9], axis=3)
    conv9 = layers.Conv2D(64, 3, activation='relu', padding='same')(merge9)
    conv9 = layers.Conv2D(64, 3, activation='relu', padding='same')(conv9)
    
    # Output
    outputs = layers.Conv2D(1, 1, activation='sigmoid')(conv9)
    
    model = Model(inputs=inputs, outputs=outputs)
    return model

def main():
    """Main training function"""
    print("🔬 Starting Eye Blood Vessel Segmentation Training")
    print("=" * 60)
    
    # Check GPU availability
    print(f"TensorFlow version: {tf.__version__}")
    print(f"GPU Available: {tf.config.list_physical_devices('GPU')}")
    
    # Load dataset
    train_dir = Path("dataset/train_dataset_mc")
    dataset = EyeVesselDataset(train_dir, target_size=(512, 512))
    
    print("📊 Loading and preprocessing data...")
    X, y = dataset.load_data()
    
    if len(X) == 0:
        print("❌ No data found! Please check the dataset path.")
        return
    
    print(f"Dataset shape: {X.shape}, Masks shape: {y.shape}")
    print(f"Image range: [{X.min():.3f}, {X.max():.3f}]")
    print(f"Mask range: [{y.min():.3f}, {y.max():.3f}]")
    
    # Add channel dimension to masks
    y = np.expand_dims(y, axis=-1)
    
    # Split data
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=None
    )
    
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Validation set: {X_val.shape[0]} samples")
    
    # Build model
    print("🏗️ Building U-Net model...")
    model = build_unet(input_shape=(512, 512, 3))
    
    # Compile model
    model.compile(
        optimizer=Adam(learning_rate=1e-4),
        loss=combined_loss,
        metrics=[dice_coefficient, f1_score, 'accuracy']
    )
    
    print(f"Model parameters: {model.count_params():,}")
    
    # Callbacks
    callbacks = [
        ModelCheckpoint(
            'backend/models/unet_eye_segmentation.keras',
            monitor='val_f1_score',
            mode='max',
            save_best_only=True,
            verbose=1
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=15,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=8,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Create models directory
    os.makedirs('backend/models', exist_ok=True)
    
    # Train model
    print("🚀 Starting training...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=50,
        batch_size=4,  # Small batch size due to memory constraints
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate final model
    print("\n📈 Final evaluation:")
    val_loss, val_dice, val_f1, val_acc = model.evaluate(X_val, y_val, verbose=0)
    print(f"Validation Loss: {val_loss:.4f}")
    print(f"Validation Dice: {val_dice:.4f}")
    print(f"Validation F1: {val_f1:.4f}")
    print(f"Validation Accuracy: {val_acc:.4f}")
    
    # Save training history
    np.save('training_history.npy', history.history)
    
    # Plot training curves
    plt.figure(figsize=(15, 5))
    
    plt.subplot(1, 3, 1)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    plt.subplot(1, 3, 2)
    plt.plot(history.history['dice_coefficient'], label='Training Dice')
    plt.plot(history.history['val_dice_coefficient'], label='Validation Dice')
    plt.title('Dice Coefficient')
    plt.xlabel('Epoch')
    plt.ylabel('Dice')
    plt.legend()
    
    plt.subplot(1, 3, 3)
    plt.plot(history.history['f1_score'], label='Training F1')
    plt.plot(history.history['val_f1_score'], label='Validation F1')
    plt.title('F1 Score')
    plt.xlabel('Epoch')
    plt.ylabel('F1')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('training_curves.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    print(f"\n✅ Training completed! Model saved to 'backend/models/unet_eye_segmentation.keras'")
    print(f"📊 Training curves saved to 'training_curves.png'")

if __name__ == "__main__":
    main()

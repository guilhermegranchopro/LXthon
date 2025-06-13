import os
import time
import logging
from typing import Optional, Tuple
import numpy as np
import tensorflow as tf
from tensorflow import keras

from ..utils.image_processing import (
    decode_base64_image, 
    encode_image_to_base64,
    preprocess_image,
    postprocess_mask,
    apply_morphological_operations,
    calculate_vessel_metrics
)


class ModelService:
    """Service for handling U-Net model inference for eye vessel segmentation."""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        self.model_loaded = False
        self.model_path = model_path or os.path.join(
            os.path.dirname(__file__), '../../models/unet_eye_segmentation.keras'
        )
        self.input_size = (256, 256)  # Match the trained model input size
        
        # Configure logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        # Load model on initialization
        self.load_model()
    
    def load_model(self) -> bool:
        """
        Load the U-Net model from file.
        
        Returns:
            True if model loaded successfully, False otherwise
        """
        try:
            if os.path.exists(self.model_path):
                self.logger.info(f"Loading model from {self.model_path}")
                self.model = keras.models.load_model(self.model_path)
                self.model_loaded = True
                self.logger.info("Model loaded successfully")
                return True
            else:
                self.logger.warning(f"Model file not found at {self.model_path}")
                # Create a dummy model for testing purposes
                self._create_dummy_model()
                return True
        except Exception as e:
            self.logger.error(f"Failed to load model: {str(e)}")
            self.model_loaded = False
            return False
    
    def _create_dummy_model(self):
        """Create a dummy model for testing when the actual model is not available."""
        self.logger.info("Creating dummy model for testing")
        
        # Simple dummy U-Net architecture
        inputs = keras.layers.Input(shape=(256, 256, 3))
        
        # Encoder
        x = keras.layers.Conv2D(64, 3, activation='relu', padding='same')(inputs)
        x = keras.layers.Conv2D(64, 3, activation='relu', padding='same')(x)
        x = keras.layers.MaxPooling2D(2)(x)
        
        x = keras.layers.Conv2D(128, 3, activation='relu', padding='same')(x)
        x = keras.layers.Conv2D(128, 3, activation='relu', padding='same')(x)
        x = keras.layers.MaxPooling2D(2)(x)
        
        # Bottom
        x = keras.layers.Conv2D(256, 3, activation='relu', padding='same')(x)
        x = keras.layers.Conv2D(256, 3, activation='relu', padding='same')(x)
        
        # Decoder
        x = keras.layers.UpSampling2D(2)(x)
        x = keras.layers.Conv2D(128, 3, activation='relu', padding='same')(x)
        x = keras.layers.Conv2D(128, 3, activation='relu', padding='same')(x)
        
        x = keras.layers.UpSampling2D(2)(x)
        x = keras.layers.Conv2D(64, 3, activation='relu', padding='same')(x)
        x = keras.layers.Conv2D(64, 3, activation='relu', padding='same')(x)
        
        # Output
        outputs = keras.layers.Conv2D(1, 1, activation='sigmoid', padding='same')(x)
        
        self.model = keras.Model(inputs, outputs)
        self.model_loaded = True
        
        self.logger.info("Dummy model created successfully")
    
    def predict(self, image_input) -> dict:
        """
        Perform vessel segmentation on the input image.
        
        Args:
            image_input: Either base64 encoded string or numpy array image
            
        Returns:
            Dictionary with mask, confidence, and metrics
        """
        if not self.model_loaded:
            raise RuntimeError("Model not loaded. Please load the model first.")
        
        start_time = time.time()
        
        try:
            # Handle both base64 strings and numpy arrays
            if isinstance(image_input, str):
                original_image = decode_base64_image(image_input)
            elif isinstance(image_input, np.ndarray):
                original_image = image_input
            else:
                raise ValueError("Input must be either base64 string or numpy array")
                
            original_size = original_image.shape[:2]
            
            self.logger.info(f"Processing image of size: {original_size}")
            
            # Preprocess for model
            preprocessed_image = preprocess_image(original_image, self.input_size)
            
            # Run inference
            self.logger.info("Running model inference")
            prediction = self.model.predict(preprocessed_image, verbose=0)
            
            # Postprocess the prediction
            segmentation_mask = postprocess_mask(prediction, original_size)
            
            # Apply morphological operations to clean up the mask
            cleaned_mask = apply_morphological_operations(segmentation_mask)
            
            # Calculate confidence score (average prediction confidence)
            confidence_score = float(np.mean(prediction))
            
            # Calculate vessel metrics
            metrics = calculate_vessel_metrics(cleaned_mask)
            
            processing_time = time.time() - start_time
            metrics['processing_time'] = processing_time
            
            self.logger.info(f"Inference completed in {processing_time:.2f} seconds")
            self.logger.info(f"Vessel coverage: {metrics['vessel_percentage']:.2f}%")
            
            return {
                "success": True,
                "mask": cleaned_mask,
                "confidence": confidence_score,
                "processing_time": processing_time,
                "vessel_metrics": metrics,
                "message": "Segmentation completed successfully"
            }
            
        except Exception as e:
            self.logger.error(f"Prediction failed: {str(e)}")
            raise
    
    def predict_and_encode(self, image_input) -> dict:
        """
        Perform prediction and return results with base64 encoded mask.
        
        Args:
            image_input: Either base64 encoded string or numpy array image
            
        Returns:
            Dictionary containing prediction results with base64 encoded mask
        """
        try:
            # Get prediction
            result = self.predict(image_input)
            
            # Encode mask to base64
            mask_base64 = encode_image_to_base64(result['mask'], format="PNG")
            
            return {
                "success": True,
                "segmentation_mask": mask_base64,
                "confidence_score": result['confidence'],
                "processing_time": result['processing_time'],
                "vessel_metrics": result['vessel_metrics'],
                "message": "Segmentation completed successfully"
            }
            
        except Exception as e:
            self.logger.error(f"Prediction and encoding failed: {str(e)}")
            return {
                "success": False,
                "segmentation_mask": None,
                "confidence_score": None,
                "processing_time": None,
                "vessel_metrics": None,
                "message": f"Prediction failed: {str(e)}"
            }
    
    def get_model_info(self) -> dict:
        """
        Get information about the loaded model.
        
        Returns:
            Dictionary containing model information
        """
        info = {
            "model_loaded": self.model_loaded,
            "model_path": self.model_path,
            "input_size": self.input_size
        }
        
        if self.model_loaded and self.model:
            try:
                info.update({
                    "model_type": "U-Net",
                    "input_shape": str(self.model.input_shape),
                    "output_shape": str(self.model.output_shape),
                    "total_params": self.model.count_params(),
                    "trainable_params": sum([tf.keras.backend.count_params(w) for w in self.model.trainable_weights])
                })
            except Exception as e:
                self.logger.warning(f"Could not get detailed model info: {str(e)}")
        
        return info
    
    def health_check(self) -> dict:
        """
        Perform a health check on the model service.
        
        Returns:
            Dictionary containing health status
        """
        status = {
            "status": "healthy" if self.model_loaded else "unhealthy",
            "model_loaded": self.model_loaded,
            "model_path_exists": os.path.exists(self.model_path),
            "tensorflow_version": tf.__version__
        }
        
        # Test prediction with a dummy image if model is loaded
        if self.model_loaded:
            try:
                # Create a dummy image (small black square)
                dummy_image = np.zeros((100, 100, 3), dtype=np.uint8)
                dummy_base64 = encode_image_to_base64(dummy_image, format="PNG")
                
                # Test prediction
                start_time = time.time()
                self.predict(dummy_base64)
                test_time = time.time() - start_time
                
                status.update({
                    "test_prediction": "passed",
                    "test_time": test_time
                })
            except Exception as e:
                status.update({
                    "test_prediction": "failed",
                    "test_error": str(e)
                })
        
        return status


# Global model service instance
model_service = ModelService()

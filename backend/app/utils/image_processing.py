import base64
import io
import numpy as np
from PIL import Image
import cv2
from typing import Tuple, Union


def decode_base64_image(base64_string: str) -> np.ndarray:
    """
    Decode base64 encoded image string to numpy array.
    
    Args:
        base64_string: Base64 encoded image (with or without data URI prefix)
        
    Returns:
        numpy array representing the image in RGB format
    """
    try:
        # Remove data URI prefix if present
        if base64_string.startswith('data:'):
            base64_string = base64_string.split(',')[1]
        
        # Decode base64 to bytes
        image_bytes = base64.b64decode(base64_string)
        
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if not already
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        image_array = np.array(image)
        
        return image_array
    
    except Exception as e:
        raise ValueError(f"Failed to decode base64 image: {str(e)}")


def encode_image_to_base64(image: np.ndarray, format: str = "PNG") -> str:
    """
    Encode numpy array image to base64 string.
    
    Args:
        image: Numpy array representing the image
        format: Image format (PNG, JPEG, etc.)
        
    Returns:
        Base64 encoded image string with data URI prefix
    """
    try:
        # Ensure image is in correct format
        if image.dtype != np.uint8:
            image = (image * 255).astype(np.uint8)
        
        # Convert numpy array to PIL Image
        if len(image.shape) == 2:  # Grayscale
            pil_image = Image.fromarray(image, mode='L')
        elif len(image.shape) == 3:  # RGB
            pil_image = Image.fromarray(image, mode='RGB')
        else:
            raise ValueError(f"Unsupported image shape: {image.shape}")
        
        # Convert to bytes
        buffer = io.BytesIO()
        pil_image.save(buffer, format=format)
        buffer.seek(0)
        
        # Encode to base64
        base64_string = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        # Add data URI prefix
        mime_type = f"image/{format.lower()}"
        return f"data:{mime_type};base64,{base64_string}"
    
    except Exception as e:
        raise ValueError(f"Failed to encode image to base64: {str(e)}")


def preprocess_image(image: np.ndarray, target_size: Tuple[int, int] = (512, 512)) -> np.ndarray:
    """
    Preprocess image for model inference.
    
    Args:
        image: Input image as numpy array
        target_size: Target size (height, width) for resizing
        
    Returns:
        Preprocessed image ready for model inference
    """
    try:
        # Resize image
        resized = cv2.resize(image, (target_size[1], target_size[0]))
        
        # Normalize pixel values to [0, 1]
        normalized = resized.astype(np.float32) / 255.0
        
        # Add batch dimension
        preprocessed = np.expand_dims(normalized, axis=0)
        
        return preprocessed
    
    except Exception as e:
        raise ValueError(f"Failed to preprocess image: {str(e)}")


def postprocess_mask(mask: np.ndarray, original_size: Tuple[int, int], threshold: float = 0.5) -> np.ndarray:
    """
    Postprocess model output mask.
    
    Args:
        mask: Model output mask
        original_size: Original image size (height, width)
        threshold: Threshold for binary mask creation
        
    Returns:
        Postprocessed binary mask
    """
    try:
        # Remove batch dimension if present
        if len(mask.shape) == 4:
            mask = mask[0]
        
        # Remove channel dimension if present
        if len(mask.shape) == 3 and mask.shape[-1] == 1:
            mask = mask[:, :, 0]
        
        # Apply threshold to create binary mask
        binary_mask = (mask > threshold).astype(np.uint8)
        
        # Resize to original size
        resized_mask = cv2.resize(binary_mask, (original_size[1], original_size[0]), 
                                 interpolation=cv2.INTER_NEAREST)
        
        # Convert to 0-255 range for better visualization
        final_mask = (resized_mask * 255).astype(np.uint8)
        
        return final_mask
    
    except Exception as e:
        raise ValueError(f"Failed to postprocess mask: {str(e)}")


def apply_morphological_operations(mask: np.ndarray) -> np.ndarray:
    """
    Apply morphological operations to clean up the segmentation mask.
    
    Args:
        mask: Binary mask
        
    Returns:
        Cleaned binary mask
    """
    try:
        # Define kernel for morphological operations
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        
        # Apply opening to remove noise
        opened = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        # Apply closing to fill gaps
        closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, kernel)
        
        return closed
    
    except Exception as e:
        raise ValueError(f"Failed to apply morphological operations: {str(e)}")


def calculate_vessel_metrics(mask: np.ndarray) -> dict:
    """
    Calculate metrics from the segmentation mask.
    
    Args:
        mask: Binary segmentation mask
        
    Returns:
        Dictionary containing various metrics
    """
    try:
        # Calculate basic metrics
        total_pixels = mask.shape[0] * mask.shape[1]
        vessel_pixels = np.sum(mask > 0)
        vessel_ratio = vessel_pixels / total_pixels
        
        # Find contours for more detailed analysis
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        metrics = {
            "total_pixels": int(total_pixels),
            "vessel_pixels": int(vessel_pixels),
            "vessel_ratio": float(vessel_ratio),
            "vessel_percentage": float(vessel_ratio * 100),
            "num_vessel_regions": len(contours),
            "average_region_size": float(vessel_pixels / len(contours)) if len(contours) > 0 else 0.0
        }
        
        return metrics
    
    except Exception as e:
        raise ValueError(f"Failed to calculate vessel metrics: {str(e)}")


def create_overlay_visualization(original_image: np.ndarray, mask: np.ndarray, 
                                alpha: float = 0.4) -> np.ndarray:
    """
    Create an overlay visualization of the original image and segmentation mask.
    
    Args:
        original_image: Original RGB image
        mask: Binary segmentation mask
        alpha: Transparency factor for overlay
        
    Returns:
        Overlay visualization
    """
    try:
        # Ensure mask is binary
        binary_mask = (mask > 0).astype(np.uint8)
        
        # Create colored mask (red for vessels)
        colored_mask = np.zeros_like(original_image)
        colored_mask[:, :, 0] = binary_mask * 255  # Red channel
        
        # Create overlay
        overlay = cv2.addWeighted(original_image, 1 - alpha, colored_mask, alpha, 0)
        
        return overlay
    
    except Exception as e:
        raise ValueError(f"Failed to create overlay visualization: {str(e)}")

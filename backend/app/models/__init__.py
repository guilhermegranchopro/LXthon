from typing import Optional
from pydantic import BaseModel, Field
import base64


class PredictionRequest(BaseModel):
    """Request model for image prediction"""
    image: str = Field(..., description="Base64 encoded image")
    model_name: Optional[str] = Field(default="unet_eye_segmentation", description="Model name to use")
    
    class Config:
        json_schema_extra = {
            "example": {
                "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R1+Xy2KsHn90olpFhOepvOfLpsI3++GsXSdHfQVSkyLpN8LY5YqjC1uo2LvgVACLH2lp1vLADEjHkW4VQAAy6RqPDuKk3U/XKtBt5Y6TDa2kjglAp9eQzLUJMKm72Sv5zTmlp8pTJYlpUsS1kUPE4JJjLJT1KOzLtyXs1s1q3U2g+//9k=",
                "model_name": "unet_eye_segmentation"
            }
        }


class PredictionResponse(BaseModel):
    """Response model for image prediction"""
    success: bool = Field(..., description="Whether prediction was successful")
    segmentation_mask: Optional[str] = Field(None, description="Base64 encoded segmentation mask")
    confidence_score: Optional[float] = Field(None, description="Average confidence score")
    processing_time: Optional[float] = Field(None, description="Processing time in seconds")
    message: Optional[str] = Field(None, description="Status message or error description")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "segmentation_mask": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
                "confidence_score": 0.89,
                "processing_time": 1.23,
                "message": "Segmentation completed successfully"
            }
        }


class HealthResponse(BaseModel):
    """Health check response model"""
    status: str = Field(..., description="Service status")
    model_loaded: bool = Field(..., description="Whether the model is loaded")
    version: str = Field(..., description="API version")


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from typing import Optional

from .models import PredictionRequest, PredictionResponse, HealthResponse, ErrorResponse
from .services import model_service
from .utils.image_processing import encode_image_to_base64

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Eye Vessel Segmentation API",
    description="API for segmenting blood vessels in slit-lamp eye images using U-Net deep learning model",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://127.0.0.1:3001"],  # Next.js frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize the application on startup."""
    logger.info("Starting Eye Vessel Segmentation API")
    logger.info("Checking model service...")
    
    health = model_service.health_check()
    if health["status"] == "healthy":
        logger.info("Model service is ready")
    else:
        logger.warning("Model service health check failed")
        logger.warning(f"Health status: {health}")


@app.get("/", response_model=dict)
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Eye Vessel Segmentation API",
        "version": "1.0.0",
        "description": "API for segmenting blood vessels in slit-lamp eye images",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "predict_file": "/predict/file",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    try:
        health_status = model_service.health_check()
        
        return HealthResponse(
            status=health_status["status"],
            model_loaded=health_status["model_loaded"],
            version="1.0.0"
        )
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")


@app.post("/predict", response_model=PredictionResponse)
async def predict_vessels(request: PredictionRequest):
    """
    Predict blood vessel segmentation from base64 encoded image.
    
    Args:
        request: Prediction request containing base64 encoded image
        
    Returns:
        Prediction response with segmentation mask and metrics
    """
    try:
        logger.info("Received prediction request")
        
        # Validate input
        if not request.image:
            raise HTTPException(status_code=400, detail="No image provided")
        
        # Perform prediction
        result = model_service.predict_and_encode(request.image)
        
        if result["success"]:
            return PredictionResponse(
                success=True,
                segmentation_mask=result["segmentation_mask"],
                confidence_score=result["confidence_score"],
                processing_time=result["processing_time"],
                message=result["message"]
            )
        else:
            raise HTTPException(status_code=500, detail=result["message"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/predict/file", response_model=PredictionResponse)
async def predict_vessels_from_file(file: UploadFile = File(...)):
    """
    Predict blood vessel segmentation from uploaded image file.
    
    Args:
        file: Uploaded image file
        
    Returns:
        Prediction response with segmentation mask and metrics
    """
    try:
        logger.info(f"Received file upload: {file.filename}")
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        image_bytes = await file.read()
        
        # Convert to base64
        import base64
        base64_string = base64.b64encode(image_bytes).decode('utf-8')
        
        # Add data URI prefix
        mime_type = file.content_type
        base64_image = f"data:{mime_type};base64,{base64_string}"
        
        # Perform prediction
        result = model_service.predict_and_encode(base64_image)
        
        if result["success"]:
            return PredictionResponse(
                success=True,
                segmentation_mask=result["segmentation_mask"],
                confidence_score=result["confidence_score"],
                processing_time=result["processing_time"],
                message=result["message"]
            )
        else:
            raise HTTPException(status_code=500, detail=result["message"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File prediction failed: {str(e)}")


@app.get("/model/info")
async def get_model_info():
    """Get information about the loaded model."""
    try:
        model_info = model_service.get_model_info()
        return model_info
    except Exception as e:
        logger.error(f"Failed to get model info: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get model info: {str(e)}")


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler."""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

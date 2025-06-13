# Eye Vessel Segmentation - AI Hackathon Solution

🏆 **LXthon 2024 Hackathon Project**  
🔬 **Challenge**: Find the blood vessels in the eye (provided by its.xyz)

## 🚀 Project Overview

This project provides an AI-powered solution for automatically segmenting blood vessels in slit-lamp eye images using deep learning. The solution combines a **U-Net neural network** backend with a modern **Next.js** web interface to deliver fast, accurate vessel segmentation for ophthalmological analysis.

## ✨ Features

- **🤖 AI-Powered Segmentation**: U-Net deep learning model for precise vessel detection
- **⚡ Real-time Processing**: Results delivered in under 3 seconds
- **🎨 Modern Web Interface**: Intuitive drag-and-drop image upload
- **📊 Detailed Analytics**: Confidence scores, vessel coverage, and region metrics
- **📥 Export Options**: Download original images, masks, and analysis results
- **🔄 Interactive Visualization**: Switch between original, mask, and overlay views
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices

## 🏗️ Architecture

### Backend (FastAPI + TensorFlow)
- **FastAPI**: Modern Python web framework for the API
- **TensorFlow/Keras**: Deep learning model inference
- **OpenCV**: Image processing and manipulation
- **U-Net Model**: Specialized architecture for medical image segmentation

### Frontend (Next.js + TypeScript)
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Modern icon library
- **Axios**: HTTP client for API communication

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd LXthon
```

### 2. Add Your Model
Place your trained U-Net model file in the backend models directory:
```bash
# Copy your trained model
cp /path/to/your/unet_eye_segmentation.keras backend/models/
```

### 3. Start the Application
```bash
# Start both backend and frontend
docker-compose up --build

# Or start individually
docker-compose up backend
docker-compose up frontend
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Development Setup

### Backend Development
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## 📖 API Documentation

### Endpoints

#### `POST /predict`
Analyze an image and return vessel segmentation.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "model_name": "unet_eye_segmentation"
}
```

**Response:**
```json
{
  "success": true,
  "segmentation_mask": "data:image/png;base64,iVBORw0K...",
  "confidence_score": 0.89,
  "processing_time": 1.23,
  "message": "Segmentation completed successfully"
}
```

#### `POST /predict/file`
Upload an image file for analysis.

#### `GET /health`
Check API health status.

#### `GET /model/info`
Get information about the loaded model.

## 🧠 Model Information

### U-Net Architecture
- **Input Size**: 512x512x3 (RGB images)
- **Output**: 512x512x1 (Binary segmentation mask)
- **Training Data**: Slit-lamp eye images with GeoJSON annotations
- **Optimization Metric**: F1 Score
- **Framework**: TensorFlow/Keras

### Data Processing Pipeline
1. **Input**: Base64 encoded slit-lamp image
2. **Preprocessing**: Resize to 512x512, normalize to [0,1]
3. **Inference**: U-Net model prediction
4. **Postprocessing**: Binary thresholding, morphological operations
5. **Output**: Binary mask with vessel regions

## 📊 Evaluation Metrics

- **Confidence Score**: Average model prediction confidence
- **Vessel Coverage**: Percentage of image containing vessels
- **Processing Time**: End-to-end inference time
- **Vessel Regions**: Number of discrete vessel segments
- **F1 Score**: Harmonic mean of precision and recall (validation)

## 🎯 Challenge Requirements ✅

- ✅ **Dataset Usage**: Processes slit-lamp images with GeoJSON annotations
- ✅ **Model Training**: U-Net architecture optimized for vessel segmentation
- ✅ **F1 Score Optimization**: Model evaluation and optimization target
- ✅ **Generalization**: Robust performance across lighting and anatomical conditions
- ✅ **Binary Mask Output**: Accurate vessel region identification

## 📁 Project Structure

```
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── main.py             # FastAPI application
│   │   ├── models/             # Pydantic models
│   │   ├── services/           # Business logic
│   │   └── utils/              # Utility functions
│   ├── requirements.txt
│   ├── Dockerfile
│   └── models/                 # ML model files
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   └── types/             # TypeScript types
│   ├── package.json
│   └── Dockerfile
├── dataset/                    # Training data
│   └── train_dataset_mc/       # Images and GeoJSON files
├── notebooks/                  # Development notebooks
├── docker-compose.yml         # Development environment
└── README.md                  # This file
```

## 🔬 Technical Details

### Image Processing
- **Format Support**: JPEG, PNG, GIF
- **Size Limits**: Maximum 10MB upload
- **Preprocessing**: Automatic resizing and normalization
- **Augmentation**: Runtime data augmentation for robustness

### Performance Optimizations
- **Model Caching**: Single model load on startup
- **Async Processing**: Non-blocking API operations
- **Efficient Memory Usage**: Optimized image processing pipeline
- **Error Handling**: Comprehensive error management and logging

### Security Features
- **Input Validation**: File type and size validation
- **CORS Configuration**: Secure cross-origin requests
- **Error Sanitization**: Safe error message exposure

## 🚀 Deployment

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with production settings
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Backend
MODEL_PATH=/app/models/unet_eye_segmentation.keras
LOG_LEVEL=INFO
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Hackathon Deliverables

### 1. Teaser
AI-powered blood vessel segmentation in eye images using U-Net deep learning, delivering fast and accurate results for ophthalmological analysis through an intuitive web interface.

### 2. Problem Brief
See `ITS EYE challenge.pdf` for detailed presentation slides.

### 3. Prototype Repository
This GitHub repository contains the complete solution with source code, documentation, and deployment instructions.

### 4. Screencast
[Link to demo video showing end-to-end workflow]

### 5. Live Demo
[Link to deployed application]

## 👥 Team

- **Guilherme Grancho** - Full-stack development, AI integration

## 🏆 Innovation Highlights

- **Real-time Processing**: Sub-3-second analysis pipeline
- **Modern Architecture**: Microservices with Docker deployment
- **User Experience**: Intuitive drag-and-drop interface
- **Scalability**: Cloud-ready containerized deployment
- **Extensibility**: Modular design for easy feature addition

---

**Built with ❤️ for LXthon 2024 Hackathon**

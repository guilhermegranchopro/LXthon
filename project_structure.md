# Eye Blood Vessel Segmentation - Hackathon Solution

## Project Structure

```
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app main file
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── prediction.py   # Pydantic models
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── model_service.py # Model inference service
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── image_processing.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── models/                  # Directory for .keras model files
│       └── unet_eye_segmentation.keras (to be added)
├── frontend/                    # Next.js frontend
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── ResultDisplay.tsx
│   │   │   └── Header.tsx
│   │   └── types/
│   │       └── index.ts
│   └── public/
├── notebooks/                   # Jupyter notebooks for model development
│   └── model_training.ipynb
├── docker-compose.yml          # Development environment
├── README.md                   # Project documentation
└── .gitignore
```

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **TensorFlow/Keras**: Deep learning model inference
- **OpenCV**: Image processing
- **Pillow**: Image manipulation
- **NumPy**: Numerical computations

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Modern component library
- **Axios**: HTTP client for API calls

### Model
- **U-Net Architecture**: Deep learning model for semantic segmentation
- **TensorFlow/Keras**: Model framework
- **Input**: Slit-lamp eye images
- **Output**: Binary segmentation masks for blood vessels

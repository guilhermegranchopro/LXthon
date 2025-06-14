export interface PredictionRequest {
  image: string;
  model_name?: string;
}

export interface PredictionResponse {
  success: boolean;
  segmentation_mask?: string;
  confidence_score?: number;
  processing_time?: number;
  message?: string;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  version: string;
}

export interface VesselMetrics {
  total_pixels: number;
  vessel_pixels: number;
  vessel_ratio: number;
  vessel_percentage: number;
  num_vessel_regions: number;
  average_region_size: number;
  processing_time: number;
}

export interface ApiError {
  error: string;
  detail?: string;
  status_code?: number;
}

export interface AnalysisResult {
  originalImage: string;
  segmentationMask: string;
  confidenceScore: number;
  processingTime: number;
  metrics?: VesselMetrics;
}

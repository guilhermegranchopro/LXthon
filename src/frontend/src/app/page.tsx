'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  Award, 
  Target,
  Brain,
  Zap,
  Eye,
  Activity,
  TrendingUp,
  Shield
} from 'lucide-react'

// Optimized imports
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import OptimizedImage from '@/components/OptimizedImage'
import { ProgressBar, LoadingSpinner, LazyWrapper } from '@/components/LoadingComponents'

// Optimized animations
import {
  optimizedFadeInUp,
  optimizedStaggerContainer,
  optimizedPulseGlow,
  optimizedHoverScale,
  optimizedSlideIn,
  optimizedRotate,
  optimizedConfetti,
  springConfig,
  fastTransition
} from '@/lib/animations'

// Performance monitoring imports removed
// import {
//   useDebounce,
//   useThrottle,
//   useAnimationState,
//   useFileProcessor,
//   usePerformanceMonitor
// } from '@/hooks/useOptimizations'

import type { PredictionResponse, AnalysisResult, ApiError } from '@/types'

// Dynamic imports for better code splitting
const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
  loading: () => <div className="h-16 bg-gray-50" />
})

const ImageUpload = dynamic(() => import('@/components/ImageUpload'), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
})

const ResultDisplay = dynamic(() => import('@/components/ResultDisplay'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
})

// PerformanceMonitor removed to eliminate errors

const PerformanceDashboard = dynamic(() => import('@/components/PerformanceDashboard'), {
  ssr: false,
  loading: () => null
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

// Memoized components for better performance
const StatCard = memo(function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  color, 
  delay = 0 
}: {
  icon: any
  value: string
  label: string
  color: string
  delay?: number
}) {
  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
      variants={optimizedHoverScale}
      whileHover="whileHover"
      whileTap="whileTap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ...fastTransition }}
    >
      <div className="flex items-center justify-center mb-3">
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      <motion.div 
        className={`text-3xl font-bold ${color}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: delay + 0.5 }}
      >
        {value}
      </motion.div>
      <p className="text-gray-600 font-medium">{label}</p>
    </motion.div>
  )
})

const TechBadge = memo(function TechBadge({ 
  icon: Icon, 
  text, 
  variant = "info" 
}: {
  icon: any
  text: string
  variant?: "info" | "success" | "warning"
}) {
  return (
    <Badge variant={variant} className="px-4 py-2 text-sm">
      <Icon className="h-4 w-4 mr-2" />
      {text}
    </Badge>
  )
})

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null); // This seems to be unused, consider removing if not needed
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // This seems to be unused, consider removing if not needed
  const [isClient, setIsClient] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null); // Renamed from 'result' for clarity
  const [showStats, setShowStats] = useState(false); // Added state for showing stats
  const [currentProcessingStage, setCurrentProcessingStage] = useState<string | null>(null); // Added state for processing stage
  const [uploadProgress, setUploadProgress] = useState(0); // Added state for upload/processing progress


  useEffect(() => {
    setIsClient(true);
  }, []);

  const shouldReduceMotion = useReducedMotion();

  // Memoized processing stages
  const processingStages = useMemo(() => [
    "Initializing AI model...",
    "Processing image data...",
    "Analyzing vessel patterns...",
    "Applying U-Net + EfficientNet segmentation...",
    "Calculating confidence metrics...",
    "Finalizing results..."
  ], []);

  // Optimized stats animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({
        f1Score: 0.73,
        speed: 4,
        processed: 1000
      });
      setShowStats(true); // Correctly use setShowStats
    }, 500);

    return () => clearTimeout(timer);
  }, []); // Removed animatedStats from dependency array as it's set inside

  // Placeholder for file processing logic (replace with actual implementation or remove if not needed)
  const validateFile = useCallback((file: File): boolean => {
    if (!file) return false;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please select a JPEG, PNG, or GIF image.');
      return false;
    }
    if (file.size > maxSize) {
      setError('File is too large. Please select an image under 10MB.');
      return false;
    }
    return true;
  }, []);

  const processFile = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }, []);


  // Optimized API call
  const analyzeImage = useCallback(async (file: File, base64Image: string) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress(0); // Use setUploadProgress
    setCurrentProcessingStage(processingStages[0]); // Use setCurrentProcessingStage

    try {
      let currentStageIndex = 0;
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => { // Use setUploadProgress
          const newProgress = prev + 15;
          
          const stageIndex = Math.floor((newProgress / 100) * processingStages.length);
          if (stageIndex < processingStages.length && stageIndex !== currentStageIndex) {
            currentStageIndex = stageIndex;
            setCurrentProcessingStage(processingStages[stageIndex]); // Use setCurrentProcessingStage
          }
          
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 600);

      const requestData = { image: base64Image };

      const response = await axios.post<PredictionResponse>(
        `${API_BASE_URL}/predict`,
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100); // Use setUploadProgress
      setCurrentProcessingStage("Analysis complete!"); // Use setCurrentProcessingStage

      if (response.data.success && response.data.segmentation_mask) {
        const newAnalysisResult: AnalysisResult = { // Renamed for clarity
          originalImage: base64Image,
          segmentationMask: response.data.segmentation_mask,
          confidenceScore: response.data.confidence_score || 0,
          processingTime: response.data.processing_time || 0,
          metrics: undefined 
        };

        setAnalysisResult(newAnalysisResult); // Use setAnalysisResult
      } else {
        throw new Error(response.data.message || 'Analysis failed');
      }

    } catch (err) {
      console.error('Analysis error:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
          setError('Cannot connect to the AI service. Please ensure the backend is running.');
        } else if (err.response?.data) {
          const apiError = err.response.data as ApiError;
          setError(apiError.error || apiError.detail || 'Analysis failed');
        } else if (err.request) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('Request failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0); // Use setUploadProgress
    }
  }, [processingStages]);

  // Optimized handlers
  const handleImageSelect = useCallback(async (file: File, base64: string) => {
    if (!validateFile(file)) {
      // Error is set within validateFile
      return;
    }
    
    setSelectedFile(file);
    setAnalysisResult(null); // Use setAnalysisResult
    setError(null);
  }, [validateFile]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;
    
    try {
      const base64 = await processFile(selectedFile);
      await analyzeImage(selectedFile, base64);
    } catch (error) {
      setError('Failed to process the selected file.');
    }
  }, [selectedFile, processFile, analyzeImage]);

  const handleDownloadResults = useCallback(() => {
    if (!analysisResult) return; // Use analysisResult
    
    const data = {
      timestamp: new Date().toISOString(),
      confidence_score: analysisResult.confidenceScore, // Use analysisResult
      processing_time: analysisResult.processingTime, // Use analysisResult
      metrics: analysisResult.metrics // Use analysisResult
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vessel_analysis_results.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [analysisResult]); // Use analysisResult

  const resetAnalysis = useCallback(() => {
    setAnalysisResult(null); // Use setAnalysisResult
    setError(null);
    setSelectedFile(null);
    setUploadProgress(0); // Use setUploadProgress
    setCurrentProcessingStage(null); // Clear processing stage
  }, []);

  // Throttling can be re-implemented if a useThrottle hook is available and correctly imported
  // For now, direct call:
  // const throttledAnalyze = useThrottle(handleAnalyze, 1000); 
  const throttledAnalyze = handleAnalyze;


  // Animated stats with optimized timing
  const [animatedStats, setAnimatedStats] = useState({
    f1Score: 0,
    speed: 0,
    processed: 0
  });


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
        
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            animate="animate"
            variants={optimizedStaggerContainer}
            transition={shouldReduceMotion ? { duration: 0 } : undefined}
          >
            <motion.div 
              className="flex items-center justify-center space-x-4 mb-8"
              variants={optimizedFadeInUp}
            >
              <motion.div 
                className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg"
                variants={optimizedPulseGlow}
                animate="animate"
              >
                <Eye className="h-10 w-10 text-white" />
              </motion.div>
              <div className="text-left">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Vision
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 font-medium">
                  Eye Vessel Segmentation
                </p>
              </div>
            </motion.div>

            <motion.p 
              className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed"
              variants={optimizedFadeInUp}
            >
              Advanced deep learning powered by <span className="font-semibold text-blue-600">U-Net + EfficientNet architecture</span> 
              for precise blood vessel analysis in slit-lamp eye images. 
              <span className="block mt-2 text-gray-600">
                Developed by Team Prometheus for the ITS.xyz challenge at LXthon 2025.
              </span>
            </motion.p>

            {/* Interactive Stats */}
            <AnimatePresence>
              {showStats && (
                <LazyWrapper className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                  <StatCard
                    icon={Target}
                    value={`${animatedStats.f1Score.toFixed(2)}`}
                    label="F1-Score"
                    color="text-green-600"
                    delay={0}
                  />
                  <StatCard
                    icon={Zap}
                    value={`~${animatedStats.speed}s`}
                    label="Processing Time"
                    color="text-yellow-600"
                    delay={0.1}
                  />
                  <StatCard
                    icon={Brain}
                    value="258M"
                    label="Parameters"
                    color="text-purple-600"
                    delay={0.2}
                  />
                </LazyWrapper>
              )}
            </AnimatePresence>

            {/* Technology Badges */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-12"
              variants={optimizedFadeInUp}
            >
              <TechBadge icon={Brain} text="U-Net + EfficientNet" variant="info" />
              <TechBadge icon={Zap} text="Real-time Processing" variant="success" />
              <TechBadge icon={Shield} text="Medical Grade" variant="warning" />
            </motion.div>
          </motion.div>

          {/* Enhanced Main Content */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            variants={optimizedSlideIn}
            initial="initial"
            animate="animate"
          >
            {/* Left Column - Upload and Controls */}
            <motion.div 
              className="space-y-8"
              variants={optimizedSlideIn}
            >
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-1"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <motion.div 
                        className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
                        variants={optimizedHoverScale}
                        whileHover="whileHover"
                      >
                        <Eye className="h-6 w-6 text-white" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-gray-800">Upload Eye Image</h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Upload a slit-lamp eye photograph for AI-powered vessel segmentation analysis.
                    </p>
                    
                    <ImageUpload 
                      onImageSelect={handleImageSelect}
                      isLoading={isLoading}
                    />
                  </div>
                </motion.div>
              </Card>

              {/* Enhanced Analysis Controls */}
              <AnimatePresence mode="wait">
                {selectedFile && !analysisResult && ( // Use analysisResult
                  <motion.div
                    variants={optimizedSlideIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                        <CardTitle className="text-gray-800 flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </motion.div>
                          <span>Ready to Analyze</span>
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <span>Selected: {selectedFile.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <motion.div variants={optimizedHoverScale} whileHover="whileHover" whileTap="whileTap">
                          <Button 
                            onClick={throttledAnalyze}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-medium shadow-lg transition-all duration-200 h-14 text-lg"
                          >
                            {isLoading ? (
                              <>
                                <LoadingSpinner className="mr-3" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <motion.div variants={optimizedRotate} animate="animate" className="mr-3">
                                  <Sparkles className="h-6 w-6" />
                                </motion.div>
                                Start AI Analysis
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Optimized Loading Progress */}
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div 
                    className="mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
                    variants={optimizedFadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="flex items-center mb-3">
                      <LoadingSpinner className="mr-3" />
                      <p className="text-lg font-medium text-gray-700">{currentProcessingStage || "Processing..."}</p> {/* Display currentProcessingStage */}
                    </div>
                    <ProgressBar progress={uploadProgress} /> {/* Use uploadProgress */}
                    <p className="text-sm text-gray-500 mt-2 text-center">Please wait, AI analysis in progress...</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div 
                    className="mt-6 p-6 bg-red-50/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200/50 text-red-700"
                    variants={optimizedFadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <h4 className="font-medium text-red-900">Analysis Failed</h4>
                        <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                        <motion.div variants={optimizedHoverScale} whileHover="whileHover" whileTap="whileTap">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={throttledAnalyze}
                            className="border-red-300 text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Try Again
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {analysisResult && (
                  <motion.div
                    className="mt-6 p-6 bg-green-50/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200/50"
                    variants={optimizedFadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <h4 className="font-medium text-green-900">Analysis Complete!</h4>
                        <p className="text-sm text-green-700 leading-relaxed">
                          Vessel segmentation completed successfully with high precision. 
                          Confidence score: {(analysisResult.confidenceScore * 100).toFixed(1)}%
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <motion.div variants={optimizedHoverScale} whileHover="whileHover" whileTap="whileTap">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={resetAnalysis}
                              className="border-green-300 text-green-700 hover:bg-green-100 transition-colors"
                            >
                              Analyze New Image
                            </Button>
                          </motion.div>
                          <motion.div variants={optimizedHoverScale} whileHover="whileHover" whileTap="whileTap">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleDownloadResults}
                              className="border-green-300 text-green-700 hover:bg-green-100 transition-colors"
                            >
                              Download Results
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right Column - Results */}
            <motion.div 
              className="space-y-8"
              variants={optimizedSlideIn}
              initial="initial"
              animate="animate"
            >
              <AnimatePresence mode="wait">
                {analysisResult ? (
                  <motion.div
                    variants={optimizedSlideIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <ResultDisplay 
                      result={analysisResult} 
                      onReset={resetAnalysis} 
                      onDownload={handleDownloadResults} 
                    />
                  </motion.div>
                ) : (
                  <LazyWrapper>
                    {/* Analysis Preview Card */}
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
                      <CardContent className="p-8">
                        <div className="text-center space-y-6">
                          <motion.div 
                            className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
                            animate={{ 
                              scale: [1, 1.05, 1],
                              rotate: [0, 2, -2, 0]
                            }}
                            transition={{ 
                              duration: 6, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <Eye className="h-12 w-12 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              AI Analysis Results
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              Upload an eye image to see advanced vessel segmentation results with detailed analysis metrics and interactive visualizations.
                            </p>
                          </div>
                          
                          {/* Feature Preview */}
                          <motion.div 
                            className="grid grid-cols-2 gap-4 pt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <motion.div 
                              className="text-center p-3 bg-white/70 rounded-lg"
                              variants={optimizedHoverScale}
                              whileHover="whileHover"
                            >
                              <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                              <p className="text-xs font-medium text-gray-700">Real-time Analysis</p>
                            </motion.div>
                            <motion.div 
                              className="text-center p-3 bg-white/70 rounded-lg"
                              variants={optimizedHoverScale}
                              whileHover="whileHover"
                            >
                              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                              <p className="text-xs font-medium text-gray-700">Detailed Metrics</p>
                            </motion.div>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Technology Stack Card */}
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
                      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                        <CardTitle className="text-gray-800 flex items-center space-x-2">
                          <Brain className="h-5 w-5 text-indigo-600" />
                          <span>Technology Stack</span>
                        </CardTitle>
                        <CardDescription>
                          Powered by cutting-edge AI and modern web technologies
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {[
                            { icon: "🧠", title: "U-Net + EfficientNet", desc: "Deep learning for medical imaging", color: "blue" },
                            { icon: "⚡", title: "FastAPI Backend", desc: "High-performance API server", color: "green" },
                            { icon: "⚛️", title: "Next.js 15", desc: "Modern React framework", color: "purple" }
                          ].map((tech, index) => (
                            <motion.div
                              key={tech.title}
                              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                              variants={optimizedHoverScale}
                              whileHover="whileHover"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1, ...fastTransition }}
                            >
                              <div className={`w-8 h-8 bg-${tech.color}-100 rounded-full flex items-center justify-center`}>
                                <span className={`text-${tech.color}-600 font-bold text-sm`}>{tech.icon}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{tech.title}</p>
                                <p className="text-xs text-gray-600">{tech.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats Card */}
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 via-white to-blue-50">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-gray-800 flex items-center space-x-2">
                          <Award className="h-5 w-5 text-yellow-600" />
                          <span>Model Performance</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div 
                            className="text-center p-4 bg-white/80 rounded-xl shadow-sm"
                            variants={optimizedHoverScale}
                            whileHover="whileHover"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5, ...springConfig }}
                          >
                            <motion.div 
                              className="text-2xl font-bold text-green-600 mb-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 2 }}
                            >
                              0.73
                            </motion.div>
                            <p className="text-xs font-medium text-gray-600">F1-Score</p>
                          </motion.div>
                          
                          <motion.div 
                            className="text-center p-4 bg-white/80 rounded-xl shadow-sm"
                            variants={optimizedHoverScale}
                            whileHover="whileHover"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.7, ...springConfig }}
                          >
                            <motion.div 
                              className="text-2xl font-bold text-blue-600 mb-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 2.2 }}
                            >
                              258M
                            </motion.div>
                            <p className="text-xs font-medium text-gray-600">Parameters</p>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </LazyWrapper>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Optimized Floating Quick Actions */}
          <AnimatePresence>
            {!isLoading && !analysisResult && selectedFile && (
              <motion.div
                className="fixed bottom-8 right-8 z-50"
                variants={optimizedSlideIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl"
                  variants={optimizedHoverScale}
                  whileHover="whileHover"
                  whileTap="whileTap"
                  onClick={throttledAnalyze}
                >
                  <motion.div variants={optimizedRotate} animate="animate">
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                </motion.button>
                
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Optimized Success Confetti Effect */}
          <AnimatePresence>
            {analysisResult && (
              <motion.div
                className="fixed inset-0 pointer-events-none z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: `linear-gradient(45deg, ${['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][i % 4]}, ${['#1D4ED8', '#7C3AED', '#059669', '#D97706'][i % 4]})`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    custom={i}
                    variants={optimizedConfetti}
                    initial="initial"
                    animate="animate"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        {/* Enhanced Technology Information */}
        <motion.div 
          className="mt-20 mb-12"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={fastTransition}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            className="text-center mb-12"
            variants={optimizedStaggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
              variants={optimizedFadeInUp}
            >
              Cutting-Edge Technology
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto text-lg"
              variants={optimizedFadeInUp}
            >
              Powered by state-of-the-art deep learning and computer vision technologies
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={optimizedStaggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              {
                emoji: "🤖",
                title: "AI Technology",
                description: "Advanced U-Net + EfficientNet deep learning architecture specifically trained on slit-lamp eye images for precise vessel segmentation and analysis.",
                gradient: "from-blue-500 to-blue-600",
                delay: 0
              },
              {
                emoji: "⚡",
                title: "Lightning Fast", 
                description: "Real-time analysis capabilities with results typically delivered in under 3 seconds, enabling efficient clinical workflows.",
                gradient: "from-green-500 to-green-600",
                delay: 0.1
              },
              {
                emoji: "📊",
                title: "Detailed Metrics",
                description: "Comprehensive analysis including confidence scores, vessel coverage statistics, and detailed segmentation maps for research.",
                gradient: "from-purple-500 to-purple-600", 
                delay: 0.2
              }
            ].map((tech, index) => (
              <motion.div
                key={tech.title}
                variants={optimizedFadeInUp}
                custom={index}
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 h-full group">
                  <CardContent className="p-6 h-full flex flex-col">
                    <motion.div 
                      className={`w-12 h-12 bg-gradient-to-r ${tech.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      variants={optimizedHoverScale}
                      whileHover="whileHover"
                    >
                      <span className="text-white font-bold text-lg">{tech.emoji}</span>
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {tech.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                      {tech.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <Footer />
      {/* PerformanceMonitor removed to eliminate errors */}
      <PerformanceDashboard />
    </div>
  );
}

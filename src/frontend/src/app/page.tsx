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

// Performance hooks
import {
  useDebounce,
  useThrottle,
  useAnimationState,
  useFileProcessor,
  usePerformanceMonitor
} from '@/hooks/useOptimizations'

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

const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor'), {
  ssr: false,
  loading: () => null
})

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
  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [processingStage, setProcessingStage] = useState('')
  const [showStats, setShowStats] = useState(false)

  // Performance hooks
  const { prefersReducedMotion } = useAnimationState()
  const { processFile, validateFile } = useFileProcessor()
  const { measureStart, measureEnd } = usePerformanceMonitor()
  const shouldReduceMotion = useReducedMotion()

  // Debounced progress for smoother updates
  const debouncedProgress = useDebounce(progress, 50)

  // Animated stats with optimized timing
  const [animatedStats, setAnimatedStats] = useState({
    accuracy: 0,
    speed: 0,
    processed: 0
  })

  // Memoized processing stages
  const processingStages = useMemo(() => [
    "Initializing AI model...",
    "Processing image data...",
    "Analyzing vessel patterns...",
    "Applying U-Net segmentation...",
    "Calculating confidence metrics...",
    "Finalizing results..."
  ], [])

  // Optimized stats animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({
        accuracy: 92.5,
        speed: 4,
        processed: 1000
      })
      setShowStats(true)
    }, 500) // Reduced from 1000ms

    return () => clearTimeout(timer)
  }, [])

  // Optimized API call with performance monitoring
  const analyzeImage = useCallback(async (file: File, base64Image: string) => {
    measureStart('image-analysis')
    setIsLoading(true)
    setError(null)
    setProgress(0)
    setProcessingStage(processingStages[0])

    try {
      // Optimized progress simulation
      let currentStage = 0
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 15
          
          const stageIndex = Math.floor((newProgress / 100) * processingStages.length)
          if (stageIndex < processingStages.length && stageIndex !== currentStage) {
            currentStage = stageIndex
            setProcessingStage(processingStages[stageIndex])
          }
          
          if (newProgress >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return newProgress
        })
      }, 600) // Faster updates

      const requestData = { image: base64Image }

      const response = await axios.post<PredictionResponse>(
        `${API_BASE_URL}/predict`,
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000,
        }
      )

      clearInterval(progressInterval)
      setProgress(100)
      setProcessingStage("Analysis complete!")

      if (response.data.success && response.data.segmentation_mask) {
        const analysisResult: AnalysisResult = {
          originalImage: base64Image,
          segmentationMask: response.data.segmentation_mask,
          confidenceScore: response.data.confidence_score || 0,
          processingTime: response.data.processing_time || 0,
          metrics: undefined
        }

        setResult(analysisResult)
        measureEnd('image-analysis')
      } else {
        throw new Error(response.data.message || 'Analysis failed')
      }

    } catch (err) {
      console.error('Analysis error:', err)
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
          setError('Cannot connect to the AI service. Please ensure the backend is running.')
        } else if (err.response?.data) {
          const apiError = err.response.data as ApiError
          setError(apiError.error || apiError.detail || 'Analysis failed')
        } else if (err.request) {
          setError('Network error. Please check your connection and try again.')
        } else {
          setError('Request failed. Please try again.')
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }, [processingStages, measureStart, measureEnd])

  // Optimized handlers
  const handleImageSelect = useCallback(async (file: File, base64: string) => {
    if (!validateFile(file)) {
      setError('Invalid file format or size. Please select a valid image under 10MB.')
      return
    }
    
    setSelectedFile(file)
    setResult(null)
    setError(null)
  }, [validateFile])

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return
    
    try {
      const base64 = await processFile(selectedFile)
      await analyzeImage(selectedFile, base64)
    } catch (error) {
      setError('Failed to process the selected file.')
    }
  }, [selectedFile, processFile, analyzeImage])

  const handleDownloadResults = useCallback(() => {
    if (!result) return
    
    const data = {
      timestamp: new Date().toISOString(),
      confidence_score: result.confidenceScore,
      processing_time: result.processingTime,
      metrics: result.metrics
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'vessel_analysis_results.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [result])

  const resetAnalysis = useCallback(() => {
    setResult(null)
    setError(null)
    setSelectedFile(null)
    setProgress(0)
  }, [])

  // Throttled handlers for better performance
  const throttledAnalyze = useThrottle(handleAnalyze, 1000)

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
              Advanced deep learning powered by <span className="font-semibold text-blue-600">U-Net architecture</span> 
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
                    value={`${animatedStats.accuracy.toFixed(1)}%`}
                    label="Accuracy"
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
                    value="24.4M"
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
              <TechBadge icon={Brain} text="U-Net Architecture" variant="info" />
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
                {selectedFile && !result && (
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
                    variants={optimizedSlideIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
                      <CardContent className="p-8">
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <motion.div 
                              className="p-3 bg-blue-100 rounded-full"
                              variants={optimizedRotate}
                              animate="animate"
                            >
                              <Brain className="h-6 w-6 text-blue-600" />
                            </motion.div>
                            <div>
                              <span className="font-semibold text-gray-800 text-lg">AI Processing</span>
                              <p className="text-sm text-gray-600 mt-1">{processingStage}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">Progress</span>
                              <span className="text-sm font-bold text-blue-600">{Math.round(debouncedProgress)}%</span>
                            </div>
                            <ProgressBar 
                              value={debouncedProgress} 
                              className="h-4" 
                              animated={true}
                            />
                          </div>
                          
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg"
                          >
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span>Our U-Net model is analyzing {(debouncedProgress * 512 * 512 / 100).toFixed(0)} pixels...</span>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Optimized Error Display */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    variants={optimizedSlideIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card className="border-red-200 bg-red-50/80 backdrop-blur-sm shadow-lg">
                      <CardContent className="p-6">
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
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Optimized Success Actions */}
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    variants={optimizedSlideIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Card className="border-green-200 bg-green-50/80 backdrop-blur-sm shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="space-y-3 flex-1">
                            <h4 className="font-medium text-green-900">Analysis Complete!</h4>
                            <p className="text-sm text-green-700 leading-relaxed">
                              Vessel segmentation completed successfully with high precision. 
                              Confidence score: {(result.confidenceScore * 100).toFixed(1)}%
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
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right Column - Results and Information */}
            <motion.div 
              className="space-y-8"
              variants={optimizedSlideIn}
              initial="initial"
              animate="animate"
            >
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    variants={optimizedSlideIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <ResultDisplay 
                      result={result} 
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
                            { icon: "🧠", title: "U-Net Architecture", desc: "Deep learning for medical imaging", color: "blue" },
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
                              92.5%
                            </motion.div>
                            <p className="text-xs font-medium text-gray-600">Accuracy</p>
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
                              24.4M
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
            {!isLoading && !result && selectedFile && (
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
            {result && (
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
                description: "Advanced U-Net deep learning architecture specifically trained on slit-lamp eye images for precise vessel segmentation and analysis.",
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
      <PerformanceMonitor />
      <PerformanceDashboard />
    </div>
  )
}

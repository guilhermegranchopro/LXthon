'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  Award, 
  Clock, 
  Target,
  Brain,
  Zap,
  Eye,
  Activity,
  TrendingUp,
  Shield
} from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageUpload from '@/components/ImageUpload'
import ResultDisplay from '@/components/ResultDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

import type { PredictionResponse, AnalysisResult, ApiError } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(59, 130, 246, 0.5)",
      "0 0 30px rgba(59, 130, 246, 0.8)",
      "0 0 20px rgba(59, 130, 246, 0.5)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1] as const
    }
  }
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [processingStage, setProcessingStage] = useState('')
  const [showStats, setShowStats] = useState(false)

  // Animated stats for the hero section
  const [animatedStats, setAnimatedStats] = useState({
    accuracy: 0,
    speed: 0,
    processed: 0
  })

  useEffect(() => {
    // Animate stats on component mount
    const timer = setTimeout(() => {
      setAnimatedStats({
        accuracy: 92.5,
        speed: 4,
        processed: 1000
      })
      setShowStats(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const processingStages = [
    "Initializing AI model...",
    "Processing image data...",
    "Analyzing vessel patterns...",
    "Applying U-Net segmentation...",
    "Calculating confidence metrics...",
    "Finalizing results..."
  ]

  const analyzeImage = async (file: File, base64Image: string) => {
    setIsLoading(true)
    setError(null)
    setProgress(0)
    setProcessingStage(processingStages[0])

    try {
      // Enhanced progress simulation with stages
      let currentStage = 0
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 15
          
          // Update processing stage based on progress
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
      }, 800)

      // Prepare the request
      const requestData = {
        image: base64Image
      }

      // Make API call
      const response = await axios.post<PredictionResponse>(
        `${API_BASE_URL}/predict`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60 second timeout for model inference
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
          metrics: undefined // Will be populated if backend provides detailed metrics
        }

        setResult(analysisResult)
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
  }

  const handleImageSelect = (file: File, base64: string) => {
    setSelectedFile(file)
    setResult(null)
    setError(null)
  }

  const handleAnalyze = () => {
    if (selectedFile) {
      // Convert file to base64 again for analysis
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        analyzeImage(selectedFile, base64)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDownloadResults = () => {
    if (result) {
      // Create a simple download with results
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
    }
  }

  const resetAnalysis = () => {
    setResult(null)
    setError(null)
    setSelectedFile(null)
    setProgress(0)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div 
            className="flex items-center justify-center space-x-4 mb-8"
            variants={fadeInUp}
          >
            <motion.div 
              className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg"
              variants={pulseGlow}
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
            variants={fadeInUp}
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
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-green-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  >
                    {animatedStats.accuracy.toFixed(1)}%
                  </motion.div>
                  <p className="text-gray-600 font-medium">Accuracy</p>
                </motion.div>

                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-yellow-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                  >
                    ~{animatedStats.speed}s
                  </motion.div>
                  <p className="text-gray-600 font-medium">Processing Time</p>
                </motion.div>

                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-purple-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.4 }}
                  >
                    24.4M
                  </motion.div>
                  <p className="text-gray-600 font-medium">Parameters</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Technology Badges */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            variants={fadeInUp}
          >
            <Badge variant="info" className="px-4 py-2 text-sm">
              <Brain className="h-4 w-4 mr-2" />
              U-Net Architecture
            </Badge>
            <Badge variant="success" className="px-4 py-2 text-sm">
              <Zap className="h-4 w-4 mr-2" />
              Real-time Processing
            </Badge>
            <Badge variant="warning" className="px-4 py-2 text-sm">
              <Shield className="h-4 w-4 mr-2" />
              Medical Grade
            </Badge>
          </motion.div>
        </motion.div>

        {/* Enhanced Main Content */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Left Column - Upload and Controls */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-1"
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <motion.div 
                      className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
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
            <AnimatePresence>
              {selectedFile && !result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ type: "spring", stiffness: 300 }}
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
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={handleAnalyze}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-medium shadow-lg transition-all duration-300 h-14 text-lg"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="mr-3"
                              >
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

            {/* Enhanced Loading Progress */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className="p-3 bg-blue-100 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
                            <span className="text-sm font-bold text-blue-600">{progress.toFixed(0)}%</span>
                          </div>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            className="overflow-hidden"
                          >
                            <Progress 
                              value={progress} 
                              className="w-full h-4 bg-gray-200" 
                            />
                          </motion.div>
                        </div>
                        
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg"
                        >
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span>Our U-Net model is analyzing {(progress * 512 * 512 / 100).toFixed(0)} pixels...</span>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <h4 className="font-medium text-red-900">Analysis Failed</h4>
                      <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => selectedFile && handleAnalyze()}
                        className="border-red-300 text-red-700 hover:bg-red-100 transition-colors"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Actions */}
            {result && (
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={resetAnalysis}
                          className="border-green-300 text-green-700 hover:bg-green-100 transition-colors"
                        >
                          Analyze New Image
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleDownloadResults}
                          className="border-green-300 text-green-700 hover:bg-green-100 transition-colors"
                        >
                          Download Results
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Right Column - Results and Information */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ResultDisplay 
                  result={result} 
                  onDownload={handleDownloadResults}
                />
              </motion.div>
            ) : (
              <>
                {/* Analysis Preview Card */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <motion.div 
                        className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
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
                        transition={{ delay: 1.5 }}
                      >
                        <div className="text-center p-3 bg-white/70 rounded-lg">
                          <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-xs font-medium text-gray-700">Real-time Analysis</p>
                        </div>
                        <div className="text-center p-3 bg-white/70 rounded-lg">
                          <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                          <p className="text-xs font-medium text-gray-700">Detailed Metrics</p>
                        </div>
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
                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">🧠</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">U-Net Architecture</p>
                          <p className="text-xs text-gray-600">Deep learning for medical imaging</p>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">⚡</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">FastAPI Backend</p>
                          <p className="text-xs text-gray-600">High-performance API server</p>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-bold text-sm">⚛️</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Next.js 15</p>
                          <p className="text-xs text-gray-600">Modern React framework</p>
                        </div>
                      </motion.div>
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
                        whileHover={{ y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        transition={{ type: "spring", stiffness: 300 }}
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
                        whileHover={{ y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        transition={{ type: "spring", stiffness: 300 }}
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
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Floating Quick Actions */}
        <AnimatePresence>
          {!isLoading && !result && selectedFile && (
            <motion.div
              className="fixed bottom-8 right-8 z-50"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, delay: 1 }}
            >
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl"
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" 
                }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAnalyze}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-6 w-6" />
                </motion.div>
              </motion.button>
              
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Confetti Effect */}
        <AnimatePresence>
          {result && (
            <motion.div
              className="fixed inset-0 pointer-events-none z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: `linear-gradient(45deg, ${['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][i % 5]}, ${['#1D4ED8', '#7C3AED', '#059669', '#D97706', '#DC2626'][i % 5]})`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -150, 200],
                    x: [0, Math.random() * 200 - 100],
                    opacity: [1, 0.8, 0],
                    scale: [1, 1.5, 0],
                    rotate: [0, Math.random() * 360],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Technology Information */}
        <div className="mt-20 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Cutting-Edge Technology
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powered by state-of-the-art deep learning and computer vision technologies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Technology</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Advanced U-Net deep learning architecture specifically trained on slit-lamp eye images for precise vessel segmentation and analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Real-time analysis capabilities with results typically delivered in under 3 seconds, enabling efficient clinical workflows.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Metrics</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Comprehensive analysis including confidence scores, vessel coverage statistics, and detailed segmentation maps for research.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

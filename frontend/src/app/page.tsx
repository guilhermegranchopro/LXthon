'use client'

import { useState } from 'react'
import axios from 'axios'
import { Loader2, AlertCircle, CheckCircle, Sparkles, Award, Clock, Target } from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageUpload from '@/components/ImageUpload'
import ResultDisplay from '@/components/ResultDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

import { PredictionResponse, AnalysisResult, ApiError } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const analyzeImage = async (file: File, base64Image: string) => {
    setIsLoading(true)
    setError(null)
    setProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Eye Vessel Segmentation
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Revolutionary AI-powered blood vessel segmentation technology for slit-lamp eye photographs. 
            Get instant, precise analysis with detailed metrics for ophthalmological research and diagnosis.
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">95%+ Accuracy</span>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">&lt;3s Processing</span>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">U-Net Architecture</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Controls */}
          <div className="space-y-6">
            <ImageUpload 
              onImageSelect={handleImageSelect}
              isLoading={isLoading}
            />

            {/* Analysis Controls */}
            {selectedFile && !result && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="text-gray-800">Ready to Analyze</CardTitle>
                  <CardDescription>
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg transition-all duration-200"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Start AI Analysis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Loading Progress */}
            {isLoading && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-800">AI is processing your image...</span>
                    </div>
                    <Progress value={progress} className="w-full h-3" />
                    <p className="text-sm text-gray-600">
                      Our advanced U-Net model is analyzing blood vessels with precision. This may take a few seconds.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

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
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {result ? (
              <ResultDisplay 
                result={result} 
                onDownload={handleDownloadResults}
              />
            ) : (
              <Card className="h-96 flex items-center justify-center border-dashed border-2 border-gray-300 bg-white/50 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="h-10 w-10 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      AI Analysis Results
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Upload and analyze an eye image to see the advanced vessel segmentation results here
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

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

'use client'

import { useState } from 'react'
import axios from 'axios'
import { Loader2, AlertCircle, CheckCircle, Sparkles } from 'lucide-react'

import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'
import ResultDisplay from '@/components/ResultDisplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

import { PredictionResponse, AnalysisResult, ApiError } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
        image: base64Image,
        model_name: 'unet_eye_segmentation'
      }

      // Make API call
      const response = await axios.post<PredictionResponse>(
        `${API_BASE_URL}/predict`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
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
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              AI Eye Vessel Segmentation
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a slit-lamp eye photograph and get instant AI-powered blood vessel segmentation 
            with detailed analysis and metrics for ophthalmological research and diagnosis.
          </p>
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
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Analyze</CardTitle>
                  <CardDescription>
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Loading Progress */}
            {isLoading && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="font-medium">Processing your image...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-gray-600">
                      The AI is analyzing blood vessels in your image. This may take a few seconds.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-900">Analysis Failed</h4>
                      <p className="text-sm text-red-700">{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => selectedFile && handleAnalyze()}
                        className="border-red-300 text-red-700 hover:bg-red-100"
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
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1">
                      <h4 className="font-medium text-green-900">Analysis Complete!</h4>
                      <p className="text-sm text-green-700">
                        Vessel segmentation completed successfully. 
                        Confidence: {(result.confidenceScore * 100).toFixed(1)}%
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={resetAnalysis}
                          className="border-green-300 text-green-700 hover:bg-green-100"
                        >
                          Analyze New Image
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleDownloadResults}
                          className="border-green-300 text-green-700 hover:bg-green-100"
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
              <Card className="h-96 flex items-center justify-center border-dashed border-2">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Analysis Results
                    </h3>
                    <p className="text-gray-600">
                      Upload and analyze an eye image to see the vessel segmentation results here
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <div className="text-center text-gray-600">
            <h3 className="text-lg font-medium mb-4">About This Solution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🤖 AI Technology</h4>
                <p>U-Net deep learning architecture trained on slit-lamp eye images for precise vessel segmentation.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">⚡ Fast Processing</h4>
                <p>Real-time analysis with results typically delivered in under 3 seconds.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📊 Detailed Metrics</h4>
                <p>Comprehensive analysis including confidence scores, vessel coverage, and region detection.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

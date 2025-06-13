'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { 
  Download, 
  Eye, 
  EyeOff, 
  Clock, 
  Target, 
  Activity,
  BarChart3,
  Zap
} from 'lucide-react'
import { AnalysisResult } from '@/types'

interface ResultDisplayProps {
  result: AnalysisResult
  onDownload?: () => void
}

export default function ResultDisplay({ result, onDownload }: ResultDisplayProps) {
  const [showOverlay, setShowOverlay] = useState(true)
  const [activeTab, setActiveTab] = useState<'original' | 'mask' | 'overlay'>('overlay')

  const downloadImage = (imageData: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageData
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const createOverlayImage = () => {
    // This would ideally be done on the backend, but for demo purposes
    // we'll just return the mask with some styling
    return result.segmentationMask
  }

  const formatMetrics = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals)
  }

  const confidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const vesselCoverage = result.metrics?.vessel_percentage || 0
  const confidenceScore = result.confidenceScore * 100

  return (
    <div className="space-y-6">
      {/* Image Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Segmentation Results</span>
          </CardTitle>
          <CardDescription>
            AI-generated blood vessel segmentation with overlay visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeTab === 'original' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('original')}
                className="flex-1"
              >
                Original
              </Button>
              <Button
                variant={activeTab === 'mask' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('mask')}
                className="flex-1"
              >
                Vessels
              </Button>
              <Button
                variant={activeTab === 'overlay' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('overlay')}
                className="flex-1"
              >
                Overlay
              </Button>
            </div>

            {/* Image Display */}
            <div className="relative aspect-square max-w-lg mx-auto bg-gray-50 rounded-lg overflow-hidden">
              {activeTab === 'original' && (
                <img
                  src={result.originalImage}
                  alt="Original eye image"
                  className="w-full h-full object-contain fade-in"
                />
              )}
              {activeTab === 'mask' && (
                <img
                  src={result.segmentationMask}
                  alt="Vessel segmentation mask"
                  className="w-full h-full object-contain fade-in"
                  style={{ filter: 'invert(1)' }}
                />
              )}
              {activeTab === 'overlay' && (
                <div className="relative w-full h-full">
                  <img
                    src={result.originalImage}
                    alt="Original with overlay"
                    className="w-full h-full object-contain"
                  />
                  <img
                    src={result.segmentationMask}
                    alt="Vessel overlay"
                    className="absolute inset-0 w-full h-full object-contain opacity-60"
                    style={{ 
                      mixBlendMode: 'multiply',
                      filter: 'hue-rotate(0deg) saturate(2) brightness(0.8)' 
                    }}
                  />
                </div>
              )}
            </div>

            {/* Download Options */}
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadImage(result.originalImage, 'original.png')}
              >
                <Download className="h-4 w-4 mr-2" />
                Original
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadImage(result.segmentationMask, 'vessels.png')}
              >
                <Download className="h-4 w-4 mr-2" />
                Mask
              </Button>
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  All Results
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Confidence Score */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confidence</p>
                <p className={`text-2xl font-bold ${confidenceColor(result.confidenceScore)}`}>
                  {formatMetrics(confidenceScore, 1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={confidenceScore} className="mt-3" />
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatMetrics(result.processingTime, 2)}s
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-3">
              <div className="flex items-center text-sm text-gray-600">
                <Zap className="h-3 w-3 mr-1" />
                <span>Fast inference</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vessel Coverage */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vessel Coverage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatMetrics(vesselCoverage, 1)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-red-500" />
            </div>
            <Progress value={vesselCoverage} className="mt-3" />
          </CardContent>
        </Card>

        {/* Vessel Regions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vessel Regions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.metrics?.num_vessel_regions || 'N/A'}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-3">
              <div className="flex items-center text-sm text-gray-600">
                <span>Detected segments</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      {result.metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
            <CardDescription>
              Comprehensive vessel segmentation metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Image Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pixels:</span>
                    <span className="font-medium">{result.metrics.total_pixels.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vessel Pixels:</span>
                    <span className="font-medium">{result.metrics.vessel_pixels.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vessel Ratio:</span>
                    <span className="font-medium">{formatMetrics(result.metrics.vessel_ratio, 4)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Segmentation Quality</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence Score:</span>
                    <span className={`font-medium ${confidenceColor(result.confidenceScore)}`}>
                      {formatMetrics(result.confidenceScore, 3)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Region Size:</span>
                    <span className="font-medium">
                      {formatMetrics(result.metrics.average_region_size, 1)} px
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-medium">{formatMetrics(result.processingTime, 2)}s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Assessment */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Quality Assessment</h5>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    result.confidenceScore >= 0.8 ? 'bg-green-500' : 
                    result.confidenceScore >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-gray-600">
                    {result.confidenceScore >= 0.8 ? 'High' : 
                     result.confidenceScore >= 0.6 ? 'Medium' : 'Low'} confidence
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    vesselCoverage >= 10 ? 'bg-green-500' : 
                    vesselCoverage >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-gray-600">
                    {vesselCoverage >= 10 ? 'High' : 
                     vesselCoverage >= 5 ? 'Medium' : 'Low'} vessel density
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { 
  Download, 
  Eye, 
  Clock, 
  Target, 
  Activity,
  BarChart3,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react'
import { AnalysisResult } from '@/types'

interface ResultDisplayProps {
  result: AnalysisResult
  onDownload?: () => void
}

export default function ResultDisplay({ result, onDownload }: ResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<'original' | 'mask' | 'overlay'>('overlay')

  const downloadImage = (imageData: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageData
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Segmentation Results
            </span>
          </CardTitle>
          <CardDescription>
            AI-generated blood vessel segmentation with advanced overlay visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1.5 border border-gray-200">
              <Button
                variant={activeTab === 'original' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('original')}
                className={`flex-1 transition-all duration-200 ${
                  activeTab === 'original' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                    : 'hover:bg-white/70'
                }`}
              >
                <Eye className="h-4 w-4 mr-1" />
                Original
              </Button>
              <Button
                variant={activeTab === 'mask' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('mask')}
                className={`flex-1 transition-all duration-200 ${
                  activeTab === 'mask' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                    : 'hover:bg-white/70'
                }`}
              >
                <Layers className="h-4 w-4 mr-1" />
                Vessels
              </Button>
              <Button
                variant={activeTab === 'overlay' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('overlay')}
                className={`flex-1 transition-all duration-200 ${
                  activeTab === 'overlay' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                    : 'hover:bg-white/70'
                }`}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Overlay
              </Button>
            </div>

            {/* Image Display */}
            <div className="relative aspect-square max-w-lg mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
              {activeTab === 'original' && (
                <img
                  src={result.originalImage}
                  alt="Original eye image"
                  className="w-full h-full object-contain transition-opacity duration-300"
                />
              )}
              {activeTab === 'mask' && (
                <img
                  src={result.segmentationMask}
                  alt="Vessel segmentation mask"
                  className="w-full h-full object-contain transition-opacity duration-300"
                  style={{ filter: 'invert(1) contrast(1.2)' }}
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
                    className="absolute inset-0 w-full h-full object-contain opacity-70"
                    style={{ 
                      mixBlendMode: 'multiply',
                      filter: 'hue-rotate(240deg) saturate(2) brightness(0.7)' 
                    }}
                  />
                </div>
              )}
              
              {/* Image quality indicator */}
              <div className="absolute top-3 right-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700 border border-gray-200">
                  {activeTab === 'original' ? 'Original' : activeTab === 'mask' ? 'AI Segmentation' : 'AI Overlay'}
                </div>
              </div>
            </div>

            {/* Download Options */}
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadImage(result.originalImage, 'original.png')}
                className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors border-gray-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Original
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadImage(result.segmentationMask, 'vessels.png')}
                className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors border-gray-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Vessels
              </Button>
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors border-gray-300"
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
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confidence</p>
                <p className={`text-2xl font-bold ${confidenceColor(result.confidenceScore)}`}>
                  {formatMetrics(confidenceScore, 1)}%
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <Progress value={confidenceScore} className="mt-3" />
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatMetrics(result.processingTime, 2)}s
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
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
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vessel Coverage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatMetrics(vesselCoverage, 1)}%
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <Progress value={vesselCoverage} className="mt-3" />
          </CardContent>
        </Card>

        {/* Vessel Regions */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vessel Regions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.metrics?.num_vessel_regions || 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
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
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Detailed Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive vessel segmentation metrics and quality assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                  Image Statistics
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Total Pixels:</span>
                    <span className="font-medium">{result.metrics.total_pixels.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Vessel Pixels:</span>
                    <span className="font-medium">{result.metrics.vessel_pixels.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Vessel Ratio:</span>
                    <span className="font-medium">{formatMetrics(result.metrics.vessel_ratio, 4)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                  Segmentation Quality
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Confidence Score:</span>
                    <span className={`font-medium ${confidenceColor(result.confidenceScore)}`}>
                      {formatMetrics(result.confidenceScore, 3)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Average Region Size:</span>
                    <span className="font-medium">
                      {formatMetrics(result.metrics.average_region_size, 1)} px
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-medium">{formatMetrics(result.processingTime, 2)}s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Assessment */}
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2 text-blue-600" />
                Quality Assessment
              </h5>
              <div className="flex items-center space-x-6 text-sm">
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

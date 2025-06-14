'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, FileImage, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface ImageUploadProps {
  onImageSelect: (file: File, base64: string) => void
  isLoading?: boolean
  accept?: string
}

export default function ImageUpload({ 
  onImageSelect, 
  isLoading = false,
  accept = "image/*"
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select a valid image file'
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return 'File size must be less than 10MB'
    }

    return null
  }

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null)
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const base64 = await convertToBase64(file)
      setSelectedImage(base64)
      onImageSelect(file, base64)
    } catch (err) {
      setError('Failed to process the image')
      console.error('File processing error:', err)
    }
  }, [onImageSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
              ${isDragOver 
                ? 'border-blue-400 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm scale-[1.02]' 
                : 'border-gray-300/60 hover:border-blue-300/60 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-indigo-50/40'
              }
              ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:shadow-md'}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isLoading}
            />

            {selectedImage ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={selectedImage}
                    alt="Selected eye image"
                    className="max-w-full h-auto max-h-64 rounded-xl shadow-lg border border-white/20"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-lg hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearImage()
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Click to change or drag a new image
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-inner">
                  {isDragOver ? (
                    <Upload className="h-10 w-10 text-blue-600 animate-bounce" />
                  ) : (
                    <FileImage className="h-10 w-10 text-blue-500" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <p className="text-xl font-semibold text-gray-900">
                    {isDragOver ? 'Drop your image here' : 'Upload eye image'}
                  </p>
                  <p className="text-base text-gray-600">
                    Drag and drop an image file, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: JPG, PNG, GIF (max 10MB)
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={isLoading}
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              📊 About this analysis
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload a slit-lamp eye photograph</li>
              <li>• AI will identify blood vessels automatically</li>
              <li>• Get detailed metrics and visualization</li>
              <li>• Processing typically takes 1-3 seconds</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

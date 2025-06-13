'use client'

import { Eye, Github, Activity } from 'lucide-react'
import { Button } from './ui/button'

export default function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Eye Vessel Segmentation
              </h1>
              <p className="text-sm text-gray-500">
                AI-Powered Blood Vessel Analysis
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="h-4 w-4" />
              <span>Hackathon 2024</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://github.com', '_blank')}
              className="flex items-center space-x-2"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

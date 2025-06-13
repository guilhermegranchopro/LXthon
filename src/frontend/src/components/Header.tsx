'use client'

import { Eye, Github, Activity } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* LXthon Logo */}
              <Image 
                src="/logos/LXthon_logo.png" 
                alt="LXthon Logo" 
                width={45} 
                height={45}
                className="rounded-lg shadow-sm"
              />
              
              {/* Team Prometheus Logo */}
              <Image 
                src="/logos/prometheus_logo.png" 
                alt="Team Prometheus Logo" 
                width={40} 
                height={40}
                className="rounded-lg shadow-sm"
              />
              
              {/* Eye Icon */}
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Eye Vessel Segmentation
              </h1>
              <p className="text-sm text-gray-500 flex items-center space-x-2">
                <span>AI-Powered Blood Vessel Analysis</span>
                <span className="text-gray-300">•</span>
                <span className="text-blue-600 font-medium">Team Prometheus</span>
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* ITS.xyz Badge */}
            <div className="hidden lg:flex items-center space-x-2">
              <Image 
                src="/logos/its_logo.png" 
                alt="ITS.xyz Logo" 
                width={24} 
                height={24}
                className="rounded"
              />
              <span className="text-sm text-gray-600 font-medium">Challenge by ITS.xyz</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="font-medium">LXthon 2025</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://github.com/guilhermegranchopro/LXthon/tree/main', '_blank')}
              className="flex items-center space-x-2 hover:bg-gray-50 transition-colors"
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

'use client'

import { Heart, Users, Trophy, Code } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Event Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image 
                src="/LXthon_logo.png" 
                alt="LXthon Logo" 
                width={32} 
                height={32}
                className="rounded"
              />
              <h3 className="text-lg font-bold">LXthon 2025</h3>
            </div>
            <p className="text-gray-300 text-sm">
              24 hours of coding, innovation, and solving real-world challenges with cutting-edge AI technology.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Trophy className="h-4 w-4" />
              <span>Hybrid Hackathon in Lisbon</span>
            </div>
          </div>

          {/* Team Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-bold">Team Prometheus</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Guilherme Grancho</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Vasco Pereira</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Passionate developers bringing AI solutions to ophthalmological challenges
            </p>
          </div>

          {/* Project Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-bold">Solution</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Advanced U-Net deep learning model for precise blood vessel segmentation in slit-lamp eye images.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">Next.js</span>
              <span className="px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded-full">FastAPI</span>
              <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full">TensorFlow</span>
              <span className="px-2 py-1 bg-orange-600/20 text-orange-300 text-xs rounded-full">U-Net</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>at LXthon 2025</span>
          </div>
          <div className="text-sm text-gray-400">
            © 2025 Team Prometheus. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

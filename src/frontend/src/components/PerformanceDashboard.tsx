'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, Monitor, Cpu } from 'lucide-react'

interface PerformanceData {
  renderTime: number
  bundleSize: string
  memoryUsage: number
  fps: number
  pageLoadTime: number
}

export default function PerformanceDashboard() {
  const [isVisible, setIsVisible] = useState(false)
  const [perfData, setPerfData] = useState<PerformanceData>({
    renderTime: 0,
    bundleSize: '280 KB',
    memoryUsage: 0,
    fps: 60,
    pageLoadTime: 0
  })

  useEffect(() => {
    // Show performance dashboard if in dev mode or debug enabled
    const isDev = process.env.NODE_ENV === 'development'
    const isDebug = typeof window !== 'undefined' && window.location.search.includes('perf=true')
    setIsVisible(isDev || isDebug)

    if (!isVisible) return

    // Measure page load time
    if (typeof window !== 'undefined' && window.performance) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
      setPerfData(prev => ({ ...prev, pageLoadTime: loadTime }))
    }

    // Monitor memory usage
    const memoryInterval = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
        setPerfData(prev => ({ ...prev, memoryUsage: usedMB }))
      }
    }, 2000)

    // Monitor FPS
    let frameCount = 0
    let lastTime = performance.now()
    
    const countFrames = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round(frameCount * 1000 / (currentTime - lastTime))
        setPerfData(prev => ({ ...prev, fps }))
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(countFrames)
    }
    
    requestAnimationFrame(countFrames)

    return () => {
      clearInterval(memoryInterval)
    }
  }, [isVisible])

  if (!isVisible) return null

  const getPerformanceColor = (value: number, good: number, warning: number) => {
    if (value >= good) return 'text-green-500'
    if (value >= warning) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-gray-700 min-w-[280px]"
    >
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1 bg-blue-600 rounded">
          <Activity className="h-4 w-4" />
        </div>
        <span className="font-bold text-sm">Performance Monitor</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-800/50 p-2 rounded-lg">
          <div className="flex items-center space-x-1 mb-1">
            <Zap className="h-3 w-3 text-yellow-500" />
            <span className="text-gray-300">FPS</span>
          </div>
          <div className={`font-bold text-lg ${getPerformanceColor(perfData.fps, 55, 30)}`}>
            {perfData.fps}
          </div>
        </div>

        <div className="bg-gray-800/50 p-2 rounded-lg">
          <div className="flex items-center space-x-1 mb-1">
            <Cpu className="h-3 w-3 text-blue-500" />
            <span className="text-gray-300">Memory</span>
          </div>
          <div className={`font-bold text-lg ${getPerformanceColor(100 - perfData.memoryUsage, 50, 25)}`}>
            {perfData.memoryUsage}MB
          </div>
        </div>

        <div className="bg-gray-800/50 p-2 rounded-lg">
          <div className="flex items-center space-x-1 mb-1">
            <Monitor className="h-3 w-3 text-green-500" />
            <span className="text-gray-300">Bundle</span>
          </div>
          <div className="font-bold text-lg text-green-400">
            {perfData.bundleSize}
          </div>
        </div>

        <div className="bg-gray-800/50 p-2 rounded-lg">
          <div className="flex items-center space-x-1 mb-1">
            <Activity className="h-3 w-3 text-purple-500" />
            <span className="text-gray-300">Load</span>
          </div>
          <div className="font-bold text-lg text-purple-400">
            {perfData.pageLoadTime}ms
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-700">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Status:</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 font-medium">Optimized</span>
          </div>
        </div>
      </div>

      {/* Performance indicator bar */}
      <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (perfData.fps / 60) * 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  )
}

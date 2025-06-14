'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Wifi, WifiOff, Zap } from 'lucide-react'

interface PerformanceMetrics {
  fps: number
  memory: number
  timing: number
  isOnline: boolean
  connectionType: string
}

export default function PerformanceMonitor() {
  // Temporarily disabled to prevent React warnings
  // Will re-enable with proper prop filtering
  return null

  // FPS Counter
  const measureFPS = useCallback(() => {
    let frames = 0
    let lastTime = performance.now()
    
    const countFrames = () => {
      frames++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        setMetrics(prev => ({ ...prev, fps: Math.round(frames * 1000 / (currentTime - lastTime)) }))
        frames = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(countFrames)
    }
    
    requestAnimationFrame(countFrames)
  }, [])

  // Memory Usage
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      setMetrics(prev => ({ ...prev, memory: usedMB }))
    }
  }, [])

  // Performance Timing
  const measureTiming = useCallback(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart
        setMetrics(prev => ({ ...prev, timing: Math.round(loadTime) }))
      }
    }
  }, [])

  // Network Status
  const updateNetworkStatus = useCallback(() => {
    const isOnline = navigator.onLine
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    const connectionType = connection ? connection.effectiveType || 'unknown' : 'unknown'
    
    setMetrics(prev => ({ ...prev, isOnline, connectionType }))
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initialize measurements
    measureFPS()
    measureTiming()
    
    // Set up intervals
    const memoryInterval = setInterval(measureMemory, 2000)
    const networkInterval = setInterval(updateNetworkStatus, 1000)
    
    // Network event listeners
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)
    
    // Initial network check
    updateNetworkStatus()
    
    // Show monitor in development or when URL contains debug
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      (typeof window !== 'undefined' && window.location.search.includes('debug=true'))
    setShowMonitor(shouldShow)

    return () => {
      clearInterval(memoryInterval)
      clearInterval(networkInterval)
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [measureFPS, measureMemory, measureTiming, updateNetworkStatus])

  // Service Worker Registration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration)
        })
        .catch((error) => {
          console.log('SW registration failed:', error)
        })
    }
  }, [])

  if (!showMonitor) return null

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500'
    if (fps >= 30) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getMemoryColor = (memory: number) => {
    if (memory <= 50) return 'text-green-500'
    if (memory <= 100) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="fixed top-20 right-4 z-50 bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg text-xs font-mono shadow-lg"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Activity className="h-3 w-3" />
          <span className="font-semibold">Performance</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span>FPS:</span>
            <span className={getPerformanceColor(metrics.fps)}>{metrics.fps}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Memory:</span>
            <span className={getMemoryColor(metrics.memory)}>{metrics.memory}MB</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Load:</span>
            <span className="text-blue-400">{metrics.timing}ms</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Network:</span>
            <div className="flex items-center space-x-1">
              {metrics.isOnline ? (
                <Wifi className="h-3 w-3 text-green-500" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500" />
              )}
              <span className={metrics.isOnline ? 'text-green-400' : 'text-red-400'}>
                {metrics.connectionType}
              </span>
            </div>
          </div>
        </div>

        {/* Performance indicator */}
        <motion.div
          className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"
            style={{
              width: `${Math.min(100, (metrics.fps / 60) * 100)}%`
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Performance timing hooks for components
export const usePerformanceTiming = () => {
  const markStart = useCallback((name: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`)
    }
  }, [])

  const markEnd = useCallback((name: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
      
      const measures = performance.getEntriesByName(name, 'measure')
      if (measures.length > 0) {
        console.log(`Performance: ${name} took ${measures[0].duration.toFixed(2)}ms`)
      }
    }
  }, [])

  return { markStart, markEnd }
}

'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  animate?: boolean
}

const Skeleton = memo(function Skeleton({ 
  className = '', 
  animate = true 
}: SkeletonProps) {
  if (!animate) {
    return <div className={`bg-gray-200 rounded ${className}`} />
  }

  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        backgroundSize: '200% 200%'
      }}
    />
  )
})

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LoadingSpinner = memo(function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
})

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  animated?: boolean
}

const ProgressBar = memo(function ProgressBar({
  value,
  max = 100,
  className = '',
  showLabel = false,
  animated = true
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={animated ? {
          type: "spring",
          stiffness: 100,
          damping: 20
        } : { duration: 0 }}
      >
        {showLabel && (
          <div className="flex items-center justify-center h-full text-white text-xs font-medium">
            {Math.round(percentage)}%
          </div>
        )}
      </motion.div>
    </div>
  )
})

interface PulseLoaderProps {
  count?: number
  size?: number
  color?: string
  className?: string
}

const PulseLoader = memo(function PulseLoader({
  count = 3,
  size = 8,
  color = 'bg-blue-600',
  className = ''
}: PulseLoaderProps) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`rounded-full ${color}`}
          style={{ width: size, height: size }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
})

interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
  threshold?: number
}

const LazyWrapper = memo(function LazyWrapper({
  children,
  fallback = <Skeleton className="w-full h-32" />,
  className = '',
  threshold = 0.1
}: LazyWrapperProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
})

export { Skeleton, LoadingSpinner, ProgressBar, PulseLoader, LazyWrapper }

'use client'

import Image from 'next/image'
import { useState, useCallback, memo } from 'react'
import { motion } from 'framer-motion'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  animate?: boolean
  fallbackSrc?: string
}

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width = 40,
  height = 40,
  className = '',
  priority = false,
  quality = 90,
  placeholder = 'empty',
  blurDataURL,
  animate = false,
  fallbackSrc = '/logos/placeholder.png'
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
  }, [])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
  }, [fallbackSrc, imageSrc])

  const imageElement = (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
      priority={priority}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onLoad={handleLoad}
      onError={handleError}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{
        objectFit: 'contain',
        objectPosition: 'center'
      }}
    />
  )

  if (animate && !hasError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          mass: 0.5
        }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
      >
        {imageElement}
      </motion.div>
    )
  }

  return imageElement
})

export default OptimizedImage

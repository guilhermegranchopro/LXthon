// React 19 types compatibility
import 'react'

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

// Performance monitoring
declare global {
  interface Window {
    __NEXT_DATA__: any
  }
}

export {}

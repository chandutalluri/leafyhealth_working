import { ReactNode, useState, useEffect } from 'react'

interface ClientMotionProps {
  children: ReactNode
  className?: string
  initial?: any
  animate?: any
  transition?: any
  whileHover?: any
  whileTap?: any
}

export default function ClientMotion({ 
  children, 
  className, 
  initial, 
  animate, 
  transition, 
  whileHover,
  whileTap 
}: ClientMotionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render without motion for now to eliminate SSR issues
  return <div className={className}>{children}</div>
}
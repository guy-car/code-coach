import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import coachImage from '@/assets/coach-v1.png'
import { theme } from '@/lib/theme'

interface CoachMotivationAnimationProps {
  message: string;
}

export function CoachMotivationAnimation({ message }: CoachMotivationAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    // Initial fade in
    setIsVisible(true)

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => {
      clearInterval(cursorInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-8">
        <div className="relative w-48 h-48">
          <img 
            src={coachImage} 
            alt="Code Coach" 
            className={cn(
              "w-full h-full object-contain transition-opacity duration-500 absolute inset-0",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          />
          <div className="absolute inset-0">
            <div className="w-full h-full bg-[#00FF00] opacity-20 blur-xl animate-pulse" />
          </div>
        </div>
        <div 
          className={cn(
            "text-2xl font-mono text-[#00FF00] transition-opacity duration-500 text-center max-w-2xl",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="animate-pulse">
            {message}
            <span className={cn(
              "ml-1",
              showCursor ? "opacity-100" : "opacity-0"
            )}>
              |
            </span>
          </span>
        </div>
      </div>
    </div>
  );
} 
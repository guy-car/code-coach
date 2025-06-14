import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const loadingMessages = [
  "Chalking up the console...",
  "Running a quick lap around the stack...",
  "Pumping up the JavaScript...",
  "Warming up the compiler...",
  "Stretching the syntax...",
  "Loading the code weights...",
  "Buffering the brain gains...",
  "Initializing the inner coder...",
  "Calibrating the code coach...",
  "Preparing your programming path..."
]

interface CoachLoadingMessageProps {
  isLoading: boolean;
}

export function CoachLoadingMessage({ isLoading }: CoachLoadingMessageProps) {
  const [message, setMessage] = useState(loadingMessages[0])
  const [isVisible, setIsVisible] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      setIsVisible(false)
      return
    }

    // Initial fade in
    setIsVisible(true)

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    // Message change effect
    const messageInterval = setInterval(() => {
      setMessage(prev => {
        const currentIndex = loadingMessages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingMessages.length
        return loadingMessages[nextIndex]
      })
    }, 6000) // Change message every 6 seconds

    return () => {
      clearInterval(cursorInterval)
      clearInterval(messageInterval)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        className={cn(
          "text-2xl font-mono text-[#00FF00] transition-opacity duration-500",
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
  )
} 
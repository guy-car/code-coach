import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import coachImage from '@/assets/coach-v1.png'

const loadingMessages = [
  "Coach is chalking up the console...",
  "Coach is running a quick lap around the stack...",
  "Coach is pumping up the JavaScript...",
  "Coach is warming up the compiler...",
  "Coach is stretching the syntax...",
  "Coach is loading the code weights...",
  "Coach is buffering the brain gains...",
  "Coach is initializing the inner coder...",
  "Coach is calibrating the code coach...",
  "Coach is preparing your programming path..."
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
    </div>
  )
} 
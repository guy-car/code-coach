import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import coachImage from '@/assets/coach-v1.png'
import { Button } from '@/components/ui/button'
import { theme } from '@/lib/theme'

interface LevelCompletionAnimationProps {
  currentLevel: 'easy' | 'medium' | 'hard';
  onContinue: () => void;
  onIncreaseDifficulty: () => void;
}

const levelMessages = {
  easy: "Incredible work! You've mastered the basics. Ready to level up?",
  medium: "Outstanding! You're becoming a true JavaScript warrior. Want to take on the ultimate challenge?",
  hard: "Legendary! You've conquered all challenges. You're a JavaScript master!"
}

export function LevelCompletionAnimation({ currentLevel, onContinue, onIncreaseDifficulty }: LevelCompletionAnimationProps) {
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
            {levelMessages[currentLevel]}
            <span className={cn(
              "ml-1",
              showCursor ? "opacity-100" : "opacity-0"
            )}>
              |
            </span>
          </span>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={onContinue}
            className="font-mono text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
            style={{
              backgroundColor: theme.colors.background.dark,
              color: theme.colors.primary,
              border: `1px solid ${theme.colors.primary}`,
              boxShadow: theme.animations.glow
            }}
          >
            CONTINUE
          </Button>
          <Button
            onClick={onIncreaseDifficulty}
            className="font-mono text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.background.dark,
              boxShadow: theme.animations.glow
            }}
          >
            LEVEL UP
          </Button>
        </div>
      </div>
    </div>
  )
} 
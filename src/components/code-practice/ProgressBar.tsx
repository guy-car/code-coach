import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"

interface ProgressBarProps {
  currentProblemIndex: number;
  totalProblems: number;
  level: 'easy' | 'medium' | 'hard';
}

export function ProgressBar({ currentProblemIndex, totalProblems, level }: ProgressBarProps) {
  const progress = (currentProblemIndex / totalProblems) * 100;
  
  const levelColors = {
    easy: theme.colors.primary,
    medium: theme.colors.secondary,
    hard: theme.colors.accent
  };

  const color = levelColors[level];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium font-mono" style={{ color: theme.colors.text.primary }}>
          Problem {currentProblemIndex + 1} of {totalProblems}
        </span>
        <span
          className="font-mono text-lg px-4 py-1 rounded-md"
          style={{
            backgroundColor: color,
            color: theme.colors.background.dark,
            boxShadow: theme.animations.glow,
            fontWeight: 700,
            letterSpacing: 1,
            borderRadius: '0.5rem',
            border: 'none',
            display: 'inline-block',
            minWidth: 80,
            textAlign: 'center',
          }}
        >
          {level === 'easy' && 'EASY'}
          {level === 'medium' && 'MEDIUM'}
          {level === 'hard' && 'HARD'}
        </span>
      </div>
      
      <div className="h-2 w-full rounded-full overflow-hidden" style={{ 
        backgroundColor: theme.colors.background.dark,
        border: `1px solid ${theme.colors.border}`
      }}>
        <div 
          className="h-full transition-all duration-300"
          style={{ 
            width: `${progress}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`
          }}
        />
      </div>
      
      <div className="flex justify-between">
        {Array.from({ length: totalProblems }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1 h-1 rounded-full transition-all duration-300",
              index <= currentProblemIndex ? 'animate-pulse' : ''
            )}
            style={{ 
              backgroundColor: index <= currentProblemIndex ? color : theme.colors.background.dark,
              border: `1px solid ${index <= currentProblemIndex ? color : theme.colors.border}`,
              boxShadow: index <= currentProblemIndex ? `0 0 5px ${color}40` : 'none'
            }}
          />
        ))}
      </div>
    </div>
  )
} 
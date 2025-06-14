import { cn } from "@/lib/utils"

interface ProgressBarProps {
  currentProblemIndex: number;
  totalProblems: number;
  level: 'easy' | 'medium' | 'hard';
}

export function ProgressBar({ currentProblemIndex, totalProblems, level }: ProgressBarProps) {
  const progress = ((currentProblemIndex + 1) / totalProblems) * 100;
  
  const levelColors = {
    easy: {
      bg: 'bg-green-500',
      text: 'text-green-500',
      border: 'border-green-500'
    },
    medium: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-500',
      border: 'border-yellow-500'
    },
    hard: {
      bg: 'bg-red-500',
      text: 'text-red-500',
      border: 'border-red-500'
    }
  };

  const colors = levelColors[level];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">
          Problem {currentProblemIndex + 1} of {totalProblems}
        </span>
        <span className={cn("text-sm font-medium", colors.text)}>
          {level.charAt(0).toUpperCase() + level.slice(1)} Level
        </span>
      </div>
      
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-300", colors.bg)}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between">
        {Array.from({ length: totalProblems }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1 h-1 rounded-full",
              index <= currentProblemIndex ? colors.bg : 'bg-muted'
            )}
          />
        ))}
      </div>
    </div>
  )
} 
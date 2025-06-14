import { Card } from "@/components/ui/card"
import { theme } from "@/lib/theme"

interface ResultsProps {
  output: string | null;
  error: string | null;
  isCorrect: boolean | null;
}

export function Results({ output, error, isCorrect }: ResultsProps) {
  return (
    <Card className="border" style={{ 
      backgroundColor: theme.colors.background.card,
      borderColor: theme.colors.border
    }}>
      <div className="space-y-4">
        <h3 className="text-sm font-medium font-mono" style={{ color: theme.colors.primary }}>
          Results:
        </h3>
        {error && (
          <div className="p-4 rounded-md font-mono text-sm" style={{ 
            backgroundColor: `${theme.colors.accent}20`,
            color: theme.colors.accent,
            border: `1px solid ${theme.colors.accent}40`
          }}>
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        )}
        {output && !error && (
          <div className="p-4 rounded-md font-mono text-sm" style={{ 
            backgroundColor: theme.colors.background.dark,
            color: theme.colors.text.secondary,
            border: `1px solid ${theme.colors.border}`
          }}>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        )}
        {isCorrect !== null && !error && (
          <div className={`p-4 rounded-md font-mono text-sm ${isCorrect ? 'animate-pulse' : ''}`} style={{ 
            backgroundColor: isCorrect ? `${theme.colors.primary}20` : `${theme.colors.accent}20`,
            color: isCorrect ? theme.colors.primary : theme.colors.accent,
            border: `1px solid ${isCorrect ? theme.colors.primary : theme.colors.accent}40`
          }}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect. Try again!'}
          </div>
        )}
      </div>
    </Card>
  )
} 
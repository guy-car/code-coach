import { Card } from "@/components/ui/card"

interface ResultsProps {
  output: string | null;
  error: string | null;
  isCorrect: boolean | null;
}

export function Results({ output, error, isCorrect }: ResultsProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Results:</h3>
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{error}</pre>
          </div>
        )}
        {output && !error && (
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{output}</pre>
          </div>
        )}
        {isCorrect !== null && !error && (
          <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect. Try again!'}
          </div>
        )}
      </div>
    </Card>
  )
} 
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { generateArrayMethodProblems } from "@/services/openai"
import { Problem } from "@/services/problems"

interface ProblemGeneratorProps {
  onProblemsGenerated: (problems: Problem[]) => void;
}

export function ProblemGenerator({ onProblemsGenerated }: ProblemGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateProblems = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const problems = await generateArrayMethodProblems('push', 3)
      onProblemsGenerated(problems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate problems')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Generate New Problems</h3>
        <p className="text-sm text-muted-foreground">
          Generate a new set of JavaScript array method practice problems with varying difficulty levels.
        </p>
        
        {error && (
          <div className="text-sm text-destructive">
            {error}
          </div>
        )}

        <Button 
          onClick={handleGenerateProblems}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Problems'}
        </Button>
      </div>
    </Card>
  )
} 
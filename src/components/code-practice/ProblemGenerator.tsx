import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { generateArrayMethodProblems } from "@/services/openai"
import { Problem } from "@/services/problems"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProblemGeneratorProps {
  onProblemsGenerated: (problems: Problem[]) => void;
  currentLevel: 'easy' | 'medium' | 'hard';
  levelsCompleted: string[];
}

export function ProblemGenerator({ onProblemsGenerated, currentLevel, levelsCompleted }: ProblemGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard'>(currentLevel)

  const handleGenerateProblems = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const problems = await generateArrayMethodProblems('push', selectedLevel)
      onProblemsGenerated(problems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate problems')
    } finally {
      setIsLoading(false)
    }
  }

  const getNextLevel = (current: 'easy' | 'medium' | 'hard'): 'easy' | 'medium' | 'hard' | null => {
    if (current === 'easy') return 'medium'
    if (current === 'medium') return 'hard'
    return null
  }

  const nextLevel = getNextLevel(currentLevel)
  const canProgress = nextLevel && !levelsCompleted.includes(nextLevel)

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Generate Problems</h3>
        <p className="text-sm text-muted-foreground">
          Generate a new set of JavaScript array method practice problems.
        </p>
        
        <div className="flex items-center gap-4">
          <Select
            value={selectedLevel}
            onValueChange={(value: 'easy' | 'medium' | 'hard') => setSelectedLevel(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={handleGenerateProblems}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Problems'}
          </Button>
        </div>
        
        {error && (
          <div className="text-sm text-destructive">
            {error}
          </div>
        )}

        {canProgress && (
          <div className="text-sm text-muted-foreground">
            Complete all {currentLevel} problems to unlock {nextLevel} level!
          </div>
        )}
      </div>
    </Card>
  )
} 
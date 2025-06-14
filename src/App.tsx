import { useState, useEffect } from "react"
import { CodeEditor } from "@/components/code-practice/CodeEditor"
import { ProblemDisplay } from "@/components/code-practice/ProblemDisplay"
import { Results } from "@/components/code-practice/Results"
import { ProblemGenerator } from "@/components/code-practice/ProblemGenerator"
import { Badge } from "@/components/ui/badge"
import { Problem, pushProblems as defaultProblems } from "@/services/problems"
import { loadUserProgress, updateUserProgress, markLevelCompleted, cacheGeneratedProblems, getCachedProblems } from "@/services/storage"

function App() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0)
  const [problems, setProblems] = useState<Problem[]>(defaultProblems)
  const [results, setResults] = useState<{
    success: boolean;
    message: string;
    expectedOutput?: string;
    actualOutput?: string;
  } | null>(null)
  const [codeEditorKey, setCodeEditorKey] = useState(0)
  const [currentLevel, setCurrentLevel] = useState<'easy' | 'medium' | 'hard'>('easy')

  const currentProblem = problems[currentProblemIndex]

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = loadUserProgress();
    setCurrentLevel(savedProgress.currentLevel);
    setCurrentProblemIndex(savedProgress.currentProblemIndex);
    
    // Try to load cached problems for the current level
    const cachedProblems = getCachedProblems(savedProgress.currentLevel);
    if (cachedProblems) {
      setProblems(cachedProblems);
    }
  }, []);

  const handleProblemsGenerated = (newProblems: Problem[]) => {
    setProblems(newProblems);
    setCurrentProblemIndex(0);
    setResults(null);
    setCodeEditorKey(prev => prev + 1);
    
    // Cache the generated problems
    cacheGeneratedProblems(currentLevel, newProblems);
  }

  const handleRunCode = (code: string) => {
    try {
      // Get the variable name from the first line of setup
      const firstLine = currentProblem.setup.split('\n')[0]
      const variableName = firstLine.split('=')[0].trim().replace('const ', '')
      
      // Combine setup code with user code
      const setupCode = currentProblem.setup.replace('// Your code here', code)
      
      // Execute the code directly
      const func = new Function(setupCode + `; return ${variableName};`)
      const result = func()
      
      // Parse both the actual and expected outputs
      const actualArray = Array.isArray(result) ? result : JSON.parse(JSON.stringify(result))
      
      // Convert JavaScript object notation to valid JSON by replacing unquoted property names
      const normalizedExpectedOutput = currentProblem.expectedOutput
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Add quotes around property names
        .replace(/'/g, '"') // Replace single quotes with double quotes
      const expectedArray = JSON.parse(normalizedExpectedOutput)
      
      // Compare array contents with deep equality for objects
      const success = Array.isArray(actualArray) && 
                     Array.isArray(expectedArray) &&
                     actualArray.length === expectedArray.length &&
                     actualArray.every((item, index) => {
                       const expectedItem = expectedArray[index]
                       if (typeof item === 'object' && item !== null) {
                         return JSON.stringify(item) === JSON.stringify(expectedItem)
                       }
                       return item === expectedItem
                     })
      
      // Format the actual output to match the expected output style (single quotes with spaces)
      const formatOutput = (arr: any[]): string => {
        return '[' + arr.map(item => {
          if (typeof item === 'string') {
            return `'${item}'`
          } else if (typeof item === 'object' && item !== null) {
            return '{ ' + Object.entries(item)
              .map(([key, value]) => `${key}: ${typeof value === 'string' ? `'${value}'` : value}`)
              .join(', ') + ' }'
          }
          return item
        }).join(', ') + ']'
      }
      
      setResults({
        success,
        message: success 
          ? "Great job! Your solution is correct."
          : "Not quite right. Check your solution and try again.",
        expectedOutput: currentProblem.expectedOutput,
        actualOutput: formatOutput(actualArray)
      })

      // If successful and it's the last problem, mark the level as completed
      if (success && currentProblemIndex === problems.length - 1) {
        markLevelCompleted(currentLevel);
      }
    } catch (error) {
      console.error('Execution error:', error)
      setResults({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`,
        expectedOutput: currentProblem.expectedOutput,
        actualOutput: "Error occurred"
      })
    }
  }

  const handleNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      const newIndex = currentProblemIndex + 1;
      setCurrentProblemIndex(newIndex);
      setResults(null);
      setCodeEditorKey(prev => prev + 1);
      
      // Save progress
      updateUserProgress({ currentProblemIndex: newIndex });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">JS Practice</h1>
            <p className="text-muted-foreground">Master JavaScript through repetition</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Problem {currentProblemIndex + 1} of {problems.length}</Badge>
            <Badge>{currentProblem.difficulty}</Badge>
          </div>
        </header>

        <ProblemGenerator onProblemsGenerated={handleProblemsGenerated} />
        <ProblemDisplay problem={currentProblem} />
        <CodeEditor onRun={handleRunCode} key={codeEditorKey} />
        {results && <Results {...results} />}
        
        {results?.success && currentProblemIndex < problems.length - 1 && (
          <button
            onClick={handleNextProblem}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Next Problem
          </button>
        )}
      </div>
    </div>
  )
}

export default App

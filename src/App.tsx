import { useState, useEffect } from "react"
import { CodeEditor } from "@/components/code-practice/CodeEditor"
import { ProblemDisplay } from "@/components/code-practice/ProblemDisplay"
import { Results } from "@/components/code-practice/Results"
import { ProblemGenerator } from "@/components/code-practice/ProblemGenerator"
import { ProgressBar } from "@/components/code-practice/ProgressBar"
import { Badge } from "@/components/ui/badge"
import { Problem, pushProblems as defaultProblems } from "@/services/problems"
import { loadUserProgress, updateUserProgress, markLevelCompleted, cacheGeneratedProblems, getCachedProblems } from "@/services/storage"
import { theme } from "@/lib/theme"

function App() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0)
  const [problems, setProblems] = useState<Problem[]>([])
  const [results, setResults] = useState<{
    success: boolean;
    message: string;
    expectedOutput?: string;
    actualOutput?: string;
  } | null>(null)
  const [codeEditorKey, setCodeEditorKey] = useState(0)
  const [currentLevel, setCurrentLevel] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [levelsCompleted, setLevelsCompleted] = useState<string[]>([])
  const [hasGeneratedProblems, setHasGeneratedProblems] = useState(false)

  const currentProblem = problems[currentProblemIndex]

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = loadUserProgress();
    setCurrentLevel(savedProgress.currentLevel);
    setCurrentProblemIndex(savedProgress.currentProblemIndex);
    setLevelsCompleted(savedProgress.levelsCompleted);
    
    // Try to load cached problems for the current level
    const cachedProblems = getCachedProblems(savedProgress.currentLevel);
    if (cachedProblems) {
      setProblems(cachedProblems);
      setHasGeneratedProblems(true);
    }
  }, []);

  const handleProblemsGenerated = (newProblems: Problem[]) => {
    setProblems(newProblems);
    setCurrentProblemIndex(0);
    setResults(null);
    setCodeEditorKey(prev => prev + 1);
    setHasGeneratedProblems(true);
    
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
      
      // Create a mock console.log to capture the output
      let capturedOutput: any = null
      const mockConsole = {
        log: (...args: any[]) => {
          capturedOutput = args[0]
        }
      }
      
      // Execute the code with the mock console
      const func = new Function('console', setupCode)
      func(mockConsole)
      
      // Parse both the actual and expected outputs
      const actualArray = Array.isArray(capturedOutput) ? capturedOutput : JSON.parse(JSON.stringify(capturedOutput))
      
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
        const newLevelsCompleted = [...levelsCompleted, currentLevel];
        setLevelsCompleted(newLevelsCompleted);
        markLevelCompleted(currentLevel);
        
        // Update progress with new levels completed
        updateUserProgress({ levelsCompleted: newLevelsCompleted });
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
    <div className="min-h-screen" style={{ 
      backgroundColor: theme.colors.background.dark,
      color: theme.colors.text.primary,
      fontFamily: theme.fonts.mono
    }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <header className="flex items-center justify-between border-b pb-4" style={{ borderColor: theme.colors.border }}>
          <div>
            <h1 className="text-5xl font-bold mb-2" style={{ 
              color: theme.colors.primary,
              fontFamily: theme.fonts.display,
              textShadow: theme.animations.glow
            }}>
              HACKER GYM
            </h1>
            <p className="text-sm" style={{ color: theme.colors.text.muted }}>
              Reps reps reps
            </p>
          </div>
          {currentProblem && (
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="font-mono text-lg" style={{ 
                backgroundColor: theme.colors.background.dark,
                color: theme.colors.text.primary
              }}>
                Problem {currentProblemIndex + 1} of {problems.length}
              </Badge>
              <Badge className="font-mono text-lg" style={{ 
                backgroundColor: 
                  currentProblem.difficulty === 'easy' ? theme.colors.primary :
                  currentProblem.difficulty === 'medium' ? theme.colors.secondary :
                  theme.colors.accent,
                color: theme.colors.background.dark
              }}>
                {currentProblem.difficulty.toUpperCase()}
              </Badge>
            </div>
          )}
        </header>

        {hasGeneratedProblems && (
          <ProgressBar 
            currentProblemIndex={currentProblemIndex}
            totalProblems={problems.length}
            level={currentLevel}
          />
        )}

        <ProblemGenerator 
          onProblemsGenerated={handleProblemsGenerated} 
          currentLevel={currentLevel}
          levelsCompleted={levelsCompleted}
        />

        {hasGeneratedProblems && (
          <>
            <ProblemDisplay problem={currentProblem} />
            <CodeEditor onRun={handleRunCode} key={codeEditorKey} />
            {results && (
              <Results 
                output={results.actualOutput}
                error={results.success ? null : results.message}
                isCorrect={results.success}
              />
            )}
            
            {results?.success && currentProblemIndex < problems.length - 1 && (
              <button
                onClick={handleNextProblem}
                className="w-full py-3 px-4 rounded-md font-mono text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background.dark,
                  boxShadow: theme.animations.glow
                }}
              >
                NEXT PROBLEM
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App

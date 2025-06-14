import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { CodeEditor } from "@/components/code-practice/CodeEditor"
import { ProblemDisplay } from "@/components/code-practice/ProblemDisplay"
import { Results } from "@/components/code-practice/Results"
import { ProblemGenerator } from "@/components/code-practice/ProblemGenerator"
import { ProgressBar } from "@/components/code-practice/ProgressBar"
import { ThemeSelection } from "@/components/code-practice/ThemeSelection"
import { Badge } from "@/components/ui/badge"
import { Problem } from "@/services/problems"
import { Theme } from "@/services/themes"
import { loadUserProgress, updateUserProgress, markLevelCompleted, cacheGeneratedProblems, getCachedProblems } from "@/services/storage"
import { theme } from "@/lib/theme"
import { Lobby } from "@/components/Lobby"

function Practice() {
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
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

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

    // Set theme from location state
    if (location.state?.theme) {
      setSelectedTheme(location.state.theme);
    }
  }, [location.state]);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
  }

  const handleProblemsGenerated = (newProblems: Problem[]) => {
    setProblems(newProblems);
    setHasGeneratedProblems(true);
    setCurrentProblemIndex(0);
    setResults(null);
    setCodeEditorKey(prev => prev + 1);
    
    // Cache the problems
    cacheGeneratedProblems(currentLevel, newProblems);
    
    // Save progress
    updateUserProgress({ currentProblemIndex: 0 });
  }

  const handleRunCode = async (code: string) => {
    if (!currentProblem) return;
    
    try {
      // Create a function from the user's code
      const userFunction = new Function('arr', code);
      
      // Run the function with the first test case input
      const testInput = JSON.parse(currentProblem.testCases[0].input);
      const actualArray = userFunction(testInput);
      const expectedArray = JSON.parse(currentProblem.testCases[0].expected);
      
      // Compare the arrays
      const success = JSON.stringify(actualArray) === JSON.stringify(expectedArray);
      
      setResults({
        success,
        message: success ? 'Correct!' : 'Try again!',
        expectedOutput: currentProblem.expectedOutput,
        actualOutput: JSON.stringify(actualArray, null, 2)
      });
      
      if (success && currentProblemIndex === problems.length - 1) {
        // Mark level as completed
        const newLevelsCompleted = [...levelsCompleted, currentLevel];
        setLevelsCompleted(newLevelsCompleted);
        markLevelCompleted(currentLevel);
      }
    } catch (error) {
      console.error('Execution error:', error);
      setResults({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`,
        expectedOutput: currentProblem.expectedOutput,
        actualOutput: "Error occurred"
      });
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
            <h1 
              className="text-5xl font-bold mb-2 cursor-pointer hover:opacity-80 transition-opacity" 
              style={{ 
                color: theme.colors.primary,
                fontFamily: theme.fonts.display,
                textShadow: theme.animations.glow
              }}
              onClick={() => navigate('/')}
            >
              HACKER GYM
            </h1>
            <p className="text-sm" style={{ color: theme.colors.text.muted }}>
              Reps reps reps
            </p>
          </div>
          {hasGeneratedProblems && currentProblem && (
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

        {!selectedTheme ? (
          <ThemeSelection onThemeSelect={handleThemeSelect} />
        ) : (
          <>
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
              selectedTheme={selectedTheme}
            />

            {hasGeneratedProblems && (
              <>
                <ProblemDisplay problem={currentProblem} />
                <CodeEditor onRun={handleRunCode} key={codeEditorKey} />
                {results && (
                  <Results 
                    output={results.actualOutput || null}
                    error={results.success ? null : results.message || null}
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
          </>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/practice" element={<Practice />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { CodeEditor } from "@/components/code-practice/CodeEditor"
import { ProblemDisplay } from "@/components/code-practice/ProblemDisplay"
import { Results } from "@/components/code-practice/Results"
import { ProblemGenerator } from "@/components/code-practice/ProblemGenerator"
import { ProgressBar } from "@/components/code-practice/ProgressBar"
import { ThemeSelection } from "@/components/code-practice/ThemeSelection"
import { LevelCompletionAnimation } from "@/components/code-practice/LevelCompletionAnimation"
import { Badge } from "@/components/ui/badge"
import { Problem } from "@/services/problems"
import { Theme } from "@/services/themes"
import { loadUserProgress, updateUserProgress, markLevelCompleted, cacheGeneratedProblems, getCachedProblems } from "@/services/storage"
import { theme } from "@/lib/theme"
import { Lobby } from "@/components/Lobby"
import { generateArrayMethodProblems } from "@/services/openai"

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
  const [showLevelCompletion, setShowLevelCompletion] = useState(false)
  const [isGeneratingProblems, setIsGeneratingProblems] = useState(false)
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

    // Set theme and handle problems from location state
    if (location.state?.theme) {
      setSelectedTheme(location.state.theme);
      
      // If we have problems in the location state, use them
      if (location.state.problems) {
        handleProblemsGenerated(location.state.problems);
      } else if (location.state.difficulty) {
        // If we have a difficulty but no problems, generate them
        setCurrentLevel(location.state.difficulty);
        setIsGeneratingProblems(true);
        generateArrayMethodProblems(location.state.theme, location.state.difficulty)
          .then(handleProblemsGenerated)
          .catch(error => {
            console.error('Error generating problems:', error);
            setIsGeneratingProblems(false);
          });
      }
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
    setIsGeneratingProblems(false);
    
    // Cache the problems
    cacheGeneratedProblems(currentLevel, newProblems);
    
    // Save progress
    updateUserProgress({ currentProblemIndex: 0 });
  }

  /**
   * ========================================
   * CRITICAL: STABLE CODE SANDBOX PATTERN
   * ========================================
   * 
   * This implementation has been tested and is STABLE.
   * DO NOT modify without understanding why previous attempts failed.
   * 
   * WORKING PATTERN:
   * 1. String replacement: Replace '// Your code here' with user's code
   * 2. Single execution: Use new Function() with combined code
   * 3. Return variable: Extract and return the target variable
   * 
   * FAILED APPROACHES (do not revert to these):
   * ❌ Multiple eval() calls - creates separate scopes
   * ❌ Function wrapping - breaks variable access
   * ❌ Separate setup/user execution - scope isolation
   * 
   * EXAMPLE:
   * Setup: 'const arr = [1,2]; // Your code here; console.log(arr);'
   * User: 'arr.push(3)'
   * Combined: 'const arr = [1,2]; arr.push(3); console.log(arr); return arr;'
   * 
   * Last stable: [2024-06-14]
   * Issues fixed: Variable scope, execution context, consistent results
   */
  const handleRunCode = async (code: string) => {
    /**
     * CRITICAL: This sandbox implementation is stable and tested.
     * DO NOT modify the execution pattern without thorough testing.
     * 
     * Pattern: String replacement + single Function execution
     * - Replace '// Your code here' with user code
     * - Execute in single scope using new Function()
     * - Return target variable
     * 
     * This avoids scope issues from multiple eval() calls or function wrapping.
     */
    if (!currentProblem) return;
    try {
      // Extract the variable name from the first line of setup (e.g., 'const employees = ...' -> 'employees')
      const firstLine = currentProblem.setup.split('\n')[0];
      const variableName = firstLine.split('=')[0].trim().replace('const ', '');

      // Replace the placeholder with the user's code
      // This ensures the user's code is executed in the same scope as the setup
      const combinedCode = currentProblem.setup.replace('// Your code here', code);
      console.log('Combined code being executed:', combinedCode);

      const finalCode = combinedCode + `; return ${variableName};`;
      console.log('Final code:', finalCode);

      // Execute all code in a single scope and return the target variable
      // This avoids scope issues from wrapping or multiple evals
      const func = new Function(finalCode);
      const actualArray = func();

      // Compare with expected output
      const expectedOutput = currentProblem.testCases[0].expected;
      const expectedArray = eval(expectedOutput);

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
        setShowLevelCompletion(true);
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

  const handleContinue = () => {
    setShowLevelCompletion(false);
  }

  const handleIncreaseDifficulty = async () => {
    const nextLevel = currentLevel === 'easy' ? 'medium' : 'hard';
    setCurrentLevel(nextLevel);
    setShowLevelCompletion(false);
    setHasGeneratedProblems(false);
    setProblems([]);
    setCurrentProblemIndex(0);
    setResults(null);
    setIsGeneratingProblems(true);
    
    // Update progress
    updateUserProgress({ currentLevel: nextLevel, currentProblemIndex: 0 });

    try {
      if (selectedTheme) {
        const newProblems = await generateArrayMethodProblems(selectedTheme, nextLevel);
        handleProblemsGenerated(newProblems);
      }
    } catch (error) {
      console.error('Error generating problems:', error);
      setIsGeneratingProblems(false);
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
              onClick={() => { localStorage.clear(); navigate('/'); }}
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

            {!hasGeneratedProblems && !isGeneratingProblems && (
              <ProblemGenerator 
                onProblemsGenerated={handleProblemsGenerated} 
                currentLevel={currentLevel}
                levelsCompleted={levelsCompleted}
                selectedTheme={selectedTheme}
              />
            )}

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

            {showLevelCompletion && (
              <LevelCompletionAnimation
                currentLevel={currentLevel}
                onContinue={handleContinue}
                onIncreaseDifficulty={handleIncreaseDifficulty}
              />
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

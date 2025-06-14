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
import { getProblemsByMethod } from "@/services/problems"
import { CoachMotivationAnimation } from "@/components/code-practice/CoachMotivationAnimation"

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
  const [mistakeCount, setMistakeCount] = useState(0)
  const [showCoachMotivation, setShowCoachMotivation] = useState(false)
  const [coachMessage, setCoachMessage] = useState('')
  const [coachMotivationKey, setCoachMotivationKey] = useState(0)
  const motivationalMessages = [
    "Three mistakes? Let's analyze what went wrong and try again!",
    "Every bug is a chance to learn something new. Keep going!",
    "That's three attempts - let's break this down step by step!",
    "Your debugging skills are growing with each try!",
    "No worries! Let's look at this from a different angle!",
    "Three tries? Perfect opportunity to review our approach!",
    "Time to take a deep breath and tackle this again!",
    "Your problem-solving muscles are getting stronger!",
    "That's what I call persistence! Let's try one more time!",
    "Your code endurance is impressive! Keep pushing!",
    "Three attempts and still going? That's the spirit!",
    "Your debugging skills are improving with each try!",
    "Mistakes are just stepping stones to mastery!",
    "Your code gains are coming along nicely!",
    "That's some solid debugging practice! Let's continue!",
    "Your algorithm thinking is getting sharper!",
    "Three tries? Time to apply what we've learned!",
    "Your debugging game is getting stronger!",
    "Mistakes are just warm-ups for success!",
    "Your syntax skills are improving!",
    "That's what I call dedication! Let's try again!",
    "Your algorithm thinking is getting better!",
    "Three attempts? Time to shine!",
    "Your debugging approach is getting more refined!",
    "Mistakes are just weights for your coding muscles!",
    "Your code stamina is impressive!",
    "That's some great practice! Let's keep going!",
    "Your problem-solving game is getting stronger!",
    "Three tries? Time to show what you've learned!",
    "Your code is getting better with each attempt!"
  ]
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
    if (cachedProblems && cachedProblems.length > 0) {
      setProblems(cachedProblems);
      setHasGeneratedProblems(true);
    }

    // Set theme and handle problems from location state
    if (location.state?.theme) {
      if (location.state.difficulty) {
        setCurrentLevel(location.state.difficulty); // Set as early as possible
      }
      setSelectedTheme(location.state.theme);
      
      // If we have problems in the location state, use them
      if (location.state.problems && location.state.problems.length > 0) {
        handleProblemsGenerated(location.state.problems);
      } else if (location.state.difficulty) {
        // If we have a difficulty but no problems, load them from the database
        setIsGeneratingProblems(true);
        try {
          const problems = getProblemsByMethod(location.state.theme.id, location.state.difficulty);
          if (!problems || problems.length === 0) {
            throw new Error(`No problems found for ${location.state.theme.id} at ${location.state.difficulty} difficulty`);
          }
          handleProblemsGenerated(problems);
        } catch (error) {
          console.error('Error loading problems:', error);
          setIsGeneratingProblems(false);
          alert('Sorry, there was an error loading the problems. Please try again.');
          navigate('/');
        }
      }
    }
  }, [location.state]);

  // Add useEffect to handle motivational animation
  useEffect(() => {
    if (mistakeCount >= 3) {
      setCoachMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
      setShowCoachMotivation(true);
      setCoachMotivationKey(prev => prev + 1); // Increment key to force remount
      setMistakeCount(0); // Reset after showing
      setTimeout(() => setShowCoachMotivation(false), 2000 + Math.random() * 2000); // 2-4s
    }
  }, [mistakeCount]);

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
      if (success) {
        setMistakeCount(0); // Reset on success
      } else {
        setMistakeCount(prev => prev + 1);
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
    
    // Update progress
    updateUserProgress({ currentLevel: nextLevel, currentProblemIndex: 0 });

    // Show coach message during loading
    setCoachMessage("Leveling up! Time to push your limits, recruit!");
    setShowCoachMotivation(true);
    setCoachMotivationKey(prev => prev + 1);

    // Try to get cached problems first
    const cachedProblems = getCachedProblems(nextLevel);
    if (cachedProblems && cachedProblems.length > 0) {
      // Simulate loading time to show coach animation
      setIsGeneratingProblems(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      handleProblemsGenerated(cachedProblems);
    } else {
      // If no cached problems, load them from the database
      setIsGeneratingProblems(true);
      try {
        if (selectedTheme) {
          // Simulate loading time to show coach animation
          await new Promise(resolve => setTimeout(resolve, 2000));
          const problems = getProblemsByMethod(selectedTheme.id, nextLevel);
          if (!problems || problems.length === 0) {
            throw new Error(`No problems found for ${selectedTheme.id} at ${nextLevel} difficulty`);
          }
          handleProblemsGenerated(problems);
        }
      } catch (error) {
        console.error('Error loading problems:', error);
        setIsGeneratingProblems(false);
        alert('Sorry, there was an error loading the problems. Please try again.');
        navigate('/');
      }
    }

    // Hide coach message after loading
    setTimeout(() => setShowCoachMotivation(false), 2000);
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
            </p>
          </div>
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

            {showCoachMotivation && <CoachMotivationAnimation key={coachMotivationKey} message={coachMessage} />}
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

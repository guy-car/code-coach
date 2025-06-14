import { ThemeSelection } from "@/components/code-practice/ThemeSelection"
import { Theme } from "@/services/themes"
import { useNavigate } from "react-router-dom"
import { theme } from "@/lib/theme"
import { useState } from "react"
import coachImage from '@/assets/coach-v1.png'
import { Button } from '@/components/ui/button'
import { CoachLoadingMessage } from "@/components/code-practice/CoachLoadingMessage"
import { cacheGeneratedProblems } from "@/services/storage"
import { getProblemsByMethod } from "@/services/problems"

export function Lobby() {
  const navigate = useNavigate()
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [showDifficulty, setShowDifficulty] = useState(false)
  const [isGeneratingProblems, setIsGeneratingProblems] = useState(false)

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme)
    setShowDifficulty(true)
  }

  const handleDifficultySelect = async (difficulty: 'easy' | 'medium' | 'hard') => {
    if (selectedTheme) {
      setIsGeneratingProblems(true)
      try {
        // Simulate loading time to show coach animation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get problems for all difficulty levels
        const easyProblems = getProblemsByMethod(selectedTheme.id, 'easy');
        const mediumProblems = getProblemsByMethod(selectedTheme.id, 'medium');
        const hardProblems = getProblemsByMethod(selectedTheme.id, 'hard');

        // Validate that we have problems for the selected difficulty
        const selectedProblems = difficulty === 'easy' ? easyProblems : 
                               difficulty === 'medium' ? mediumProblems : 
                               hardProblems;

        if (!selectedProblems || selectedProblems.length === 0) {
          throw new Error(`No problems found for ${selectedTheme.id} at ${difficulty} difficulty`);
        }

        // Cache all problems
        cacheGeneratedProblems('easy', easyProblems);
        cacheGeneratedProblems('medium', mediumProblems);
        cacheGeneratedProblems('hard', hardProblems);

        // Navigate with the selected difficulty's problems
        navigate('/practice', { 
          state: { 
            theme: selectedTheme, 
            difficulty,
            problems: selectedProblems
          } 
        });
      } catch (error) {
        console.error('Error loading problems:', error);
        setIsGeneratingProblems(false);
        // Don't navigate if we don't have problems
        alert('Sorry, there was an error loading the problems. Please try again.');
      }
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
        </header>

        {!showDifficulty && (
          <ThemeSelection onThemeSelect={handleThemeSelect} />
        )}

        {showDifficulty && selectedTheme && !isGeneratingProblems && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-8">
              <div className="relative w-48 h-48">
                <img 
                  src={coachImage} 
                  alt="Code Coach" 
                  className="w-full h-full object-contain transition-opacity duration-500 absolute inset-0 opacity-100"
                />
                <div className="absolute inset-0">
                  <div className="w-full h-full bg-[#00FF00] opacity-20 blur-xl animate-pulse" />
                </div>
              </div>
              <div className="text-2xl font-mono text-[#00FF00] transition-opacity duration-500 text-center max-w-2xl opacity-100">
                <span className="animate-pulse">
                  Coach: Which difficulty do you want to tackle?
                  <span className="ml-1 opacity-100">|</span>
                </span>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => handleDifficultySelect('easy')}
                  className="font-mono text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background.dark,
                    boxShadow: theme.animations.glow
                  }}
                >
                  EASY
                </Button>
                <Button
                  onClick={() => handleDifficultySelect('medium')}
                  className="font-mono text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.background.dark,
                    boxShadow: theme.animations.glow
                  }}
                >
                  MEDIUM
                </Button>
                <Button
                  onClick={() => handleDifficultySelect('hard')}
                  className="font-mono text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]"
                  style={{
                    backgroundColor: theme.colors.accent,
                    color: theme.colors.background.dark,
                    boxShadow: theme.animations.glow
                  }}
                >
                  HARD
                </Button>
              </div>
            </div>
          </div>
        )}

        <CoachLoadingMessage isLoading={isGeneratingProblems} />
      </div>
    </div>
  )
} 
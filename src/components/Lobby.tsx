import { ThemeSelection } from "@/components/code-practice/ThemeSelection"
import { Theme } from "@/services/themes"
import { useNavigate } from "react-router-dom"
import { theme } from "@/lib/theme"

export function Lobby() {
  const navigate = useNavigate()

  const handleThemeSelect = (selectedTheme: Theme) => {
    navigate('/practice', { state: { theme: selectedTheme } })
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

        <ThemeSelection onThemeSelect={handleThemeSelect} />
      </div>
    </div>
  )
} 
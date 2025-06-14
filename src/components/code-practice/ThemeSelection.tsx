import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Theme, themes } from "@/services/themes"
import { theme } from "@/lib/theme"

interface ThemeSelectionProps {
  onThemeSelect: (theme: Theme) => void;
}

export function ThemeSelection({ onThemeSelect }: ThemeSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2" style={{ 
          color: theme.colors.primary,
          fontFamily: theme.fonts.display,
          textShadow: theme.animations.glow
        }}>
          Choose Your Challenge
        </h2>
        <p className="text-muted-foreground" style={{ color: theme.colors.text.muted }}>
          Select a JavaScript topic to practice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((themeOption) => (
          <Card 
            key={themeOption.id}
            className="cursor-pointer transition-all duration-300 hover:shadow-lg"
            style={{ 
              backgroundColor: theme.colors.background.card,
              borderColor: theme.colors.border,
              borderWidth: '1px'
            }}
            onClick={() => onThemeSelect(themeOption)}
          >
            <CardHeader>
              <CardTitle className="font-mono" style={{ color: theme.colors.primary }}>
                {themeOption.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground" style={{ color: theme.colors.text.muted }}>
                {themeOption.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { theme } from "@/lib/theme"
import { useNavigate } from "react-router-dom"

interface CodeEditorProps {
  onRun: (code: string) => void;
  initialCode?: string;
  key?: number;
}

export function CodeEditor({ onRun, initialCode = "", key }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const navigate = useNavigate()

  const handleReset = () => {
    localStorage.clear();
    navigate('/');
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        onRun(code);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, onRun]);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-sm font-medium mb-2">Write Your Code:</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Write only the code that goes inside the function body. Do not include the function definition or curly braces.
          </p>
          <Textarea
            key={key}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono min-h-[200px] bg-background"
            placeholder="// Write your code here..."
          />
        </div>
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2 font-mono text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]"
            style={{
              backgroundColor: theme.colors.background.dark,
              color: theme.colors.accent,
              border: `1px solid ${theme.colors.accent}`,
              boxShadow: '0 0 10px rgba(255,0,0,0.3)'
            }}
          >
            I QUIT!
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: theme.colors.text.muted }}>
              {navigator.platform.includes('Mac') ? '⌘ + Enter' : 'Ctrl + Enter'}
            </span>
            <Button 
              onClick={() => onRun(code)}
              className="font-mono text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
              style={{
                backgroundColor: theme.colors.background.dark,
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}`,
                boxShadow: '0 0 10px rgba(0,255,0,0.3)'
              }}
            >
              RUN CODE
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
} 
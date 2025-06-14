import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface CodeEditorProps {
  onRun: (code: string) => void;
  initialCode?: string;
  key?: number;
}

export function CodeEditor({ onRun, initialCode = "", key }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  }

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
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </Button>
          <Button onClick={() => onRun(code)}>Run Code</Button>
        </div>
      </div>
    </Card>
  )
} 
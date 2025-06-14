import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

interface CodeEditorProps {
  onRun: (code: string) => void;
  initialCode?: string;
}

export function CodeEditor({ onRun, initialCode = "// Write your code here" }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono min-h-[200px]"
          placeholder="Write your code here..."
        />
        <div className="flex justify-end">
          <Button onClick={() => onRun(code)}>Run Code</Button>
        </div>
      </div>
    </Card>
  )
} 
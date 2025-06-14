import { useState } from "react"
import { CodeEditor } from "@/components/code-practice/CodeEditor"
import { ProblemDisplay } from "@/components/code-practice/ProblemDisplay"
import { Results } from "@/components/code-practice/Results"
import { Badge } from "@/components/ui/badge"

const sampleProblem = {
  title: "Array Destructuring Basics",
  description: "Extract the first and second elements from the array into variables named 'first' and 'second'.",
  setup: "const colors = ['red', 'green', 'blue'];\n// Your code here\nconsole.log(first); // Should output: 'red'\nconsole.log(second); // Should output: 'green'",
  difficulty: "easy" as const
}

function App() {
  const [results, setResults] = useState<{
    success: boolean;
    message: string;
    expectedOutput?: string;
    actualOutput?: string;
  } | null>(null)

  const handleRunCode = (code: string) => {
    try {
      // Create a safe evaluation environment with a fresh scope
      const safeEval = new Function(`
        const colors = ['red', 'green', 'blue'];
        ${code}
        return { first, second };
      `)

      const { first, second } = safeEval()
      
      // Validate the results
      const success = first === 'red' && second === 'green'
      setResults({
        success,
        message: success 
          ? "Great job! You correctly destructured the array."
          : "Not quite right. Make sure you're extracting 'red' and 'green'.",
        expectedOutput: "first: 'red', second: 'green'",
        actualOutput: `first: '${first}', second: '${second}'`
      })
    } catch (error) {
      setResults({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`,
        expectedOutput: "first: 'red', second: 'green'",
        actualOutput: "Error occurred"
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">JS Practice</h1>
            <p className="text-muted-foreground">Master JavaScript through repetition</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Problem 1 of 1</Badge>
            <Badge>{sampleProblem.difficulty}</Badge>
          </div>
        </header>

        <ProblemDisplay problem={sampleProblem} />
        <CodeEditor onRun={handleRunCode} initialCode="// Write your destructuring code here" />
        {results && <Results {...results} />}
      </div>
    </div>
  )
}

export default App

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProblemDisplayProps {
  problem: {
    title: string;
    description: string;
    setup: string;
    difficulty: "easy" | "medium" | "hard";
  };
}

export function ProblemDisplay({ problem }: ProblemDisplayProps) {
  // Split the setup code into given code and function skeleton
  const setupLines = problem.setup.split('\n')
  
  // Find the function definition line and the "Your code here" line
  const functionDefIndex = setupLines.findIndex(line => line.includes('function'))
  const yourCodeHereIndex = setupLines.findIndex(line => line.includes('// Your code here'))
  
  let givenCodeLines: string[] = []
  let functionSkeleton: string[] = []
  let exampleUsage: string[] = []
  
  if (functionDefIndex !== -1 && yourCodeHereIndex !== -1) {
    // Extract the function definition
    const functionDef = setupLines[functionDefIndex]
    const functionName = functionDef.match(/function\s+(\w+)/)?.[1]
    
    // Split the code into sections
    givenCodeLines = setupLines.slice(0, functionDefIndex)
    functionSkeleton = [
      functionDef,
      setupLines[yourCodeHereIndex],
      '}'
    ]
    exampleUsage = setupLines.slice(yourCodeHereIndex + 1)
  } else {
    // If no function definition found, treat all non-"Your code here" lines as given code
    givenCodeLines = setupLines.filter(line => !line.includes('// Your code here'))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{problem.title}</CardTitle>
          <Badge variant={
            problem.difficulty === "easy" ? "secondary" :
            problem.difficulty === "medium" ? "default" :
            "destructive"
          }>
            {problem.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">{problem.description}</p>
        
        <div className="space-y-4">
          {givenCodeLines.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Given Code:</h3>
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-sm">{givenCodeLines.join('\n')}</pre>
              </div>
            </div>
          )}

          {functionSkeleton.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Complete This Function:</h3>
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-sm">{functionSkeleton.join('\n')}</pre>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Write only the code that goes inside the function body, between the curly braces.
              </p>
            </div>
          )}

          {exampleUsage.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Example Usage:</h3>
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-sm">{exampleUsage.join('\n')}</pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 
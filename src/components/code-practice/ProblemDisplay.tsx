import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { theme } from "@/lib/theme"

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
    <Card className="border" style={{ 
      backgroundColor: theme.colors.background.card,
      borderColor: theme.colors.border
    }}>
      <CardHeader>
        <CardTitle className="font-mono" style={{ color: theme.colors.primary }}>
          {problem.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground font-mono" style={{ color: theme.colors.text.muted }}>
          {problem.description}
        </p>
        
        <div className="space-y-4">
          {givenCodeLines.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 font-mono" style={{ color: theme.colors.primary }}>
                Given Code:
              </h3>
              <div className="p-4 rounded-md font-mono text-sm" style={{ 
                backgroundColor: theme.colors.background.dark,
                color: theme.colors.text.secondary,
                border: `1px solid ${theme.colors.border}`
              }}>
                <pre className="whitespace-pre-wrap">{givenCodeLines.join('\n')}</pre>
              </div>
            </div>
          )}

          {functionSkeleton.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 font-mono" style={{ color: theme.colors.primary }}>
                Complete This Function:
              </h3>
              <div className="p-4 rounded-md font-mono text-sm" style={{ 
                backgroundColor: theme.colors.background.dark,
                color: theme.colors.text.secondary,
                border: `1px solid ${theme.colors.border}`
              }}>
                <pre className="whitespace-pre-wrap">{functionSkeleton.join('\n')}</pre>
              </div>
              <p className="text-sm mt-2 font-mono" style={{ color: theme.colors.text.muted }}>
                Write only the code that goes inside the function body, between the curly braces.
              </p>
            </div>
          )}

          {exampleUsage.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 font-mono" style={{ color: theme.colors.primary }}>
                Example Usage:
              </h3>
              <div className="p-4 rounded-md font-mono text-sm" style={{ 
                backgroundColor: theme.colors.background.dark,
                color: theme.colors.text.secondary,
                border: `1px solid ${theme.colors.border}`
              }}>
                <pre className="whitespace-pre-wrap">{exampleUsage.join('\n')}</pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 
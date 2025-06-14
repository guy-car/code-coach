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
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{problem.description}</p>
        <div className="bg-muted p-4 rounded-md">
          <pre className="text-sm">{problem.setup}</pre>
        </div>
      </CardContent>
    </Card>
  )
} 
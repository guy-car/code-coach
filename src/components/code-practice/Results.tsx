import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResultsProps {
  success: boolean;
  message: string;
  expectedOutput?: string;
  actualOutput?: string;
}

export function Results({ success, message, expectedOutput, actualOutput }: ResultsProps) {
  return (
    <Card className={`p-4 ${success ? 'border-green-500' : 'border-red-500'}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={success ? "default" : "destructive"}>
            {success ? "Success!" : "Try Again"}
          </Badge>
          <p className="text-sm">{message}</p>
        </div>

        {expectedOutput && actualOutput && (
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">Expected:</p>
              <p className="font-mono text-sm bg-muted p-2 rounded">{expectedOutput}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Your Output:</p>
              <p className="font-mono text-sm bg-muted p-2 rounded">{actualOutput}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
} 
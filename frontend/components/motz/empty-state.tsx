import { Card, CardContent } from "@/components/ui/card"
import { Database } from "lucide-react"

export function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-[300px]">
        <Database className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No data available</p>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { formatDate } from "@/lib/motz-formatters"
import type { Metadata } from "@/lib/motz-types"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  metadata?: Metadata
}

export function MetricCard({ title, value, icon: Icon, metadata }: MetricCardProps) {
  return (
    <Card className="metric-card group border-primary/20 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{title}</p>
            <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all">
              {value}
            </p>
          </div>
          {Icon && (
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
              <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
          )}
        </div>
        {metadata && (
          <CardDescription className="text-xs flex items-center gap-2 mt-4">
            <Clock className="h-3 w-3" />
            <span>{formatDate(metadata.last_updated)}</span>
            <Badge variant={metadata.is_fresh ? "secondary" : "outline"} className="text-xs badge-interactive">
              {metadata.is_fresh ? "🟢 Fresh" : "🔄 Cached"}
            </Badge>
          </CardDescription>
        )}
      </CardContent>
    </Card>
  )
}

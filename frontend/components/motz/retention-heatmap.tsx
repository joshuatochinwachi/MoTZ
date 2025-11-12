"use client"

import { useRetention } from "@/lib/motz-hooks"
import type { RetentionItem } from "@/lib/motz-types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorAlert } from "./error-alert"
import { EmptyState } from "./empty-state"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/motz-formatters"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

export function RetentionHeatmap() {
  const { data, metadata, error, isLoading } = useRetention()
  const [selectedAsset, setSelectedAsset] = useState<string>("all")

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (error) return <ErrorAlert message={error} />
  if (!data || data.length === 0) return <EmptyState />

  const assets = Array.from(new Set(data.map((item) => item["asset name"])))
  const filteredData = selectedAsset === "all" ? data : data.filter((item) => item["asset name"] === selectedAsset)

  const getRetentionColor = (value: number | null): string => {
    if (value === null) return "bg-muted"
    if (value >= 80) return "bg-purple-900/50"
    if (value >= 60) return "bg-purple-800/50"
    if (value >= 40) return "bg-purple-700/50"
    if (value >= 20) return "bg-purple-600/50"
    return "bg-purple-500/50"
  }

  const formatCohortWeek = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return format(date, "yyyy-MM-dd")
    } catch {
      return dateString
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <CardTitle>Retention Analysis</CardTitle>
            <CardDescription className="mt-2">
              This analyzes weekly user activation and retention across MoTZ sectors on the Ronin blockchain. It identifies when users first interact with a sector (activation), then tracks their engagement in subsequent weeks to measure interaction retention patterns. The results provide cohort-based insights into user growth, stickiness, and sector-level performance over time.
            </CardDescription>
            {metadata && (
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: {formatDate(metadata.last_updated)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {metadata && (
              <Badge variant={metadata.is_fresh ? "secondary" : "outline"}>
                {metadata.is_fresh ? "Fresh" : "Cached"}
              </Badge>
            )}
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {assets.map((asset) => (
                  <SelectItem key={asset} value={asset}>
                    {asset}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">cohort week</th>
                <th className="text-left p-2 font-medium">sector</th>
                <th className="text-right p-2 font-medium">new users</th>
                <th className="text-right p-2 font-medium text-xs">% retention 1 week later</th>
                <th className="text-right p-2 font-medium text-xs">% retention 2 weeks later</th>
                <th className="text-right p-2 font-medium text-xs">% retention 3 weeks later</th>
                <th className="text-right p-2 font-medium text-xs">% retention 4 weeks later</th>
                <th className="text-right p-2 font-medium text-xs">% retention 5 weeks later</th>
                <th className="text-right p-2 font-medium text-xs">% retention 6 weeks later</th>
                <th className="text-right p-2 font-medium text-xs">% retention 7 weeks later</th>
                <th className="text-right p-2 font-medium text-xs">% retention 8 weeks later</th>
                <th className="text-right p-2 font-medium text-xs">% retention 9 weeks later</th>
                <th className="text-right p-2 font-medium text-xs">% retention 10 weeks later</th>
                <th className="text-right p-2 font-medium text-xs">% retention 11 weeks later</th>
                <th className="text-right p-2 font-medium text-xs">% retention 12 weeks later</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium text-xs">{formatCohortWeek(item["cohort week"])}</td>
                  <td className="p-2 font-medium text-xs">{item["asset name"]}</td>
                  <td className="text-right p-2 font-medium">{item["new users"]}</td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 1 week later"])}`}>
                    {item["% retention 1 week later"] !== null ? `${item["% retention 1 week later"].toFixed(2)}%` : "-"}
                  </td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 2 weeks later"])}`}>
                    {item["% retention 2 weeks later"] !== null ? `${item["% retention 2 weeks later"].toFixed(2)}%` : "-"}
                  </td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 3 weeks later"])}`}>
                    {item["% retention 3 weeks later"] !== null ? `${item["% retention 3 weeks later"].toFixed(2)}%` : "-"}
                  </td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 4 weeks later"])}`}>
                    {item["% retention 4 weeks later"] !== null ? `${item["% retention 4 weeks later"].toFixed(2)}%` : "-"}
                  </td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 5 weeks later"])}`}>
                    {item["% retention 5 weeks later"] !== null ? `${item["% retention 5 weeks later"].toFixed(2)}%` : "-"}
                  </td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 6 weeks later"])}`}>
                    {item["% retention 6 weeks later"] !== null ? `${item["% retention 6 weeks later"].toFixed(2)}%` : "-"}
                  </td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 7 weeks later"])}`}>
                    {item["% retention 7 weeks later"] !== null ? `${item["% retention 7 weeks later"].toFixed(2)}%` : "-"}
                  </td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 8 weeks later"])}`}>
                    {item["% retention 8 weeks later"] !== null ? `${item["% retention 8 weeks later"].toFixed(2)}%` : "-"}
                  </td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 9 weeks later"])}`}>
                    {item["% retention 9 weeks later"] !== null ? `${item["% retention 9 weeks later"].toFixed(2)}%` : "-"}
                  </td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 10 weeks later"])}`}>
                    {item["% retention 10 weeks later"] !== null ? `${item["% retention 10 weeks later"].toFixed(2)}%` : "-"}
                  </td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 11 weeks later"])}`}>
                    {item["% retention 11 weeks later"] !== null ? `${item["% retention 11 weeks later"].toFixed(2)}%` : "-"}
                  </td>
                  <td className={`text-right p-2 text-xs font-medium ${getRetentionColor(item["% retention 12 weeks later"])}`}>
                    {item["% retention 12 weeks later"] !== null ? `${item["% retention 12 weeks later"].toFixed(2)}%` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

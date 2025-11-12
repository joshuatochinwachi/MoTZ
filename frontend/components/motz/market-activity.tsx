"use client"

import { useState, useMemo } from "react"
import { useSecondarySales, useUserActivity, useTransactions } from "@/lib/motz-hooks"
import { formatUSD, formatNumber } from "@/lib/motz-formatters"
import { ErrorAlert } from "./error-alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Simple date formatters
const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
const formatDateShort = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function MarketActivity() {
  const { data: salesData, metadata: salesMeta, isLoading: salesLoading, error: salesError } = useSecondarySales()
  const { data: activityData, metadata: activityMeta, isLoading: activityLoading, error: activityError } = useUserActivity()
  const { data: transactionsData, metadata: transMeta, isLoading: transactionsLoading, error: transactionsError } = useTransactions()

  const [salesPage, setSalesPage] = useState(0)
  const [activityPage, setActivityPage] = useState(0)
  const [transPage, setTransPage] = useState(0)
  const pageSize = 50

  // Process sales data for charts (descending order)
  const salesChartData = useMemo(() => {
    if (!salesData) return []
    return [...salesData]
      .sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime())
      .reverse()
      .map(item => ({
        date: formatDate(item.day),
        dateShort: formatDateShort(item.day),
        "sales volume (USD)": item["sales volume (USD)"],
        "cumulative sales volume (USD)": item["cumulative sales volume (USD)"],
        asset: item.asset
      }))
  }, [salesData])

  // Process activity data for charts
  const activityChartData = useMemo(() => {
    if (!activityData) return []
    return [...activityData]
      .sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime())
      .reverse()
      .map(item => ({
        date: formatDate(item.day),
        dateShort: formatDateShort(item.day),
        ...item
      }))
  }, [activityData])

  // Process transactions data for charts by sector
  const transactionsBySector = useMemo(() => {
    if (!transactionsData) return []
    
    // Group by date and sector
    const grouped = {}
    transactionsData.forEach(item => {
      const date = item.day
      if (!grouped[date]) {
        grouped[date] = {
          date: formatDate(date),
          dateShort: formatDateShort(date),
          day: date
        }
      }
      // Add sector-specific data
      const sectorKey = item.sector
      grouped[date][`${sectorKey}_daily`] = item["number of transactions/interactions"]
      grouped[date][`${sectorKey}_cumulative`] = item["cumulative transactions/interactions in each sector"]
    })
    
    return Object.values(grouped).sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())
  }, [transactionsData])

  // Group transactions by day for cumulative overall
  const transactionsCumulativeOverall = useMemo(() => {
    if (!transactionsData) return []
    const grouped = new Map()
    transactionsData.forEach(item => {
      const date = item.day
      if (!grouped.has(date) || grouped.get(date) < item["cumulative transactions/interactions in all 3 sectors"]) {
        grouped.set(date, item["cumulative transactions/interactions in all 3 sectors"])
      }
    })
    return Array.from(grouped, ([day, cumulative]) => ({
      date: formatDate(day),
      dateShort: formatDateShort(day),
      cumulative,
      day
    })).sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())
  }, [transactionsData])

  // Extract unique sectors from transactions data
  const uniqueSectors = useMemo(() => {
    if (!transactionsData) return []
    return [...new Set(transactionsData.map(item => item.sector))]
  }, [transactionsData])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2 text-white">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-300">{entry.name}:</span>
              <span className="font-semibold text-white">
                {typeof entry.value === 'number' && entry.name.includes('USD') 
                  ? formatUSD(entry.value) 
                  : formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gray-950 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Market Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="secondary-sales" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900">
            <TabsTrigger value="secondary-sales" className="data-[state=active]:bg-purple-600">Secondary Sales</TabsTrigger>
            <TabsTrigger value="user-activity" className="data-[state=active]:bg-purple-600">User Activity</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600">Transactions</TabsTrigger>
          </TabsList>

          {/* SECONDARY SALES TAB */}
          <TabsContent value="secondary-sales" className="mt-6 space-y-6">
            {salesLoading ? (
              <Skeleton className="h-96" />
            ) : salesError ? (
              <ErrorAlert message={salesError} />
            ) : salesData && salesData.length > 0 ? (
              <>
                {salesMeta && (
                  <Badge variant={salesMeta.is_fresh ? "secondary" : "outline"} className="bg-purple-600">
                    {salesMeta.is_fresh ? "Fresh Data" : "Cached"}
                  </Badge>
                )}

                {/* Sales Volume Chart */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Daily Sales Volume (USD)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={salesChartData}>
                        <defs>
                          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="dateShort" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="sales volume (USD)" 
                          stroke="#8b5cf6" 
                          fill="url(#salesGradient)"
                          strokeWidth={2}
                          name="Sales Volume (USD)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Cumulative Sales Volume Chart */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Cumulative Sales Volume (USD)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={salesChartData}>
                        <defs>
                          <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="dateShort" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="cumulative sales volume (USD)" 
                          stroke="#a855f7" 
                          fill="url(#cumulativeGradient)"
                          strokeWidth={2}
                          name="Cumulative Sales Volume (USD)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Sales Data Table */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Complete Sales Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Asset</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Sales Volume (USD)</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Cumulative Sales Volume (USD)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...salesData]
                            .sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime())
                            .slice(salesPage * pageSize, (salesPage + 1) * pageSize)
                            .map((row, idx) => (
                              <tr key={idx} className="border-b border-gray-700">
                                <td className="py-3 px-4 text-gray-300">{formatDate(row.day)}</td>
                                <td className="py-3 px-4 text-gray-300">{row.asset}</td>
                                <td className="py-3 px-4 text-gray-300">{formatUSD(row["sales volume (USD)"])}</td>
                                <td className="py-3 px-4 text-gray-300">{formatUSD(row["cumulative sales volume (USD)"])}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-400">
                        Showing {salesPage * pageSize + 1} to {Math.min((salesPage + 1) * pageSize, salesData.length)} of {salesData.length}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSalesPage(p => Math.max(0, p - 1))} disabled={salesPage === 0}>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSalesPage(p => p + 1)} disabled={(salesPage + 1) * pageSize >= salesData.length}>
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <p className="text-center text-gray-400 py-8">No data available</p>
            )}
          </TabsContent>

          {/* USER ACTIVITY TAB */}
          <TabsContent value="user-activity" className="mt-6 space-y-6">
            {activityLoading ? (
              <Skeleton className="h-96" />
            ) : activityError ? (
              <ErrorAlert message={activityError} />
            ) : activityData && activityData.length > 0 ? (
              <>
                {activityMeta && (
                  <Badge variant={activityMeta.is_fresh ? "secondary" : "outline"} className="bg-purple-600">
                    {activityMeta.is_fresh ? "Fresh Data" : "Cached"}
                  </Badge>
                )}

                {/* Chart 1: Users by Sector */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Daily Active Users by Sector</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={activityChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="dateShort" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="users interacting with Mark of The Zeal Founders Coin" fill="#a855f7" name="MZC Users" />
                        <Bar dataKey="users interacting with MOTZ Keys" fill="#8b5cf6" name="KEYS Users" />
                        <Bar dataKey="users interacting with MOTZ Gotcha Machine" fill="#7c3aed" name="Gotcha Users" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Chart 2: Multi-Sector Engagement */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Multi-Sector User Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={activityChartData}>
                        <defs>
                          <linearGradient id="sector1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="sector2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="sector3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="dateShort" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area type="monotone" dataKey="users actively interacting with 1 sector alone" stroke="#a855f7" fill="url(#sector1)" name="1 Sector Only" />
                        <Area type="monotone" dataKey="users actively interacting with 2 sectors alone" stroke="#8b5cf6" fill="url(#sector2)" name="2 Sectors" />
                        <Area type="monotone" dataKey="users actively interacting with ALL of the 3 sectors (MoTZ KEYS, MoTZ Founders Coin and MoTZ Gotcha Machine)" stroke="#7c3aed" fill="url(#sector3)" name="All 3 Sectors" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Chart 3: Total Active Users */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Total Active Users (All Sectors)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={activityChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="dateShort" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="total active users interacting with ANY of the 3 sectors (MOTZ Keys, MOTZ Founders Coin, or MOTZ Gotcha Machine)" 
                          stroke="#a855f7" 
                          strokeWidth={3}
                          dot={{ fill: '#a855f7', r: 4 }}
                          name="Total Active Users"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Activity Data Table */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Complete Activity Data</CardTitle>
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3 text-sm">
                      <p className="text-purple-400 font-semibold">Understanding User Activity Metrics:</p>
                      <div className="space-y-2 text-gray-300">
                        <p><span className="font-semibold text-white">MZC Users:</span> Number of unique users who interacted with Mark of The Zeal Founders Coin on this day (buying, selling, or transferring the coin).</p>
                        <p><span className="font-semibold text-white">KEYS Users:</span> Number of unique users who interacted with MOTZ Keys on this day (buying, selling, or transferring keys).</p>
                        <p><span className="font-semibold text-white">Gotcha Users:</span> Number of unique users who interacted with MOTZ Gotcha Machine on this day (playing or engaging with the gotcha mechanism).</p>
                        <p><span className="font-semibold text-white">1 Sector:</span> Users who were active in only ONE of the three sectors on this day. These users engaged exclusively with either MZC, Keys, or Gotcha Machine, but not multiple sectors.</p>
                        <p><span className="font-semibold text-white">2 Sectors:</span> Users who were active in exactly TWO of the three sectors on this day. These users engaged with two different products but not all three.</p>
                        <p><span className="font-semibold text-white">All 3:</span> Users who were active across ALL THREE sectors on this day. These are highly engaged users who interacted with MZC, Keys, AND Gotcha Machine in the same day.</p>
                        <p><span className="font-semibold text-white">Total Active:</span> The total number of unique users who interacted with ANY of the three sectors on this day. This represents the overall daily active user count across the entire ecosystem.</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">MZC Users</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">KEYS Users</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Gotcha Users</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">1 Sector</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">2 Sectors</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">All 3</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Total Active</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...activityData]
                            .sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime())
                            .slice(activityPage * pageSize, (activityPage + 1) * pageSize)
                            .map((row, idx) => (
                              <tr key={idx} className="border-b border-gray-700">
                                <td className="py-3 px-4 text-gray-300">{formatDate(row.day)}</td>
                                <td className="py-3 px-4 text-gray-300">{formatNumber(row["users interacting with Mark of The Zeal Founders Coin"])}</td>
                                <td className="py-3 px-4 text-gray-300">{formatNumber(row["users interacting with MOTZ Keys"])}</td>
                                <td className="py-3 px-4 text-gray-300">{formatNumber(row["users interacting with MOTZ Gotcha Machine"])}</td>
                                <td className="py-3 px-4 text-gray-300">{formatNumber(row["users actively interacting with 1 sector alone"])}</td>
                                <td className="py-3 px-4 text-gray-300">{formatNumber(row["users actively interacting with 2 sectors alone"])}</td>
                                <td className="py-3 px-4 text-gray-300">{formatNumber(row["users actively interacting with ALL of the 3 sectors (MoTZ KEYS, MoTZ Founders Coin and MoTZ Gotcha Machine)"])}</td>
                                <td className="py-3 px-4 text-gray-300">{formatNumber(row["total active users interacting with ANY of the 3 sectors (MOTZ Keys, MOTZ Founders Coin, or MOTZ Gotcha Machine)"])}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-400">
                        Showing {activityPage * pageSize + 1} to {Math.min((activityPage + 1) * pageSize, activityData.length)} of {activityData.length}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setActivityPage(p => Math.max(0, p - 1))} disabled={activityPage === 0}>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setActivityPage(p => p + 1)} disabled={(activityPage + 1) * pageSize >= activityData.length}>
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <p className="text-center text-gray-400 py-8">No data available</p>
            )}
          </TabsContent>

          {/* TRANSACTIONS TAB */}
          <TabsContent value="transactions" className="mt-6 space-y-6">
            {transactionsLoading ? (
              <Skeleton className="h-96" />
            ) : transactionsError ? (
              <ErrorAlert message={transactionsError} />
            ) : transactionsData && transactionsData.length > 0 ? (
              <>
                {transMeta && (
                  <Badge variant={transMeta.is_fresh ? "secondary" : "outline"} className="bg-purple-600">
                    {transMeta.is_fresh ? "Fresh Data" : "Cached"}
                  </Badge>
                )}

                {/* Chart 1: Daily Transactions by Sector */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Daily Transactions by Sector</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={transactionsBySector}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="dateShort" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {uniqueSectors.map((sector, idx) => {
                          const colors = ["#a855f7", "#8b5cf6", "#7c3aed"]
                          return (
                            <Bar 
                              key={sector}
                              dataKey={`${sector}_daily`} 
                              fill={colors[idx % colors.length]} 
                              name={sector}
                            />
                          )
                        })}
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Chart 2: Cumulative by Sector */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Cumulative Transactions by Sector</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={transactionsBySector}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="dateShort" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {uniqueSectors.map((sector, idx) => {
                          const colors = ["#a855f7", "#8b5cf6", "#7c3aed"]
                          return (
                            <Line 
                              key={sector}
                              type="monotone" 
                              dataKey={`${sector}_cumulative`} 
                              stroke={colors[idx % colors.length]} 
                              strokeWidth={2}
                              dot={false}
                              name={sector}
                            />
                          )
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Chart 3: Overall Cumulative */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Overall Cumulative Transactions (All Sectors)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={transactionsCumulativeOverall}>
                        <defs>
                          <linearGradient id="cumulativeGradientTrans" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="dateShort" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="cumulative" 
                          stroke="#8b5cf6" 
                          fill="url(#cumulativeGradientTrans)"
                          strokeWidth={3}
                          name="Cumulative (All Sectors)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Transactions Data Table */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Complete Transactions Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Sector</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Daily Transactions</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Cumulative (Sector)</th>
                            <th className="text-left py-3 px-4 text-gray-300 font-medium">Cumulative (Overall)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...transactionsData]
                            .sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime())
                            .slice(transPage * pageSize, (transPage + 1) * pageSize)
                            .map((row, idx) => (
                              <tr key={idx} className="border-b border-gray-700">
                                <td className="py-3 px-4 text-gray-300">{formatDate(row.day)}</td>
                                <td className="py-3 px-4 text-gray-300">{row.sector}</td>
                                <td className="py-3 px-4 text-gray-300">{formatNumber(row["number of transactions/interactions"])}</td>
                                <td className="py-3 px-4 text-gray-300">{formatNumber(row["cumulative transactions/interactions in each sector"])}</td>
                                <td className="py-3 px-4 text-gray-300">{formatNumber(row["cumulative transactions/interactions in all 3 sectors"])}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-400">
                        Showing {transPage * pageSize + 1} to {Math.min((transPage + 1) * pageSize, transactionsData.length)} of {transactionsData.length}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setTransPage(p => Math.max(0, p - 1))} disabled={transPage === 0}>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setTransPage(p => p + 1)} disabled={(transPage + 1) * pageSize >= transactionsData.length}>
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <p className="text-center text-gray-400 py-8">No data available</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

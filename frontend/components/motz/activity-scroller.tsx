"use client"

import { useMemo } from "react"
import { useNewMZC, useExitMZC, useNewKeys, useExitKeys } from "@/lib/motz-hooks"
import { formatWallet } from "@/lib/motz-formatters"

interface Activity {
  type: "buy" | "sell"
  asset: "MZC" | "KEYS"
  wallet: string
  amount: number
  date: string
}

export function ActivityScroller() {
  const { data: newMZC } = useNewMZC()
  const { data: exitMZC } = useExitMZC()
  const { data: newKeys } = useNewKeys()
  const { data: exitKeys } = useExitKeys()

  const activities = useMemo(() => {
    const items: Activity[] = []

    newMZC?.forEach((item) => {
      items.push({
        type: "buy",
        asset: "MZC",
        wallet: item.address,
        amount: item["MZC holdings"],
        date: item["first holding timestamp"],
      })
    })

    exitMZC?.forEach((item) => {
      items.push({
        type: "sell",
        asset: "MZC",
        wallet: item.address,
        amount: item["MZC holdings before"],
        date: item["last sell/transfer timestamp"],
      })
    })

    newKeys?.forEach((item) => {
      items.push({
        type: "buy",
        asset: "KEYS",
        wallet: item.address,
        amount: item["MOTZ Keys holdings"],
        date: item["first holding timestamp"],
      })
    })

    exitKeys?.forEach((item) => {
      items.push({
        type: "sell",
        asset: "KEYS",
        wallet: item.address,
        amount: item["MOTZ Keys holdings before"],
        date: item["last sell/transfer timestamp"],
      })
    })

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [newMZC, exitMZC, newKeys, exitKeys])

  // Duplicate for seamless loop
  const displayItems = [...activities, ...activities]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t overflow-hidden shadow-2xl">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="animate-marquee flex gap-8 py-3 whitespace-nowrap">
        {displayItems.map((activity, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-lg">{activity.type === "buy" ? "🟢" : "🔴"}</span>
            <span className="font-semibold text-sm">{activity.type === "buy" ? "New" : "Exit"}:</span>
            <a
              href={`https://app.roninchain.com/address/${activity.wallet}?t=collectibles`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-primary hover:underline"
            >
              {formatWallet(activity.wallet)}
            </a>
            <span className="text-muted-foreground text-xs">
              {activity.type === "buy" ? "acquired" : "sold"} {activity.amount} {activity.asset}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

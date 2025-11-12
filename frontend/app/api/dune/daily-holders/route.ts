import { NextResponse } from "next/server"

const API_BASE = "https://web-production-6162.up.railway.app"

export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/api/raw/dune/daily_holders`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

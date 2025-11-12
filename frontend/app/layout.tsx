import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MoTZ Ecosystem Tracker - Analytics Dashboard",
  description: "Real-time analytics dashboard for Mark of The Zeal ecosystem on Ronin blockchain",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            [class*="watermark"],
            [class*="v0-watermark"],
            [data-v0-watermark],
            a[href*="v0.dev"],
            div[class*="BuiltWith"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
          `
        }} />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const removeBadge = () => {
                const selectors = [
                  'a[href*="v0.dev"]',
                  '[class*="watermark"]',
                  '[class*="v0"]',
                  '[data-v0-watermark]'
                ];
                selectors.forEach(selector => {
                  document.querySelectorAll(selector).forEach(el => {
                    el.remove();
                  });
                });
              };
              removeBadge();
              setInterval(removeBadge, 1000);
            })();
          `
        }} />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Photo Spot Scout',
  description: 'Scout and save photography locations',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

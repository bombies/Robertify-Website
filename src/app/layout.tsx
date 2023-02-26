import './globals.scss'

export const metadata = {
  title: 'Robertify',
  description: 'A next-gen music bot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

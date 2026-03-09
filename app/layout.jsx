export const metadata = {
  title: 'AMV Golf — Metal Products Made for the Fairway',
  description: 'Premium CNC-precision metal signage and course accessories engineered for golf clubs that demand excellence.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Playfair+Display:ital,wght@1,400;1,700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, background: '#0A0F0A' }}>{children}</body>
    </html>
  )
}

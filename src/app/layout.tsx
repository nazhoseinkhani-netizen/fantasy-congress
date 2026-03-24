import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { RootLayout } from '@/components/layout/root-layout'
import { DevModeProvider } from '@/components/dev-mode/dev-mode-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Fantasy Congress',
  description: 'Draft politicians. Score their trades. Win your league.',
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <DevModeProvider>
            <RootLayout>{children}</RootLayout>
          </DevModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

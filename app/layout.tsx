import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ChatWidget } from "@/components/ai-assistant/chat-widget"
import { LanguageProvider } from "@/lib/contexts/language-context"
import { ThemeProvider } from "@/lib/contexts/theme-context"
import { prisma } from "@/lib/db"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Bilim Bridge - Find Your Dream University",
  description: "Platform for international students to find and apply to universities worldwide. AI-powered recommendations, fit scores, and comprehensive university database.",
  keywords: ["university", "college", "international students", "admissions", "scholarships", "study abroad"],
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch site settings
  const siteConfig = await prisma.siteConfig.findFirst()
  const siteName = siteConfig?.siteName || "Bilim Bridge"
  const supportEmail = siteConfig?.supportEmail || "info@bilimbridge.com"
  const phoneNumber = siteConfig?.phoneNumber || "+996 XXX XXX XXX"
  const address = siteConfig?.address || "Bishkek, Kyrgyzstan"

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme')
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar siteName={siteName} />
              <main className="flex-1">{children}</main>
              <Footer
                siteName={siteName}
                supportEmail={supportEmail}
                phoneNumber={phoneNumber}
                address={address}
              />
              <ChatWidget />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

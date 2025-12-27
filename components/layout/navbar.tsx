"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, GraduationCap, Moon, Sun, Globe, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/contexts/language-context"
import { useTheme } from "@/lib/contexts/theme-context"


interface NavbarProps {
  siteName?: string
}

export function Navbar({ siteName = "Bilim Bridge" }: NavbarProps) {

  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-primary p-2 rounded-lg group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-bold">
              {siteName === "Bilim Bridge" ? (
                <>
                  <span className="text-gradient-primary">Bilim</span>
                  <span> Bridge</span>
                </>
              ) : (
                <span className="text-gradient-primary">{siteName}</span>
              )}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/universities" className="text-sm font-medium hover:text-primary transition-colors">
              {t.nav.universities}
            </Link>
            <Link href="/programs" className="text-sm font-medium hover:text-primary transition-colors">
              {t.nav.programs}
            </Link>
            <Link href="/success-stories" className="text-sm font-medium hover:text-primary transition-colors">
              {t.nav.successStories}
            </Link>
            <Link href="/guides" className="text-sm font-medium hover:text-primary transition-colors">
              {t.nav.guides}
            </Link>
          </div>

          {/* Right Side - Theme, Language, Auth */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* Language Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
                title={language === 'en' ? 'Переключить на Русский' : 'Switch to English'}
              >
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-bold">
                    {language === 'en' ? 'RU' : 'EN'}
                  </span>
                </div>
              </Button>
            )}

            {/* Auth Button */}
            <Link href="/auth">
              <Button className="bg-gradient-primary hover:opacity-90 text-white border-0 rounded-full px-6">
                <UserCircle className="h-4 w-4 mr-2" />
                {t.nav.join}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/universities"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.nav.universities}
            </Link>
            <Link
              href="/programs"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.nav.programs}
            </Link>
            <Link
              href="/success-stories"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.nav.successStories}
            </Link>
            <Link
              href="/guides"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.nav.guides}
            </Link>

            {/* Mobile Theme & Language */}
            {mounted && (
              <div className="flex items-center space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="flex-1"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Dark' : 'Темная'}
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Light' : 'Светлая'}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
                  className="flex-1"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {language === 'en' ? '🇷🇺 RU' : '🇬🇧 EN'}
                </Button>
              </div>
            )}

            <div className="pt-4">
              <Link href="/auth" className="block" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-primary hover:opacity-90 text-white border-0 rounded-full">
                  <UserCircle className="h-4 w-4 mr-2" />
                  {t.nav.join}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

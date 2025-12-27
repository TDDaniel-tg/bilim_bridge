"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  Award,
  TrendingUp,
  Calendar,
  Settings,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/contexts/language-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useLanguage()

  // TODO: Check if user is admin
  // const session = await getServerSession()
  // if (session?.user?.role !== 'ADMIN') redirect('/')

  const navItems = [
    { href: "/admin", label: t.admin.nav.dashboard, icon: LayoutDashboard },
    { href: "/admin/universities", label: t.admin.nav.universities, icon: GraduationCap },
    { href: "/admin/users", label: t.admin.nav.users, icon: Users },
    { href: "/admin/programs", label: t.admin.nav.programs, icon: Award },
    { href: "/admin/guides", label: t.admin.nav.guides, icon: FileText },
    { href: "/admin/success-stories", label: t.admin.nav.successStories, icon: TrendingUp },
    { href: "/admin/consultations", label: t.admin.nav.consultations, icon: Calendar },
    { href: "/admin/settings", label: t.admin.nav.settings, icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background">
        <div className="p-6 space-y-6">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.admin.backToSite}
              </Button>
            </Link>
            <h2 className="text-lg font-semibold">Bilim Bridge</h2>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}


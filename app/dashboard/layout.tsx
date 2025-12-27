import { redirect } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  User, 
  Heart, 
  CheckSquare, 
  MessageSquare, 
  Settings,
  Calendar
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Check authentication
  // const session = await getServerSession()
  // if (!session) redirect('/login')

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/checklists", label: "Checklists", icon: CheckSquare },
    { href: "/dashboard/consultations", label: "Consultations", icon: Calendar },
    { href: "/dashboard/chat-history", label: "Chat History", icon: MessageSquare },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 border-r bg-muted/50">
        <div className="sticky top-16 p-6 space-y-2">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Student Dashboard</h2>
            <p className="text-sm text-muted-foreground">Manage your applications</p>
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
      <main className="flex-1 bg-background">
        {children}
      </main>
    </div>
  )
}


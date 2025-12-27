"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/contexts/language-context"

export default function AdminUsersPage() {
  const { t } = useLanguage()

  // Mock data - в реальности из API
  // Using fixed dates to avoid hydration mismatch
  const users = [
    { id: '1', email: 'student@example.com', role: 'STUDENT', createdAt: '2023-11-15' },
    { id: '2', email: 'consultant@bilimbridge.com', role: 'CONSULTANT', createdAt: '2023-10-20' },
    { id: '3', email: 'admin@bilimbridge.com', role: 'ADMIN', createdAt: '2023-09-01' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.admin.users.title}</h1>
        <p className="text-muted-foreground">
          {users.length} {t.admin.dashboard.stats.totalUsers.toLowerCase()}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">{t.admin.users.role}</th>
                  <th className="text-left p-4 font-medium">{t.admin.users.status}</th>
                  <th className="text-right p-4 font-medium">{t.admin.users.actions}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <Badge variant={
                        user.role === 'ADMIN' ? 'default' :
                          user.role === 'CONSULTANT' ? 'secondary' :
                            'outline'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-sm text-primary hover:underline">
                        {t.admin.universities.edit}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


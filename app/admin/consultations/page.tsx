"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate } from "@/lib/utils"

export default function AdminConsultationsPage() {
  const { t } = useLanguage()
  const [consultations, setConsultations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    try {
      const res = await fetch('/api/consultations')
      const data = await res.json()
      setConsultations(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setConsultations(consultations.map(c => c.id === id ? { ...c, status } : c))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.admin.nav.consultations}</h1>
        <p className="text-muted-foreground">
          {t.admin.dashboard.subtitle}
        </p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : consultations.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Consultations</h3>
            <p className="text-muted-foreground">
              New consultation requests will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Topic</th>
                  <th className="text-left p-4">Format</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="font-medium">
                        {c.user.profile?.firstName} {c.user.profile?.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">{c.user.email}</div>
                    </td>
                    <td className="p-4">{c.topic}</td>
                    <td className="p-4">{c.preferredFormat}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="p-4">
                      <Select
                        value={c.status}
                        onValueChange={(val) => handleStatusChange(c.id, val)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="DECLINED">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

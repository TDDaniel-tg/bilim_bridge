"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

export default function AdminSettingsPage() {
    const { t } = useLanguage()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        siteName: '',
        supportEmail: '',
        phoneNumber: '',
        address: ''
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings')
            if (res.ok) {
                const data = await res.json()
                setSettings({
                    siteName: data.siteName || '',
                    supportEmail: data.supportEmail || '',
                    phoneNumber: data.phoneNumber || '',
                    address: data.address || ''
                })
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })
            if (res.ok) {
                alert('Settings saved successfully')
            } else {
                alert('Failed to save settings')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            alert('An error occurred')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="p-8">Loading settings...</div>
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{t.admin.nav.settings}</h1>
                <p className="text-muted-foreground">
                    {t.admin.dashboard.subtitle}
                </p>
            </div>

            <div className="grid gap-6">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input
                                    type="text"
                                    id="siteName"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                                    placeholder="Bilim Bridge"
                                />
                            </div>

                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="supportEmail">Support Email</Label>
                                <Input
                                    type="email"
                                    id="supportEmail"
                                    value={settings.supportEmail}
                                    onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                                    placeholder="support@bilimbridge.com"
                                />
                            </div>

                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    type="text"
                                    id="phoneNumber"
                                    value={settings.phoneNumber}
                                    onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                    placeholder="+996 XXX XXX XXX"
                                />
                            </div>

                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    type="text"
                                    id="address"
                                    value={settings.address}
                                    onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                                    placeholder="Bishkek, Kyrgyzstan"
                                />
                            </div>

                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    )
}

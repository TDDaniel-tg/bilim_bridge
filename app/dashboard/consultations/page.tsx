"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, Video, MapPin } from "lucide-react"

export default function ConsultationsPage() {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      topic: formData.get('topic'),
      message: formData.get('message'),
      preferredFormat: formData.get('format'),
      preferredDate: formData.get('date'),
    }

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert('Consultation request sent successfully!')
        setShowForm(false)
        e.currentTarget.reset()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to send request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Consultations</h1>
        <p className="text-muted-foreground">
          Book a consultation with our expert advisors
        </p>
      </div>

      {!showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Consultation Types */}
          <Card>
            <CardHeader>
              <CardTitle>📚 Application Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Get personalized guidance on university selection, application timeline, and strategy.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>University shortlisting based on your profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Application timeline and deadlines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Reach/Target/Safety school strategy</span>
                </li>
              </ul>
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-2">Duration: 60 minutes</p>
                <p className="text-sm text-muted-foreground">Available: In-office or Online</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>✍️ Essay Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Professional review and feedback on your college essays and personal statements.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Common App essay review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Supplemental essays feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Structure and content improvements</span>
                </li>
              </ul>
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-2">Duration: 45 minutes</p>
                <p className="text-sm text-muted-foreground">Available: Online</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎓 Test Preparation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Strategies and tips for SAT, ACT, IELTS, and TOEFL preparation.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Study plan development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Test-taking strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Score improvement tips</span>
                </li>
              </ul>
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-2">Duration: 60 minutes</p>
                <p className="text-sm text-muted-foreground">Available: In-office or Online</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💰 Financial Aid & Scholarships</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Navigate financial aid applications and scholarship opportunities.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>CSS Profile guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Scholarship search strategy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Need-based vs merit-based aid</span>
                </li>
              </ul>
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-2">Duration: 45 minutes</p>
                <p className="text-sm text-muted-foreground">Available: In-office or Online</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Book Consultation Button/Form */}
      {!showForm ? (
        <Card>
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Book a consultation with our expert advisors
            </p>
            <Button size="lg" onClick={() => setShowForm(true)}>
              <Calendar className="mr-2 h-5 w-5" />
              Book Consultation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Book a Consultation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic / Service *</Label>
                <select
                  id="topic"
                  name="topic"
                  required
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="">Select a topic...</option>
                  <option value="application-strategy">Application Strategy</option>
                  <option value="essay-review">Essay Review</option>
                  <option value="test-prep">Test Preparation</option>
                  <option value="financial-aid">Financial Aid & Scholarships</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Preferred Format *</Label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2 p-4 border rounded-md cursor-pointer hover:bg-accent">
                    <input type="radio" name="format" value="office" required />
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>In Office</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 p-4 border rounded-md cursor-pointer hover:bg-accent">
                    <input type="radio" name="format" value="online" required />
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span>Online</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date & Time</Label>
                <Input
                  type="datetime-local"
                  id="date"
                  name="date"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-sm text-muted-foreground">
                  Our consultant will contact you to confirm the exact time
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Details *</Label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about what you'd like to discuss, any specific universities you're interested in, or questions you have..."
                  className="w-full p-3 border rounded-md bg-background"
                  minLength={20}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Our consultant will contact you within 24 hours to confirm your appointment
              </p>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Office Location</p>
              <p className="text-sm text-muted-foreground">Bishkek, Kyrgyzstan</p>
              <p className="text-sm text-muted-foreground">Address: [Your office address]</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">info@bilimbridge.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Working Hours</p>
              <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-sm text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


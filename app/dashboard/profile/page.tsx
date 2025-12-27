"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, GraduationCap, Award, DollarSign } from "lucide-react"

export default function ProfilePage() {
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: Save to API
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-muted-foreground">
          Fill out your profile to get personalized university recommendations
        </p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="Kyrgyzstan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Bishkek" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" type="tel" placeholder="+996 XXX XXX XXX" />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Data */}
        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA (4.0 scale)</Label>
                  <Input 
                    id="gpa" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="4.0" 
                    placeholder="3.8" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="satTotal">SAT Total</Label>
                    <Input 
                      id="satTotal" 
                      type="number" 
                      min="400" 
                      max="1600" 
                      placeholder="1450" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="satMath">SAT Math</Label>
                    <Input 
                      id="satMath" 
                      type="number" 
                      min="200" 
                      max="800" 
                      placeholder="750" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="satEBRW">SAT EBRW</Label>
                    <Input 
                      id="satEBRW" 
                      type="number" 
                      min="200" 
                      max="800" 
                      placeholder="700" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actScore">ACT Score</Label>
                    <Input 
                      id="actScore" 
                      type="number" 
                      min="1" 
                      max="36" 
                      placeholder="32" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ielts">IELTS</Label>
                    <Input 
                      id="ielts" 
                      type="number" 
                      step="0.5" 
                      min="0" 
                      max="9" 
                      placeholder="7.5" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="toefl">TOEFL</Label>
                    <Input 
                      id="toefl" 
                      type="number" 
                      min="0" 
                      max="120" 
                      placeholder="105" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                  <Input 
                    id="graduationYear" 
                    type="number" 
                    min="2025" 
                    max="2030" 
                    placeholder="2025" 
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extracurricular Activities */}
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Extracurricular Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Add your extracurricular activities, achievements, and leadership positions
                  </p>
                  <Button>Add Activity</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Suggested Categories:</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Clubs and Organizations</li>
                    <li>Sports and Athletics</li>
                    <li>Community Service & Volunteering</li>
                    <li>Leadership Positions</li>
                    <li>Academic Competitions</li>
                    <li>Arts & Music</li>
                    <li>Work Experience</li>
                    <li>Awards & Honors</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Information */}
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="maxBudget">
                    Maximum Annual Budget (USD)
                  </Label>
                  <Input 
                    id="maxBudget" 
                    type="number" 
                    min="0" 
                    placeholder="30000" 
                  />
                  <p className="text-sm text-muted-foreground">
                    How much can you afford per year including tuition, room & board?
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Financial Aid Needed?</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="needFinancialAid"
                      className="rounded"
                    />
                    <label htmlFor="needFinancialAid" className="text-sm">
                      I need financial aid or scholarships
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Scholarship Types Interested In:</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="merit" className="rounded" />
                      <label htmlFor="merit" className="text-sm">
                        Merit-based scholarships
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="need" className="rounded" />
                      <label htmlFor="need" className="text-sm">
                        Need-based financial aid
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="fullride" className="rounded" />
                      <label htmlFor="fullride" className="text-sm">
                        Full-ride scholarships
                      </label>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


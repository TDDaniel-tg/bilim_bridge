import Link from "next/link"
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react"


interface FooterProps {
  siteName?: string
  supportEmail?: string
  phoneNumber?: string
  address?: string
}

export function Footer({
  siteName = "Bilim Bridge",
  supportEmail = "info@bilimbridge.com",
  phoneNumber = "+996 XXX XXX XXX",
  address = "Bishkek, Kyrgyzstan"
}: FooterProps) {

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>

              <span className="text-lg font-bold">
                {siteName === "Bilim Bridge" ? (
                  <>
                    <span className="text-gradient-primary">Bilim</span> Bridge
                  </>
                ) : (
                  <span className="text-gradient-primary">{siteName}</span>
                )}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your bridge to world-class education. Helping international students find and apply to universities worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/universities" className="text-sm text-muted-foreground hover:text-primary">
                  Search Universities
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-sm text-muted-foreground hover:text-primary">
                  Summer Programs
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-sm text-muted-foreground hover:text-primary">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-muted-foreground hover:text-primary">
                  Application Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guides/common-app" className="text-sm text-muted-foreground hover:text-primary">
                  How to Apply
                </Link>
              </li>
              <li>
                <Link href="/guides/scholarships" className="text-sm text-muted-foreground hover:text-primary">
                  Scholarships
                </Link>
              </li>
              <li>
                <Link href="/guides/essays" className="text-sm text-muted-foreground hover:text-primary">
                  Essay Writing
                </Link>
              </li>
              <li>
                <Link href="/dashboard/consultations" className="text-sm text-muted-foreground hover:text-primary">
                  Book Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />

                <a href={`mailto:${supportEmail}`} className="text-sm text-muted-foreground hover:text-primary">
                  {supportEmail}
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {phoneNumber}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {address}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 Bilim Bridge. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


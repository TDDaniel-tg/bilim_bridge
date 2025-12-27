"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/contexts/language-context"
import { Facebook, Mail, Linkedin, ArrowRight, ArrowLeft } from "lucide-react"

export function SlidingAuthForm() {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false)
    const { t } = useLanguage()

    return (
        <div className={`relative bg-card rounded-[25px] shadow-2xl overflow-hidden w-[768px] max-w-full min-h-[500px] transition-all duration-600 ${isRightPanelActive ? "right-panel-active" : ""}`}>

            {/* Sign Up Container */}
            <div className={`absolute top-0 h-full transition-all duration-600 left-0 w-1/2 opacity-0 z-10 ${isRightPanelActive ? "translate-x-full opacity-100 z-50 animate-show" : ""}`}>
                <form className="bg-background flex flex-col items-center justify-center h-full px-12 text-center" onSubmit={(e) => e.preventDefault()}>
                    <h1 className="font-bold text-3xl mb-4 text-gradient-primary">{t.auth.signUp.title}</h1>
                    <div className="flex gap-4 my-4">
                        <Button variant="outline" size="icon" className="rounded-full border-muted-foreground/20 hover:border-primary hover:text-primary transition-colors">
                            <Facebook className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border-muted-foreground/20 hover:border-primary hover:text-primary transition-colors">
                            <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border-muted-foreground/20 hover:border-primary hover:text-primary transition-colors">
                            <Linkedin className="h-4 w-4" />
                        </Button>
                    </div>
                    <span className="text-muted-foreground text-sm mb-4">{t.auth.signUp.or}</span>
                    <Input type="text" placeholder={t.auth.signUp.name} className="bg-muted/30 border-none mb-2" />
                    <Input type="email" placeholder={t.auth.signUp.email} className="bg-muted/30 border-none mb-2" />
                    <Input type="password" placeholder={t.auth.signUp.password} className="bg-muted/30 border-none mb-4" />
                    <Button className="rounded-full px-12 py-3 font-bold bg-gradient-primary text-white hover:opacity-90 transition-opacity uppercase tracking-wider">
                        {t.auth.signUp.button}
                    </Button>
                </form>
            </div>

            {/* Sign In Container */}
            <div className={`absolute top-0 h-full transition-all duration-600 left-0 w-1/2 z-20 ${isRightPanelActive ? "translate-x-full" : ""}`}>
                <form className="bg-background flex flex-col items-center justify-center h-full px-12 text-center" onSubmit={(e) => e.preventDefault()}>
                    <h1 className="font-bold text-3xl mb-4 text-gradient-primary">{t.auth.signIn.title}</h1>
                    <div className="flex gap-4 my-4">
                        <Button variant="outline" size="icon" className="rounded-full border-muted-foreground/20 hover:border-primary hover:text-primary transition-colors">
                            <Facebook className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border-muted-foreground/20 hover:border-primary hover:text-primary transition-colors">
                            <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border-muted-foreground/20 hover:border-primary hover:text-primary transition-colors">
                            <Linkedin className="h-4 w-4" />
                        </Button>
                    </div>
                    <span className="text-muted-foreground text-sm mb-4">{t.auth.signIn.or}</span>
                    <Input type="email" placeholder={t.auth.signIn.email} className="bg-muted/30 border-none mb-2" />
                    <Input type="password" placeholder={t.auth.signIn.password} className="bg-muted/30 border-none mb-4" />
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">{t.auth.signIn.forgotPassword}</a>
                    <Button className="rounded-full px-12 py-3 font-bold bg-gradient-primary text-white hover:opacity-90 transition-opacity uppercase tracking-wider">
                        {t.auth.signIn.button}
                    </Button>
                </form>
            </div>

            {/* Overlay Container */}
            <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 z-[100] ${isRightPanelActive ? "-translate-x-full" : ""}`}>
                <div className={`bg-gradient-primary relative -left-full h-full w-[200%] transform transition-transform duration-600 ${isRightPanelActive ? "translate-x-1/2" : "translate-x-0"}`}>

                    {/* Left Overlay Panel */}
                    <div className={`absolute flex flex-col items-center justify-center h-full w-1/2 px-10 text-center top-0 transform transition-transform duration-600 ${isRightPanelActive ? "translate-x-0" : "-translate-x-[20%]"}`}>
                        <h1 className="font-bold text-3xl mb-4 text-white">{t.auth.overlay.signIn.title}</h1>
                        <p className="text-white/90 text-sm font-light leading-6 mb-8">
                            {t.auth.overlay.signIn.description}
                        </p>
                        <Button
                            variant="outline"
                            className="rounded-full px-12 py-3 font-bold border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary transition-all uppercase tracking-wider"
                            onClick={() => setIsRightPanelActive(false)}
                        >
                            {t.auth.overlay.signIn.button}
                        </Button>
                    </div>

                    {/* Right Overlay Panel */}
                    <div className={`absolute right-0 flex flex-col items-center justify-center h-full w-1/2 px-10 text-center top-0 transform transition-transform duration-600 ${isRightPanelActive ? "translate-x-[20%]" : "translate-x-0"}`}>
                        <h1 className="font-bold text-3xl mb-4 text-white">{t.auth.overlay.signUp.title}</h1>
                        <p className="text-white/90 text-sm font-light leading-6 mb-8">
                            {t.auth.overlay.signUp.description}
                        </p>
                        <Button
                            variant="outline"
                            className="rounded-full px-12 py-3 font-bold border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary transition-all uppercase tracking-wider"
                            onClick={() => setIsRightPanelActive(true)}
                        >
                            {t.auth.overlay.signUp.button}
                        </Button>
                    </div>

                </div>
            </div>

            <style jsx>{`
        @keyframes show {
          0%, 49.99% {
            opacity: 0;
            z-index: 10;
          }
          50%, 100% {
            opacity: 1;
            z-index: 50;
          }
        }
        .animate-show {
          animation: show 0.6s;
        }
      `}</style>
        </div>
    )
}

import { SlidingAuthForm } from "@/components/auth/sliding-auth-form"

export default function AuthPage() {
    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center py-20 px-4">
            <div className="w-full max-w-[768px]">
                <SlidingAuthForm />
            </div>
        </div>
    )
}

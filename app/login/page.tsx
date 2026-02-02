import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { RiArrowLeftLine } from "@remixicon/react"

export default function LoginPage() {
  return (
    <div className="bg-background flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <RiArrowLeftLine className="h-4 w-4" />
          Back to Home
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}

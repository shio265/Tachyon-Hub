import { Separator } from "@/components/ui/separator"
import { RiHandHeartLine } from "@remixicon/react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background fixed bottom-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-1.5 max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4 text-sm">
          <div className="flex max-w-sm flex-col gap-1">
            <div className="leading-none text-muted-foreground">Tachyon Hub</div>
            <Separator className="my-0.5" />
            <div className="text-muted-foreground text-xs">
              A platform for managing and sharing game redeem codes
            </div>
          </div>
          
            <div className="flex items-center gap-6 flex-wrap">
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground">
                Support Server
              </div>
              <Separator className="my-0.5"/>
              <Link href="https://dsc.gg/tachyon-hub" className="hover:underline text-muted-foreground text-xs">
                Join our Discord community
              </Link>
            </div>
            
            <Separator orientation="vertical" className="h-12" />
            
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">API</span>
              <Separator className="my-0.5"/>
              <Link href="https://api.shiori.studio/api-docs" target="_blank" rel="noopener noreferrer" className="hover:underline text-muted-foreground text-xs">
                Documentation
              </Link>
            </div>

            <Separator orientation="vertical" className="h-12" />
            
            <div className="flex flex-col gap-1">
                <Link href="/support" className="text-muted-foreground font-medium hover:underline flex items-center gap-1">
                    Support Us <RiHandHeartLine className="text-red-500 h-5 w-5"/>
                </Link>
                <Separator className="my-0.5"/>
                <span className="text-muted-foreground text-xs">
                    To keep Tachyon Hub running
                </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

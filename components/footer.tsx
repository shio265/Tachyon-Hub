import { RiHandHeartLine } from "@remixicon/react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background fixed bottom-0 left-0 right-0 z-10">
      <div className="container mx-auto px-3 py-1.5 max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="font-medium">Tachyon Hub</span>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="https://dsc.gg/tachyon-hub" className="hover:underline">
              Discord
            </Link>
            
            <span className="text-muted-foreground/30">•</span>
            
            <Link href="https://api.shiori.studio/api-docs" target="_blank" rel="noopener noreferrer" className="hover:underline">
              API Docs
            </Link>

            <span className="text-muted-foreground/30">•</span>
            
            <Link href="https://github.com/sponsors/shio265" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
              Support <RiHandHeartLine className="text-red-500 h-3.5 w-3.5"/>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

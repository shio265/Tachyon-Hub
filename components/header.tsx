"use client"

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { RiFileCopyLine } from '@remixicon/react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const { data: session, status } = useSession();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (session?.user?.id) {
      navigator.clipboard.writeText(session.user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            Tachyon Hub
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {status === "loading" ? (
            <div className="h-10 w-10 bg-muted animate-pulse" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="default" 
                  className="flex items-center gap-2 h-10 focus-visible:ring-0 focus-visible:border-transparent"
                >
                  <div className="relative h-6 w-6 overflow-hidden bg-background">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-background text-foreground font-semibold text-sm">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <span className="font-medium hidden sm:inline-block">
                    {session.user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{session.user.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        ID: {session.user.id}
                      </span>
                      <button
                        onClick={handleCopyId}
                        className="p-0.5 hover:bg-muted rounded transition-colors"
                        title="Copy Discord ID"
                      >
                        {copied ? (
                          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <RiFileCopyLine className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 focus:text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="h-10">
              <Link href="/login">
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
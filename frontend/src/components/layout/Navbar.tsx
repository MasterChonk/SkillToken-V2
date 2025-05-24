
"use client";

import Link from "next/link";
import { Blocks } from "lucide-react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { address, role } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Blocks className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            SkillToken
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          {address && role === 'teacher' && (
            <Button variant="link" asChild>
              <Link href="/teacher">Teacher Dashboard</Link>
            </Button>
          )}
          {address && role === 'student' && (
             <Button variant="link" asChild>
              <Link href="/student">Student Dashboard</Link>
            </Button>
          )}
           <Button variant="link" asChild>
             <Link href="/verify">Verify Certificate</Link>
           </Button>
        </nav>
        <div className="flex items-center space-x-2">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}

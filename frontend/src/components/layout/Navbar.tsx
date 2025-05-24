"use client";

import Link from "next/link";
import { Blocks } from "lucide-react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { address, role } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-gray-900/60 supports-[backdrop-filter]:via-black/60 supports-[backdrop-filter]:to-gray-900/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 group transition-all duration-300">
          <div className="relative">
            <Blocks className="h-6 w-6 text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text" />
            <div className="absolute inset-0 h-6 w-6 bg-gradient-to-r from-purple-400 to-cyan-400 rounded opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
          <span className="font-bold sm:inline-block text-lg bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            SkillToken
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          {address && role === 'teacher' && (
            <Button variant="ghost" asChild className="text-gray-300 hover:text-white hover:bg-purple-500/20 border border-transparent hover:border-purple-500/30 transition-all duration-300 rounded-full backdrop-blur-sm">
              <Link href="/teacher">Teacher Dashboard</Link>
            </Button>
          )}
          {address && role === 'student' && (
            <Button variant="ghost" asChild className="text-gray-300 hover:text-white hover:bg-cyan-500/20 border border-transparent hover:border-cyan-500/30 transition-all duration-300 rounded-full backdrop-blur-sm">
              <Link href="/student">Student Dashboard</Link>
            </Button>
          )}
          <Button variant="ghost" asChild className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 border border-transparent hover:border-purple-500/30 transition-all duration-300 rounded-full backdrop-blur-sm">
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

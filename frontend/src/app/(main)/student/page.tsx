"use client";

import { CertificateList } from "@/components/student/CertificateList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function StudentPage() {
  const { address, isLoading, role } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!address || role !== 'student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        {/* Animated Background Grid */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(139,69,219,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,219,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        
        <div className="container mx-auto px-4 py-12 text-center flex items-center justify-center min-h-screen relative z-10">
          <Card className="max-w-md mx-auto bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-red-500/20 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Access Denied
              </CardTitle>
              <CardDescription className="text-gray-300">
                Please connect your wallet as a Student to access this dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300">
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,69,219,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,219,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="mb-10 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-sm font-medium border border-purple-500/30 backdrop-blur-sm">
              ✨ Your Learning Journey
            </span>
          </div>
          
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-1">
            <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            View and manage your earned skill certificates.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
              Your Web3 achievements await
            </span>
          </p>
        </header>

        <div className="relative">
          <CertificateList studentAddress={address} />
        </div>
      </div>
    </div>
  );
}

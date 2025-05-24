"use client";

import { VerificationForm } from "@/components/verify/VerificationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function VerifyPage() {
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
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full text-sm font-medium border border-green-500/30 backdrop-blur-sm">
              🔐 Blockchain Certificate Verification
            </span>
          </div>
          
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-500 p-1">
            <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Verify Certificate
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Enter the Token ID and Contract Address to verify the authenticity of a SkillToken certificate.
            <br />
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
              Powered by blockchain technology
            </span>
          </p>
        </header>

        <Card className="max-w-2xl mx-auto shadow-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-green-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Verification Details
            </CardTitle>
            <CardDescription className="text-gray-300">
              Provide the necessary information to look up a certificate on the blockchain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VerificationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

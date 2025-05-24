
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookUser, CheckBadge, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 text-primary">
          Welcome to SkillToken
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A decentralized platform for creating, issuing, and verifying skill certificates on the blockchain.
        </p>
        <div className="relative mx-auto w-full max-w-3xl h-72 rounded-lg overflow-hidden shadow-2xl mb-8">
          <Image 
            src="https://placehold.co/800x400.png" 
            alt="Blockchain network concept"
            layout="fill"
            objectFit="cover"
            data-ai-hint="blockchain network"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
           <h2 className="absolute bottom-6 left-6 text-3xl font-semibold text-white">Empower Your Skills</h2>
        </div>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link href="/teacher">
              Teacher Portal <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/student">
              Student Portal <BookUser className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full mb-4">
              <CheckBadge className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">Create Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Teachers can easily create and manage courses, preparing them for certificate issuance.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-plus-2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M3 15h6"/><path d="M6 12v6"/></svg>
            </div>
            <CardTitle className="text-2xl">Issue NFT Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Issue secure, tamper-proof NFT certificates to students upon course completion.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">Verify Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Anyone can instantly verify the authenticity of a SkillToken certificate.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Join SkillToken today and be part of the future of skill verification.
        </p>
        <Button size="lg" variant="outline" asChild>
          <Link href="/verify">
            Verify a Certificate Now <ShieldCheck className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

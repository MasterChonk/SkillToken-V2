
"use client";

import { VerificationForm } from "@/components/verify/VerificationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-10 text-center">
        <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary">Verify Certificate</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Enter the Token ID and Contract Address to verify the authenticity of a SkillToken certificate.
        </p>
      </header>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle>Verification Details</CardTitle>
          <CardDescription>Provide the necessary information to look up a certificate.</CardDescription>
        </CardHeader>
        <CardContent>
          <VerificationForm />
        </CardContent>
      </Card>
    </div>
  );
}

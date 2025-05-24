
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
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!address || role !== 'student') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
         <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Please connect your wallet as a Student to access this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary flex items-center">
          <Sparkles className="mr-3 h-10 w-10" /> Student Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">View and manage your earned skill certificates.</p>
      </header>

      <CertificateList studentAddress={address} />
    </div>
  );
}

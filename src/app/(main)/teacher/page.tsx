
"use client";

import { CreateCourseForm } from "@/components/teacher/CreateCourseForm";
import { DelegateAccessForm } from "@/components/teacher/DelegateAccessForm";
import { IssueCertificateForm } from "@/components/teacher/IssueCertificateForm";
import { MyCoursesList } from "@/components/teacher/MyCoursesList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { BookMarked, UsersRound, Award, Loader2 } from "lucide-react";
import Link from "next/link";

export default function TeacherPage() {
  const { address, isLoading, role } = useUser();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!address || role !== 'teacher') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Please connect your wallet as a Teacher to access this dashboard.
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
        <h1 className="text-4xl font-bold text-primary">Teacher Dashboard</h1>
        <p className="text-lg text-muted-foreground">Manage your courses, issue certificates, and delegate access.</p>
      </header>

      <Tabs defaultValue="my-courses" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8">
          <TabsTrigger value="my-courses" className="py-3">
            <BookMarked className="mr-2 h-5 w-5" /> My Courses
          </TabsTrigger>
          <TabsTrigger value="issue-certificate" className="py-3">
            <Award className="mr-2 h-5 w-5" /> Issue Certificate
          </TabsTrigger>
          <TabsTrigger value="delegate-access" className="py-3">
            <UsersRound className="mr-2 h-5 w-5" /> Delegate Access
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-courses">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>My Courses & Creation</CardTitle>
              <CardDescription>View your existing courses and create new ones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <CreateCourseForm />
              <MyCoursesList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issue-certificate">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Issue New Certificate</CardTitle>
              <CardDescription>Select a course and issue an NFT certificate to a student.</CardDescription>
            </CardHeader>
            <CardContent>
              <IssueCertificateForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delegate-access">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Delegate Certificate Issuing Rights</CardTitle>
              <CardDescription>Grant another account the ability to issue certificates on your behalf for specific courses.</CardDescription>
            </CardHeader>
            <CardContent>
              <DelegateAccessForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

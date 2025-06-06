
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  teacherAddress: string; // Assuming this is part of the course data
}

// Mock data - in a real app, this would come from a state management solution or API
const MOCK_COURSES: Course[] = [
  { id: "COURSE-1", name: "Advanced Solidity Programming", teacherAddress: "0xTeacherMockAddress1234567890" },
  { id: "COURSE-2", name: "Decentralized Application Design", teacherAddress: "0xTeacherMockAddress1234567890" },
  { id: "COURSE-3", name: "NFT Fundamentals and Marketplaces", teacherAddress: "0xOtherTeacherAddress" }, // Example of course by another teacher
];

export function MyCoursesList() {
  // This component would ideally fetch courses associated with the logged-in teacher.
  // For now, we'll simulate this with local state and mock data.
  const [courses, setCourses] = useState<Course[]>([]);
  const currentUserAddress = "0xTeacherMockAddress1234567890"; // Mock current user

  useEffect(() => {
    // Filter courses to show only those created by the current teacher
    const teacherCourses = MOCK_COURSES.filter(course => course.teacherAddress === currentUserAddress);
    setCourses(teacherCourses);
  }, [currentUserAddress]);

  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You haven't created any courses yet. Use the form above to add your first course.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Your Created Courses</CardTitle>
        <CardDescription>A list of courses you have created.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <ul className="space-y-4">
            {courses.map((course) => (
              <li key={course.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg shadow-sm hover:bg-secondary/70 transition-colors">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-semibold">{course.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {course.id}</p>
                  </div>
                </div>
                <Badge variant="outline">Active</Badge>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { createCourse, connectWallet} from "@/utils/contract.js";

// This would typically be stored and managed by the parent component or a global state
// For now, it's just a local demonstration.
// In a real app, addCourse would interact with a backend or context.
interface Course {
  id: string;
  name: string;
  teacherAddress: string;
}
interface CreateCourseFormProps {
  onCourseCreated?: (course: Course) => void;
}


const formSchema = z.object({
  courseName: z.string().min(3, {
    message: "Course name must be at least 3 characters.",
  }).max(100, {
    message: "Course name must not exceed 100 characters.",
  }),
});

export function CreateCourseForm({ onCourseCreated }: CreateCourseFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values.courseName)
    createCourse(values.courseName);
    const newCourseId = `COURSE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    console.log("Creating course:", values.courseName, "ID:", newCourseId);
    // In a real app, you'd save this to a backend/blockchain
    // and potentially link it to the teacher's address from useUser().

    // Mocking course creation
    const newCourse: Course = {
        id: newCourseId,
        name: values.courseName,
        teacherAddress: "0xTeacherMockAddress1234567890" // Replace with actual teacher address
    };
    onCourseCreated?.(newCourse);


    toast({
      title: "Course Created!",
      description: `Course "${values.courseName}" (ID: ${newCourseId.substring(0,15)}...) has been successfully created.`,
    });
    form.reset();
  }

  return (
    <Card className="mb-6 border-primary border-2 shadow-md">
        <CardHeader>
            <CardTitle className="text-xl">Create a New Course</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="courseName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Introduction to Blockchain" {...field} />
                    </FormControl>
                    <FormDescription>
                        Enter a descriptive name for your new course.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Course
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}

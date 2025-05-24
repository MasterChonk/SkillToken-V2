
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

// Mock course data - in a real app, fetch courses created by the teacher
interface Course {
  id: string;
  name: string;
}
const MOCK_TEACHER_COURSES: Course[] = [
  { id: "COURSE-1", name: "Advanced Solidity Programming" },
  { id: "COURSE-2", name: "Decentralized Application Design" },
];

const formSchema = z.object({
  delegateAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid Ethereum wallet address.",
  }),
  courseId: z.string().min(1, { message: "Please select a course." }), // Optional: delegate for a specific course or all
});

export function DelegateAccessForm() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Simulate fetching courses
    setCourses(MOCK_TEACHER_COURSES);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delegateAddress: "",
      courseId: "", // Set to empty to allow "All Courses" or specific selection
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Delegating access:", values);
    // In a real app, this would:
    // 1. Interact with a smart contract function to grant issuing rights.
    // 2. The smart contract would manage these permissions.
    toast({
      title: "Delegation Request Sent!",
      description: `Delegating issuing rights for course ${values.courseId || 'All Courses'} to ${values.delegateAddress.substring(0,10)}...`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="delegateAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delegate Wallet Address</FormLabel>
              <FormControl>
                <Input placeholder="0xABC..." {...field} />
              </FormControl>
              <FormDescription>
                The Ethereum wallet address of the account you want to delegate issuing rights to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delegate for Specific Course (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course or leave for all" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">All My Courses</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} (ID: {course.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                If no course is selected, delegation applies to all your current and future courses.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full md:w-auto">
          <Share2 className="mr-2 h-4 w-4" /> Delegate Issuing Rights
        </Button>
      </form>
    </Form>
  );
}

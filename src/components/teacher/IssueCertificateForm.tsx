
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
import { Award } from "lucide-react";
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
  studentWalletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid Ethereum wallet address.",
  }),
  courseId: z.string().min(1, { message: "Please select a course." }),
  // Potentially add more fields like certificate metadata (e.g., student name, grade)
});

export function IssueCertificateForm() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Simulate fetching courses - replace with actual API call or context data
    setCourses(MOCK_TEACHER_COURSES);
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentWalletAddress: "",
      courseId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Issuing certificate for:", values);
    // In a real app, this would:
    // 1. Interact with a smart contract to mint an NFT certificate.
    // 2. Store metadata on Filecoin (or other decentralized storage).
    // 3. The smart contract would associate the NFT with the student's wallet, courseId, etc.
    toast({
      title: "Certificate Issuance Initiated!",
      description: `Issuing certificate for course ID ${values.courseId} to ${values.studentWalletAddress.substring(0,10)}...`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Course</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} (ID: {course.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The course for which this certificate is being issued.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studentWalletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Wallet Address</FormLabel>
              <FormControl>
                <Input placeholder="0x123..." {...field} />
              </FormControl>
              <FormDescription>
                The Ethereum wallet address of the student receiving the certificate.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Add more fields here for certificate metadata if needed */}
        {/* e.g., Student Name, Completion Date, Grade/Score */}

        <Button type="submit" className="w-full md:w-auto">
          <Award className="mr-2 h-4 w-4" /> Issue Certificate
        </Button>
      </form>
    </Form>
  );
}

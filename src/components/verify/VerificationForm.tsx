
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
import { ScanSearch, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation';
import Image from "next/image";

const formSchema = z.object({
  tokenId: z.string().min(1, {
    message: "Token ID is required.",
  }),
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid Ethereum contract address.",
  }),
});

interface CertificateDetails {
  id: string;
  courseName: string;
  studentAddress: string;
  issuerName: string;
  issueDate: string;
  isValid: boolean;
  fileUrl?: string;
  imageUrl?: string;
}

// Mock certificate data for verification
const MOCK_VERIFIABLE_CERTIFICATE: CertificateDetails = {
  id: "721",
  courseName: "Advanced Solidity Programming",
  studentAddress: "0xStudentMockAddress0987654321",
  issuerName: "Ethereum University",
  issueDate: "2023-10-26",
  isValid: true,
  fileUrl: "ipfs://bafybeihgrec...",
  imageUrl: "https://placehold.co/600x400.png"
};


export function VerificationForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<CertificateDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenId: searchParams.get('tokenId') || "",
      contractAddress: searchParams.get('contractAddress') || "",
    },
  });
  
  useEffect(() => {
    const tokenId = searchParams.get('tokenId');
    const contractAddress = searchParams.get('contractAddress');
    if (tokenId && contractAddress) {
      form.setValue('tokenId', tokenId);
      form.setValue('contractAddress', contractAddress);
      // Automatically submit if params are present
      // form.handleSubmit(onSubmit)(); // This can cause issues with multiple renders.
      // Better to trigger a manual submission or just prefill.
      // For this example, we'll just prefill. User can click verify.
    }
  }, [searchParams, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setVerificationResult(null);
    setError(null);
    console.log("Verifying certificate:", values);

    // Simulate API call to blockchain/indexer
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (values.tokenId === MOCK_VERIFIABLE_CERTIFICATE.id && values.contractAddress.toLowerCase() === "0xcertcontract123") {
      setVerificationResult(MOCK_VERIFIABLE_CERTIFICATE);
      toast({
        title: "Verification Successful!",
        description: "Certificate details are displayed below.",
        variant: "default",
      });
    } else {
      setError("Certificate not found or invalid details provided.");
      toast({
        title: "Verification Failed",
        description: "Could not verify the certificate with the provided details.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="tokenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 123" {...field} />
                </FormControl>
                <FormDescription>
                  The unique identifier of the NFT certificate.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contractAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Address</FormLabel>
                <FormControl>
                  <Input placeholder="0xContract..." {...field} />
                </FormControl>
                <FormDescription>
                  The address of the smart contract that issued the certificate.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ScanSearch className="mr-2 h-4 w-4" />
            )}
            Verify Certificate
          </Button>
        </form>
      </Form>

      {verificationResult && (
        <Card className="mt-10 shadow-md border-green-500">
          <CardHeader className="bg-green-50 dark:bg-green-900/30">
            <CardTitle className="flex items-center text-green-700 dark:text-green-400">
              <CheckCircle2 className="mr-2 h-6 w-6" /> Certificate Verified
            </CardTitle>
            <CardDescription>This certificate is authentic and valid.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {verificationResult.imageUrl && (
                <div className="relative w-full h-64 rounded-md overflow-hidden border">
                    <Image src={verificationResult.imageUrl} alt={verificationResult.courseName} layout="fill" objectFit="contain" data-ai-hint="certificate document" />
                </div>
            )}
            <div><strong>Course Name:</strong> {verificationResult.courseName}</div>
            <div><strong>Student Address:</strong> <span className="font-mono text-sm">{verificationResult.studentAddress}</span></div>
            <div><strong>Issuer:</strong> {verificationResult.issuerName}</div>
            <div><strong>Issue Date:</strong> {new Date(verificationResult.issueDate).toLocaleDateString()}</div>
            <div><strong>Token ID:</strong> {verificationResult.id}</div>
            {verificationResult.fileUrl && (
              <Button variant="link" asChild className="p-0 h-auto">
                <a href={verificationResult.fileUrl} target="_blank" rel="noopener noreferrer">
                  View Certificate File
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mt-10 shadow-md border-destructive">
          <CardHeader className="bg-red-50 dark:bg-red-900/30">
            <CardTitle className="flex items-center text-destructive">
              <AlertCircle className="mr-2 h-6 w-6" /> Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p>{error}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}

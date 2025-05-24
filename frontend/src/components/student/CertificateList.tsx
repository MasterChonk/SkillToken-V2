
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Award } from "lucide-react";
import Image from "next/image";

interface Certificate {
  id: string; // Token ID
  courseName: string;
  issuerName: string; // Teacher or Institution Name
  issueDate: string;
  fileUrl?: string; // Link to certificate file on Filecoin/IPFS
  contractAddress: string;
  imageUrl?: string; // Could be a preview image of the certificate
}

// Mock data - in a real app, this would be fetched from the blockchain based on studentAddress
const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "721",
    courseName: "Advanced Solidity Programming",
    issuerName: "Ethereum University",
    issueDate: "2023-10-26",
    fileUrl: "ipfs://bafybeihgrec...",
    contractAddress: "0xCertContract123",
    imageUrl: "https://placehold.co/300x200.png",
  },
  {
    id: "1155",
    courseName: "Decentralized Application Design",
    issuerName: "Blockchain Institute",
    issueDate: "2024-01-15",
    fileUrl: "ipfs://bafybeihgrec...",
    contractAddress: "0xCertContract456",
    imageUrl: "https://placehold.co/300x200.png",
  },
];

interface CertificateListProps {
  studentAddress: string;
}

export function CertificateList({ studentAddress }: CertificateListProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching certificates for the studentAddress
    // In a real app, query blockchain events or a graph indexer
    console.log("Fetching certificates for address:", studentAddress);
    setTimeout(() => {
      setCertificates(MOCK_CERTIFICATES); // Use mock data for now
      setIsLoading(false);
    }, 1500);
  }, [studentAddress]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">My Certificates</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">Loading your certificates...</p>
        </CardContent>
      </Card>
    );
  }

  if (certificates.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">My Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <Award className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No certificates found.</p>
            <p className="text-sm text-muted-foreground">Keep learning and earning to see your certificates here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-semibold tracking-tight">My Certificates ({certificates.length})</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
            <Card key={cert.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {cert.imageUrl && (
                 <div className="relative w-full h-48">
                    <Image src={cert.imageUrl} alt={cert.courseName} layout="fill" objectFit="cover" data-ai-hint="certificate document" />
                 </div>
            )}
            <CardHeader>
                <CardTitle className="text-xl leading-tight">{cert.courseName}</CardTitle>
                <CardDescription>Issued by: {cert.issuerName}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="space-y-2 text-sm">
                    <p><Badge variant="secondary">Token ID: {cert.id}</Badge></p>
                    <p>Issue Date: {new Date(cert.issueDate).toLocaleDateString()}</p>
                    <p className="truncate">Contract: <span className="font-mono text-xs">{cert.contractAddress}</span></p>
                </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
                {cert.fileUrl && (
                <Button variant="outline" size="sm" asChild>
                    <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Download
                    </a>
                </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                <Link href={`/verify?tokenId=${cert.id}&contractAddress=${cert.contractAddress}`}>
                    <ExternalLink className="mr-2 h-4 w-4" /> Verify
                </Link>
                </Button>
            </CardFooter>
            </Card>
        ))}
        </div>
    </div>
  );
}

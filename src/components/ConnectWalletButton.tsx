
"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { Wallet, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function ConnectWalletButton() {
  const { address, setAddress, setRole } = useUser();
  const router = useRouter();

  // Mock wallet addresses
  const mockTeacherAddress = "0xTeacherMockAddress1234567890";
  const mockStudentAddress = "0xStudentMockAddress0987654321";

  const handleConnect = (userRole: 'teacher' | 'student') => {
    // In a real app, this would interact with MetaMask or other wallet providers
    if (userRole === 'teacher') {
      setAddress(mockTeacherAddress);
      setRole('teacher');
      router.push('/teacher');
    } else {
      setAddress(mockStudentAddress);
      setRole('student');
      router.push('/student');
    }
    console.log(`Connected as ${userRole} with address: ${userRole === 'teacher' ? mockTeacherAddress : mockStudentAddress}`);
  };

  const handleDisconnect = () => {
    setAddress(null);
    setRole(null);
    router.push('/');
    console.log("Wallet disconnected");
  };

  if (address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Wallet className="mr-2 h-4 w-4" />
            {address.substring(0, 6)}...{address.substring(address.length - 4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDisconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleConnect('teacher')}>
          Connect as Teacher
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConnect('student')}>
          Connect as Student
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

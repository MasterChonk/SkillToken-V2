
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



import { ethers } from "ethers";

  let CONTRACT_ADDRESS: any;
  let CONTRACT_ABI: any;

  try {
    //should be changed if name of smartcontract is diferent from MyToken
    const response = await fetch('/MyToken.json');
  
    if (!response.ok) {
      throw new Error(`Loading error: ${response.status} ${response.statusText}`);
    }
  
    const artifact = await response.json();
  
    if (!artifact.abi) {
      throw new Error("ABI not found");
    }

    CONTRACT_ABI = artifact.abi;
  } catch (error: any) {
    console.error("Error in ABI:", error.message);
  }
  try {
    //should be changed if name of smartcontract is diferent from MyToken
    const response = await fetch('/MyToken-address.json');
  
    if (!response.ok) {
      throw new Error(`Loading error: ${response.status} ${response.statusText}`);
    }
  
    const artifact = await response.json();
  
    if (!artifact.address) {
      throw new Error("Address not found");
    }
  
    CONTRACT_ADDRESS = artifact.address;
  } catch (error: any) {
    console.error("Address in ABI:", error.message);
  }
  console.log(CONTRACT_ADDRESS, CONTRACT_ABI)
  let provider: any;
  let signer: any;
  let contract: any;
  let currentAccount: any;

  async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      alert("Install MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      currentAccount = accounts[0];

      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log("Conected to MetaMask:", currentAccount);
    } catch (error) {
      console.error("Error in conection:", error);
    }
  }

  //handling the wallet change event
  window.ethereum?.on('accountsChanged', async (accounts) => {
    if (accounts.length === 0) {
      console.log("Wallet disabled");
      currentAccount = null;
      return;
    }

    currentAccount = accounts[0];
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log("Acount changed to:", currentAccount);
  });

  //Обробка зміни мережі
  window.ethereum?.on('chainChanged', () => {
    console.warn("Network changed reloading");
    window.location.reload();
  });


  /*methodName - string
  example 
  contractMethod("getValue")
  .then(value => {
    //code with returned value
  })
  
  
  */
// async function contractMethod(methodName) {
//   if (!contract) {
//     contract = await connectWallet();
//     if (!contract) return null;
//   }

//   try {
//     const result = await contract[methodName]();
//     return result;
//   } catch (error) {
//     console.error(`Error with method ${methodName}:`, error);
//     return null;
//   }
// }

async function createOrganization() {
    //input if you need value
  const text = document.getElementById("createOrg").value;
  if (!contract) {
    contract = await connectWallet();
  }
  let tx, reason;
  try {
    //change to name of function in solidity, give all required parameters for solidity function
    tx = await contract.createOrganization(text);
  } catch (error) {
    reason = error.reason;
  }
  if(tx !== undefined){
    //code if successfull used solidity function

  } else if(reason) {
    //code if action in solidity not allowed

  } else {
    console.log("network error")
  }
  console.log(tx);
//   await getLiquidityEvents();
}


async function getLiquidityEvents() {
    //address for selection by address
    const _address = await signer.getAddress();
    //name of event in solidity and indexed value(s)
    const eventFilter = contract.filters.OrganizationRegistered(_address);
    const fromBlock = 0;
    const toBlock = 'latest';
    const events = await contract.queryFilter(eventFilter, fromBlock, toBlock);
    console.log(events)
    
    for (const evt of events) {
        //change to variabels names in solidity
        const { orgAddress, name } = evt.args;

         console.log(orgAddress);
         console.log(name);
    }
}

getLiquidityEvents();
  //Export functions for HTML
window.connectWallet = connectWallet;
window.createOrganization = createOrganization;




export function ConnectWalletButton() {
  const { address, setAddress, setRole } = useUser();
  const router = useRouter();

  // Mock wallet addresses
  const mockTeacherAddress = "0xTeacherMockAddress1234567890";
  const mockStudentAddress = "0xStudentMockAddress0987654321";

  const handleConnect = (userRole: 'teacher' | 'student') => {
    connectWallet();
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






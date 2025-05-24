"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethersInitialize } from '@/utils/contract';

let isInitialized = false;

interface UserContextType {
  address: string | null;
  setAddress: Dispatch<SetStateAction<string | null>>;
  role: 'teacher' | 'student' | null;
  setRole: Dispatch<SetStateAction<'teacher' | 'student' | null>>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [role, setRole] = useState<'teacher' | 'student' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      isInitialized = true;
      ethersInitialize().then(() => {
        console.log("Contract initialized");
        setIsLoading(false);
      }).catch((error) => {
        console.error("Failed to initialize contract:", error);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ address, setAddress, role, setRole, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
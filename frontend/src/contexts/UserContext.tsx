
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  address: string | null;
  setAddress: Dispatch<SetStateAction<string | null>>;
  role: 'teacher' | 'student' | null; // Added role
  setRole: Dispatch<SetStateAction<'teacher' | 'student' | null>>; // Added role setter
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [role, setRole] = useState<'teacher' | 'student' | null>(null); // Initialize role
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt to load user from localStorage or session to persist state
    // For this scaffold, we'll just initialize it.
    // In a real app, you might check a stored session or token.
    setIsLoading(false); 
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

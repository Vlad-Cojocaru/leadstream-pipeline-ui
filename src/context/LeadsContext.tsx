import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LeadData } from '@/services/leadApiService';

interface LeadsContextType {
  leads: LeadData[];
  setLeads: React.Dispatch<React.SetStateAction<LeadData[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  mutationFlag: boolean;
  setMutationFlag: React.Dispatch<React.SetStateAction<boolean>>;
  refreshFlag: boolean;
  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mutationFlag, setMutationFlag] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  return (
    <LeadsContext.Provider value={{ leads, setLeads, isLoading, setIsLoading, mutationFlag, setMutationFlag, refreshFlag, setRefreshFlag }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
} 
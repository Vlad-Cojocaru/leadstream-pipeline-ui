import React, { createContext, useContext, useState, useEffect } from 'react';
import { leadApiService, LeadData } from '@/services/leadApiService';

interface LeadsContextType {
  leads: LeadData[];
  setLeads: React.Dispatch<React.SetStateAction<LeadData[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeadsContext = createContext<LeadsContextType>({
  leads: [],
  setLeads: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('leads');
    if (stored) {
      try {
        setLeads(JSON.parse(stored));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Save to sessionStorage whenever leads change
  useEffect(() => {
    sessionStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  return (
    <LeadsContext.Provider value={{ leads, setLeads, isLoading, setIsLoading }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => useContext(LeadsContext); 
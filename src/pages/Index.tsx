
import React, { useState, useEffect, useRef } from 'react';
import { LeadList } from '@/components/LeadList';
import { LeadDetail } from '@/components/LeadDetail';
import { leadApiService, LeadData } from '@/services/leadApiService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { useLeads } from '@/context/LeadsContext';
import BottomNavigation from '@/components/BottomNavigation';
import { stagesService, Stage } from '@/services/stagesService';
import { getStageName } from '@/utils/stageUtils';

const Index = () => {
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const { leads, setLeads, isLoading, setIsLoading, mutationFlag, setMutationFlag, refreshFlag, setRefreshFlag } = useLeads();
  const { toast } = useToast();
  const { clientName, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [hasFetched, setHasFetched] = useState(false);
  const fetchInterval = useRef<NodeJS.Timeout | null>(null);
  const sessionDuration = 30 * 60 * 1000; // 30 minutes
  const backgroundFetchInterval = 60 * 1000; // 1 minute
  const sessionStartRef = useRef<number | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);

  // Fetch on first load or after mutation
  useEffect(() => {
    let ignore = false;
    if (clientName && !authLoading && (leads.length === 0 || mutationFlag || refreshFlag)) {
      console.log('[DEBUG] Fetch triggered:', { leadsLength: leads.length, mutationFlag, refreshFlag });
      setIsLoading(true);
      leadApiService.fetchLeads(clientName)
        .then(fetchedLeads => {
          if (!ignore) setLeads(fetchedLeads);
        })
        .catch(() => {
          if (!ignore) {
            toast({
              title: "Error",
              description: "Failed to load leads. Please refresh the page.",
              variant: "destructive",
              style: { background: "#CD1349", color: "#fff", border: "2px solid #CD1349" },
            });
          }
        })
        .finally(() => {
          if (!ignore) {
            setIsLoading(false);
            setMutationFlag(false);
            setRefreshFlag(false);
            console.log('[DEBUG] Fetch complete, flags reset');
          }
        });
    }
    return () => { ignore = true; };
  }, [clientName, authLoading, mutationFlag, refreshFlag, setLeads, setIsLoading, setMutationFlag, setRefreshFlag, toast]);

  // Background fetch every minute (no spinner)
  useEffect(() => {
    if (!clientName || authLoading) return;
    if (!sessionStartRef.current) sessionStartRef.current = Date.now();
    const interval = setInterval(() => {
      // Only run for up to 30 minutes
      if (Date.now() - (sessionStartRef.current || 0) > sessionDuration) {
        clearInterval(interval);
        return;
      }
      console.log('[DEBUG] Background fetch running');
      leadApiService.fetchLeads(clientName)
        .then(fetchedLeads => setLeads(fetchedLeads))
        .catch(() => {/* silent fail */});
    }, backgroundFetchInterval);
    return () => clearInterval(interval);
  }, [clientName, authLoading, setLeads]);

  useEffect(() => {
    stagesService.fetchStages().then((fetchedStages) => setStages(fetchedStages));
  }, []);

  const handleLeadSelect = (lead: LeadData) => {
    setSelectedLead(lead);
  };

  const handleBack = () => {
    setSelectedLead(null);
  };

  const handleStageUpdate = async (leadId: string, newStageId: number, newIndex: number) => {
    try {
      const success = await leadApiService.updateLeadStage(leadId, newStageId, clientName);
      if (success) {
        setLeads(prevLeads =>
          prevLeads.map(lead =>
            lead.id === leadId
              ? { ...lead, currentStage: newStageId, lastUpdate: new Date().toISOString() }
              : lead
          )
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead({
            ...selectedLead,
            currentStage: newStageId,
            lastUpdate: new Date().toISOString()
          });
        }
        setMutationFlag(true); // Only trigger refetch after mutation
        toast({
          title: "Success",
          description: `Lead moved to ${getStageName(newStageId, stages)}. SMS notification sent!`,
          variant: "success",
        });
      } else {
        throw new Error('Failed to update lead stage');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead stage. Please try again.",
        variant: "destructive",
        style: { background: "#CD1349", color: "#fff", border: "2px solid #CD1349" },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#16161d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0f7969] dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0f7969] dark:text-white">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${leads.length === 0 && !selectedLead ? 'bg-white dark:bg-[#16161d]' : 'bg-[#f9fafb] dark:bg-[#16161d]'}`}>
      {selectedLead ? (
        <LeadDetail 
          lead={selectedLead} 
          onBack={handleBack}
          onStageUpdate={handleStageUpdate}
        />
      ) : (
        leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="rounded-xl border-2 border-[#0f7969] bg-white dark:bg-zinc-800 px-12 py-6 text-center shadow-md min-w-[340px] max-w-[420px]">
              <img src="/lovable-uploads/21ca0443-32f3-4f4b-a21c-bec7c180b4f7.png" alt="Logo" className="h-12 w-12 mx-auto mb-2 object-contain" />
              <div className="text-lg font-semibold text-[#0f7969] dark:text-[#0f7969]">No new leads</div>
              <div className="text-gray-600 dark:text-gray-300 mt-1 mb-4">Check back later.</div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={toggleTheme}
                  className="bg-white dark:bg-[#23272f] border border-[#0f7969] text-[#0f7969] dark:text-white rounded-full p-1.5 shadow hover:bg-[#0f7969]/10 dark:hover:bg-[#0f7969]/30 transition"
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
                <LogoutButton />
              </div>
            </div>
          </div>
        ) : (
          <LeadList 
            leads={leads} 
            onLeadSelect={handleLeadSelect}
            selectedLead={selectedLead}
            headerActions={
              <>
                <button
                  onClick={toggleTheme}
                  className="bg-white dark:bg-[#23272f] border border-[#0f7969] text-[#0f7969] dark:text-white rounded-full p-1.5 shadow hover:bg-[#0f7969]/10 dark:hover:bg-[#0f7969]/30 transition"
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
                <LogoutButton />
              </>
            }
          />
        )
      )}
      {!selectedLead && <BottomNavigation />}
    </div>
  );
};

// Log Out button for home/lead list only
function LogoutButton() {
  const { isLoggedIn, logout, loading } = useAuth();
  const location = useLocation();
  if (!isLoggedIn || loading) return null;
  return (
    <button
      onClick={() => {
        logout();
      }}
      className="bg-red-500 text-white px-2 py-1.5 rounded hover:bg-red-600 text-xs font-medium shadow"
      style={{ minWidth: 0 }}
    >
      Log Out
    </button>
  );
}

export { ThemeProvider };
export default Index;

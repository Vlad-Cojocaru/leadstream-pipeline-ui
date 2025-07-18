
import React, { useState, useEffect } from 'react';
import { LeadList } from '@/components/LeadList';
import { LeadDetail } from '@/components/LeadDetail';
import { leadApiService, LeadData } from '@/services/leadApiService';
import { webhookClient } from '@/services/webhookClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

const Index = () => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { clientSlug, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (clientSlug && !authLoading) {
      loadLeads();
    }
  }, [clientSlug, authLoading]);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const fetchedLeads = await leadApiService.fetchLeads(clientSlug);
      setLeads(fetchedLeads);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leads. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSelect = (lead: LeadData) => {
    setSelectedLead(lead);
  };

  const handleBack = () => {
    setSelectedLead(null);
  };

  const handleStageUpdate = async (leadId: string, newStage: string, newIndex: number) => {
    try {
      // Update the webhook
      const webhookSuccess = await webhookClient.updateLeadStage({
        leadId,
        currentStage: selectedLead?.currentStage || '',
        newStage,
        timestamp: new Date().toISOString(),
        source: 'Lead Stream Pro'
      });

      // Update via Make.com
      const sheetsSuccess = await leadApiService.updateLeadStage(leadId, newStage, newIndex, clientSlug);

      if (webhookSuccess || sheetsSuccess) {
        // Update local state
        setLeads(prevLeads =>
          prevLeads.map(lead =>
            lead.id === leadId
              ? { ...lead, currentStage: newStage, stageIndex: newIndex, lastUpdated: new Date().toISOString() }
              : lead
          )
        );

        // Update selected lead
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead({
            ...selectedLead,
            currentStage: newStage,
            stageIndex: newIndex,
            lastUpdated: new Date().toISOString()
          });
        }

        toast({
          title: "Success",
          description: `Lead moved to ${newStage}. SMS notification sent!`,
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
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="rounded-xl border-2 border-[#0f7969] bg-white dark:bg-zinc-800 px-12 py-6 text-center shadow-md min-w-[340px] max-w-[420px]">
              <img src="/lovable-uploads/21ca0443-32f3-4f4b-a21c-bec7c180b4f7.png" alt="Logo" className="h-12 w-12 mx-auto mb-2 object-contain" />
              <div className="text-lg font-semibold text-[#0f7969] dark:text-[#0f7969]">No new leads</div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">Check back later.</div>
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
                  className="bg-white dark:bg-[#23272f] border border-[#0f7969] text-[#0f7969] dark:text-white rounded-full p-2 shadow hover:bg-[#0f7969]/10 dark:hover:bg-[#0f7969]/30 transition"
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                <LogoutButton />
              </>
            }
          />
        )
      )}
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
      onClick={logout}
      className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 text-sm font-medium shadow"
      style={{ minWidth: 0 }}
    >
      Log Out
    </button>
  );
}

export { ThemeProvider };
export default Index;

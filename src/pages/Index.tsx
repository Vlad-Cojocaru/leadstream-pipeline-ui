
import React, { useState, useEffect } from 'react';
import { LeadList } from '@/components/LeadList';
import { LeadDetail } from '@/components/LeadDetail';
import { googleSheetsService, LeadData } from '@/services/googleSheetsService';
import { webhookClient } from '@/services/webhookClient';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const fetchedLeads = await googleSheetsService.fetchLeads();
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

      // Update Google Sheets
      const sheetsSuccess = await googleSheetsService.updateLeadStage(leadId, newStage, newIndex);

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {selectedLead ? (
        <LeadDetail 
          lead={selectedLead} 
          onBack={handleBack}
          onStageUpdate={handleStageUpdate}
        />
      ) : (
        <LeadList 
          leads={leads} 
          onLeadSelect={handleLeadSelect}
        />
      )}
    </div>
  );
};

export default Index;


export interface LeadData {
  id: string;
  name: string;
  phone: string;
  email: string;
  offerType: string;
  currentStage: string;
  stageIndex: number;
  lastUpdated: string;
}

export class LeadApiService {
  private static instance: LeadApiService;
  private sheetUrl: string | null = null;
  private apiKey: string | null = null;
  private makeFetchLeadsWebhookUrl: string | null = null;
  private makeUpdateLeadWebhookUrl: string | null = null;

  static getInstance(): LeadApiService {
    if (!LeadApiService.instance) {
      LeadApiService.instance = new LeadApiService();
    }
    return LeadApiService.instance;
  }

  setCredentials(sheetUrl: string, apiKey?: string, makeFetchLeadsWebhookUrl?: string, makeUpdateLeadWebhookUrl?: string) {
    this.sheetUrl = sheetUrl;
    this.apiKey = apiKey;
    this.makeFetchLeadsWebhookUrl = makeFetchLeadsWebhookUrl;
    this.makeUpdateLeadWebhookUrl = makeUpdateLeadWebhookUrl;
  }

  async fetchLeads(clientSlug?: string): Promise<LeadData[]> {
    console.log('[LeadApiService] fetchLeads called with clientSlug:', clientSlug);
    if (clientSlug && this.makeFetchLeadsWebhookUrl) {
      return this.fetchLeadsFromMake(clientSlug);
    }
    console.warn('[LeadApiService] No clientSlug or webhook URL, returning empty array.');
    return [];
  }

  private async fetchLeadsFromMake(clientSlug: string): Promise<LeadData[]> {
    try {
      console.log('[LeadApiService] fetchLeadsFromMake POSTing to:', this.makeFetchLeadsWebhookUrl, 'with clientSlug:', clientSlug);
      const response = await fetch(this.makeFetchLeadsWebhookUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'fetch_leads',
          clientSlug: clientSlug,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.error('[LeadApiService] HTTP error! status:', response.status);
        return [];
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('[LeadApiService] Could not parse JSON from Make.com:', responseText);
        return [];
      }
      console.log('[LeadApiService] Raw Make.com response:', data);
      if (data.success && Array.isArray(data.leads)) {
        const validStages = ['New Lead', 'Contacted', 'Follow-Up', 'Proposal Sent', 'Sold', 'In Progress', 'Completed'];
        const filteredLeads = data.leads
          .filter((lead: any) => lead.currentStage && validStages.includes(lead.currentStage))
          .map((lead: any) => ({
            id: lead.id || `lead-${Date.now()}-${Math.random()}`,
            name: lead.name,
            phone: lead.phone,
            email: lead.email,
            offerType: lead.offerType || '',
            currentStage: lead.currentStage,
            stageIndex: this.getStageIndex(lead.currentStage),
            lastUpdated: lead.lastUpdated || new Date().toISOString()
          }));
        console.log('[LeadApiService] Filtered leads from Make.com:', filteredLeads);
        return filteredLeads;
      } else {
        console.error('[LeadApiService] Make.com returned error or invalid leads array:', data.error);
        return [];
      }
    } catch (error) {
      console.error('[LeadApiService] Error fetching leads from Make.com:', error);
      return [];
    }
  }

  private getStageIndex(stage: string): number {
    const stages = ['New Lead', 'Contacted', 'Follow-Up', 'Proposal Sent', 'Sold', 'In Progress', 'Completed'];
    return stages.indexOf(stage);
  }

  async updateLeadStage(leadId: string, newStage: string, stageIndex: number, clientSlug?: string): Promise<boolean> {
    if (!this.sheetUrl) {
      console.error('Google Sheets URL not configured');
      return false;
    }

    try {
      // Call Make.com webhook to update the lead stage
      if (clientSlug && this.makeUpdateLeadWebhookUrl) {
        const response = await fetch(this.makeUpdateLeadWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update_lead_stage',
            clientSlug: clientSlug,
            leadId: leadId,
            newStage: newStage,
            stageIndex: stageIndex,
            timestamp: new Date().toISOString()
          })
        });

        if (response.ok) {
          // Try to parse as JSON, but handle text responses like "Accepted"
          const responseText = await response.text();
          let data;
          
          try {
            data = JSON.parse(responseText);
            return data.success || false;
          } catch (e) {
            console.log('Make.com returned text response:', responseText);
            // If it's just "Accepted" or similar, consider it successful
            return true;
          }
        }
      }

      // Fallback to console log for development
      console.log(`Updating Google Sheets: Lead ${leadId} to stage ${newStage} for client ${clientSlug}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error updating lead stage:', error);
      return false;
    }
  }

  private getMockLeads(): LeadData[] {
    console.warn('[LeadApiService] getMockLeads called (should not be used in production).');
    return [];
  }

  async addLead(leadData: Omit<LeadData, 'id' | 'lastUpdated'>): Promise<string> {
    // Generate a new ID and add timestamp
    const newId = `lead-${Date.now()}`;
    
    console.log('Adding new lead to Google Sheets:', { ...leadData, id: newId });
    
    // In production, this would make an actual API call to add to Google Sheets
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return newId;
  }
}

export const leadApiService = LeadApiService.getInstance();

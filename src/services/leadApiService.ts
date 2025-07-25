
export interface LeadData {
  id: string;
  name: string;
  phone: string;
  email: string;
  offerType: string;
  currentStage: number; // stageid
  lastUpdate: string;
}

export class LeadApiService {
  private static instance: LeadApiService;
  private baseApiUrl: string | null = null;

  static getInstance(): LeadApiService {
    if (!LeadApiService.instance) {
      LeadApiService.instance = new LeadApiService();
    }
    return LeadApiService.instance;
  }

  setBaseApiUrl(baseApiUrl: string) {
    this.baseApiUrl = baseApiUrl;
  }

  async fetchLeads(clientName?: string): Promise<LeadData[]> {
    if (!this.baseApiUrl || !clientName) {
      console.warn('[LeadApiService] No baseApiUrl or clientName, returning empty array.');
      return [];
    }
    try {
      const response = await fetch(`${this.baseApiUrl}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientName, timestamp: new Date().toISOString() })
      });
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.leads)) {
        // Use only stageid from backend
        const filteredLeads = data.leads
          .filter((lead: any) => typeof lead.stageid === 'number')
          .map((lead: any) => ({
            id: lead.id || lead.leadid || `lead-${Date.now()}-${Math.random()}`,
            name: lead.name,
            phone: lead.phone,
            email: lead.email,
            offerType: lead.offerType || '',
            currentStage: lead.stageid, // Use only stageid
            lastUpdate: lead.lastUpdate || new Date().toISOString()
          }));
        return filteredLeads;
      } else {
        console.error('[LeadApiService] Backend returned error or invalid leads array:', data.error);
        return [];
      }
    } catch (error) {
      console.error('[LeadApiService] Error fetching leads from backend:', error);
      return [];
    }
  }

  async updateLeadStage(leadId: string, newStageId: number, clientName?: string): Promise<boolean> {
    if (!this.baseApiUrl || !clientName) {
      console.error('[LeadApiService] No baseApiUrl or clientName configured');
      return false;
    }
    try {
      const response = await fetch(`${this.baseApiUrl}/api/leads/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName,
          leadID: leadId,
          newStageId, // send stageid
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.success || false;
      }
    } catch (error) {
      console.error('Error updating lead stage:', error);
      return false;
    }
  }

  private getMockLeads(): LeadData[] {
    console.warn('[LeadApiService] getMockLeads called (should not be used in production).');
    return [];
  }

  async addLead(leadData: Omit<LeadData, 'id' | 'lastUpdate'>): Promise<string> {
    // Generate a new ID and add timestamp
    const newId = `lead-${Date.now()}`;
    console.log('Adding new lead to backend:', { ...leadData, id: newId });
    await new Promise(resolve => setTimeout(resolve, 300));
    return newId;
  }
}

export const leadApiService = LeadApiService.getInstance();

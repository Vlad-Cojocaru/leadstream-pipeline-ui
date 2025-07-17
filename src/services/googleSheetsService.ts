
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

export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private sheetUrl: string | null = null;
  private apiKey: string | null = null;

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  setCredentials(sheetUrl: string, apiKey?: string) {
    this.sheetUrl = sheetUrl;
    this.apiKey = apiKey;
  }

  async fetchLeads(): Promise<LeadData[]> {
    // Mock data for development - replace with actual Google Sheets API call
    return this.getMockLeads();
  }

  async updateLeadStage(leadId: string, newStage: string, stageIndex: number): Promise<boolean> {
    if (!this.sheetUrl) {
      console.error('Google Sheets URL not configured');
      return false;
    }

    try {
      // In production, this would make an actual API call to update the Google Sheet
      console.log(`Updating Google Sheets: Lead ${leadId} to stage ${newStage}`);
      
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error updating Google Sheets:', error);
      return false;
    }
  }

  private getMockLeads(): LeadData[] {
    return [
      {
        id: 'lead-001',
        name: 'John Smith',
        phone: '(555) 123-4567',
        email: 'john.smith@email.com',
        offerType: 'Kitchen Remodel',
        currentStage: 'New Lead',
        stageIndex: 0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'lead-002',
        name: 'Sarah Johnson',
        phone: '(555) 234-5678',
        email: 'sarah.j@email.com',
        offerType: 'Bathroom Renovation',
        currentStage: 'Contacted',
        stageIndex: 1,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'lead-003',
        name: 'Mike Davis',
        phone: '(555) 345-6789',
        email: 'mike.davis@email.com',
        offerType: 'Full Home Renovation',
        currentStage: 'Proposal Sent',
        stageIndex: 3,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'lead-004',
        name: 'Lisa Wilson',
        phone: '(555) 456-7890',
        email: 'lisa.w@email.com',
        offerType: 'Deck Installation',
        currentStage: 'Follow-Up',
        stageIndex: 2,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'lead-005',
        name: 'Robert Brown',
        phone: '(555) 567-8901',
        email: 'rob.brown@email.com',
        offerType: 'Roof Repair',
        currentStage: 'Sold',
        stageIndex: 4,
        lastUpdated: new Date().toISOString()
      }
    ];
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

export const googleSheetsService = GoogleSheetsService.getInstance();

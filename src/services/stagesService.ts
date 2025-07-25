export interface Stage {
  idstage: number;
  name: string;
}

export interface StagesResponse {
  success: boolean;
  stages: Stage[];
}

export class StagesService {
  private static instance: StagesService;
  private baseApiUrl: string | null = null;
  private stages: Stage[] = [];
  private isLoading: boolean = false;

  static getInstance(): StagesService {
    if (!StagesService.instance) {
      StagesService.instance = new StagesService();
    }
    return StagesService.instance;
  }

  setBaseApiUrl(baseApiUrl: string) {
    this.baseApiUrl = baseApiUrl;
  }

  async fetchStages(): Promise<Stage[]> {
    if (!this.baseApiUrl) {
      console.warn('[StagesService] No baseApiUrl configured');
      return this.getDefaultStages();
    }

    if (this.isLoading) {
      return this.stages;
    }

    if (this.stages.length > 0) {
      return this.stages; // Return cached stages
    }

    this.isLoading = true;

    try {
      const response = await fetch(`${this.baseApiUrl}/api/stages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.error('[StagesService] HTTP error! status:', response.status);
        return this.getDefaultStages();
      }

      const data: StagesResponse = await response.json();
      
      if (data.success && Array.isArray(data.stages)) {
        this.stages = data.stages;
        console.log('[StagesService] Fetched stages from backend:', this.stages);
        return this.stages;
      } else {
        console.error('[StagesService] Backend returned error or invalid stages array');
        return this.getDefaultStages();
      }
    } catch (error) {
      console.error('[StagesService] Error fetching stages from backend:', error);
      return this.getDefaultStages();
    } finally {
      this.isLoading = false;
    }
  }

  getStages(): Stage[] {
    return this.stages;
  }

  getStageIndex(stageId: number): number {
    return this.stages.findIndex(s => s.idstage === stageId);
  }

  getNextStageId(currentStageId: number): number | null {
    const currentIndex = this.getStageIndex(currentStageId);
    if (currentIndex >= 0 && currentIndex < this.stages.length - 1) {
      return this.stages[currentIndex + 1].idstage;
    }
    return null;
  }

  getPreviousStageId(currentStageId: number): number | null {
    const currentIndex = this.getStageIndex(currentStageId);
    if (currentIndex > 0) {
      return this.stages[currentIndex - 1].idstage;
    }
    return null;
  }

  isValidStageId(stageId: number): boolean {
    return this.stages.some(s => s.idstage === stageId);
  }

  private getDefaultStages(): Stage[] {
    return [
      { idstage: 1, name: 'New Lead' },
      { idstage: 2, name: 'Contacted' },
      { idstage: 3, name: 'Follow-Up' },
      { idstage: 4, name: 'Proposal Sent' },
      { idstage: 5, name: 'Sold' },
      { idstage: 6, name: 'In Progress' },
      { idstage: 7, name: 'Completed' }
    ];
  }
}

export const stagesService = StagesService.getInstance(); 
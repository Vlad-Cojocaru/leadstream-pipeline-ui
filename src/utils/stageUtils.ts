import { Stage } from '@/services/stagesService';

const DEFAULT_STAGES: { [id: number]: string } = {
  1: 'New Lead',
  2: 'Contacted', 
  3: 'Follow-Up',
  4: 'Proposal Sent',
  5: 'Sold',
  6: 'In Progress',
  7: 'Completed'
};

export const getStageName = (stageId: number, stages: Stage[] = []): string => {
  // First try to get from loaded stages
  const stage = stages.find(s => s.idstage === stageId);
  if (stage) {
    return stage.name;
  }
  
  // Fallback to default stage names if stages are not yet loaded
  return DEFAULT_STAGES[stageId] || '';
}; 
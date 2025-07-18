
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail, FileText, ArrowRight, User } from 'lucide-react';
import { PipelineStage } from './PipelineStage';
import { useToast } from '@/hooks/use-toast';
import { stageStyles } from '@/components/LeadList';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  offerType: string;
  currentStage: string;
  stageIndex: number;
}

interface LeadDetailProps {
  lead: Lead;
  onBack: () => void;
  onStageUpdate: (leadId: string, newStage: string, newIndex: number) => void;
}

const stages = [
  'New Lead',
  'Contacted', 
  'Follow-Up',
  'Proposal Sent',
  'Sold',
  'In Progress',
  'Completed'
];

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onBack, onStageUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStageUpdate = async (newIndex: number) => {
    if (newIndex === lead.stageIndex || isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      const newStage = stages[newIndex];
      
      onStageUpdate(lead.id, newStage, newIndex);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stage. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStageIndex = Math.min(lead.stageIndex + 1, stages.length - 1);
  const canMoveToNext = lead.stageIndex < stages.length - 1;

  return (
    <div className="min-h-screen bg-white dark:bg-[#16161d]">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 px-4 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-[#16161d] dark:text-white hover:text-[#0f7969] hover:bg-[#0f7969]/10 dark:hover:text-[#0f7969] dark:hover:bg-[#0f7969]/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <User className="w-10 h-10 mr-2 text-[#0f7969]" />
            <h1 className="text-2xl font-bold text-[#16161d] dark:text-white tracking-tight flex items-center gap-2">
              Lead Details:
              <span className="inline-block px-3 py-1 rounded-full bg-[#0f7969]/10 text-[#0f7969] font-semibold text-lg ml-1">
                {lead.name.split(' ')[0]}
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 bg-white dark:bg-[#16161d]">
        {/* Lead Info Card */}
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#16161d] dark:text-white flex items-center justify-between text-lg">
              {lead.name}
              <span className={`inline-block px-3 py-1 rounded-full font-medium text-xs border ${stageStyles[lead.currentStage as keyof typeof stageStyles]}`}>
                {lead.currentStage}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{lead.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{lead.email}</span>
              </div>
            </div>
            
            {lead.offerType && (
              <div className="mt-3">
                <span className="text-xs text-[#0f7969] bg-[#0f7969]/10 dark:bg-[#0f7969]/30 border border-[#0f7969] dark:border-[#0f7969]/40 px-2 py-1 rounded-md font-medium shadow-[0_0_8px_0_rgba(15,121,105,0.15)] dark:shadow-[0_0_8px_0_rgba(15,121,105,0.35)]">
                  {lead.offerType}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Visualization */}
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-sm">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[#16161d] dark:text-white text-lg">Lead Pipeline</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 dark:text-gray-300 hover:text-white hover:bg-gray-400 dark:hover:bg-gray-700 bg-gray-200 dark:bg-zinc-800"
              onClick={() => {
                if (lead.stageIndex > 0 && !isUpdating) {
                  handleStageUpdate(lead.stageIndex - 1);
                }
              }}
              disabled={lead.stageIndex === 0 || isUpdating}
              aria-label="Move Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mb-6">
              {stages.map((stage, index) => (
                <PipelineStage
                  key={stage}
                  stage={stage}
                  index={index}
                  currentIndex={lead.stageIndex}
                  isNextStage={index === nextStageIndex && canMoveToNext}
                  onClick={() => index === nextStageIndex && canMoveToNext ? handleStageUpdate(index) : undefined}
                />
              ))}
            </div>

            {/* Action Button */}
            {canMoveToNext && (
              <div className="text-center pt-4 border-t border-gray-200">
                <Button
                  onClick={() => handleStageUpdate(nextStageIndex)}
                  disabled={isUpdating}
                  className="bg-[#0f7969] hover:bg-[#0f7969]/90 text-white border-[#0f7969] font-medium px-6 py-2"
                >
                  {isUpdating ? (
                    "Updating..."
                  ) : (
                    <>
                      Move to {stages[nextStageIndex]}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {lead.stageIndex === stages.length - 1 && (
              <div className="text-center pt-4 border-t border-gray-200">
                <Badge className="bg-emerald-500 text-white text-base py-2 px-4 border-emerald-500 pointer-events-none select-none">
                  🎉 Lead Completed!
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

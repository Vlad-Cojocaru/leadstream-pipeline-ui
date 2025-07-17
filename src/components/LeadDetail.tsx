
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail, FileText, ArrowRight } from 'lucide-react';
import { PipelineStage } from './PipelineStage';
import { useToast } from '@/hooks/use-toast';

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

const stageStyles = {
  'New Lead': 'bg-blue-50 text-blue-700 border-blue-200',
  'Contacted': 'bg-amber-50 text-amber-700 border-amber-200',
  'Follow-Up': 'bg-purple-50 text-purple-700 border-purple-200',
  'Proposal Sent': 'bg-green-50 text-green-700 border-green-200',
  'Sold': 'bg-teal-50 text-teal-700 border-teal-200',
  'In Progress': 'bg-red-50 text-red-700 border-red-200',
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onBack, onStageUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStageUpdate = async (newIndex: number) => {
    if (newIndex === lead.stageIndex || isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      const newStage = stages[newIndex];
      
      onStageUpdate(lead.id, newStage, newIndex);
      
      toast({
        title: "Stage Updated",
        description: `${lead.name} moved to ${newStage}`,
      });
      
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-[#16161d] hover:text-[#0f7969] hover:bg-[#0f7969]/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/21ca0443-32f3-4f4b-a21c-bec7c180b4f7.png" 
              alt="CurateFlow Logo" 
              className="w-6 h-6"
            />
            <h1 className="text-xl font-brand text-[#16161d]">Lead Details</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 bg-white">
        {/* Lead Info Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#16161d] flex items-center justify-between text-lg">
              {lead.name}
              <Badge className={`${stageStyles[lead.currentStage as keyof typeof stageStyles]} border font-medium`}>
                {lead.currentStage}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{lead.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{lead.email}</span>
              </div>
            </div>
            
            {lead.offerType && (
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <FileText className="w-4 h-4 text-[#0f7969]" />
                <span className="text-sm text-[#0f7969] font-medium">{lead.offerType}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Visualization */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#16161d] text-lg">Lead Pipeline</CardTitle>
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
                <Badge className="bg-emerald-500 text-white text-base py-2 px-4 border-emerald-500">
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

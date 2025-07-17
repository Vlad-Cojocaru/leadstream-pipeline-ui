
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
  'New Lead': 'stage-new',
  'Contacted': 'stage-contacted',
  'Follow-Up': 'stage-followup',
  'Proposal Sent': 'stage-proposal',
  'Sold': 'stage-sold',
  'In Progress': 'stage-progress',
  'Completed': 'stage-completed'
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-foreground hover:text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/21ca0443-32f3-4f4b-a21c-bec7c180b4f7.png" 
              alt="CurateFlow Logo" 
              className="w-6 h-6"
            />
            <h1 className="text-xl font-brand text-foreground">Lead Details</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Lead Info Card */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground flex items-center justify-between text-lg">
              {lead.name}
              <Badge className={`${stageStyles[lead.currentStage as keyof typeof stageStyles]} border font-medium`}>
                {lead.currentStage}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{lead.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{lead.email}</span>
              </div>
            </div>
            
            {lead.offerType && (
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">{lead.offerType}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Visualization */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground text-lg">Lead Pipeline</CardTitle>
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
              <div className="text-center pt-4 border-t border-border">
                <Button
                  onClick={() => handleStageUpdate(nextStageIndex)}
                  disabled={isUpdating}
                  className="bg-primary hover:bg-primary/90 text-white border-primary glow-primary font-medium px-6 py-2"
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
              <div className="text-center pt-4 border-t border-border">
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

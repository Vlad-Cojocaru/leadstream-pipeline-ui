
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

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onBack, onStageUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleStageUpdate = async (newIndex: number) => {
    if (newIndex === lead.stageIndex || isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      const newStage = stages[newIndex];
      
      // Simulate webhook call
      console.log(`Updating lead ${lead.id} to stage: ${newStage}`);
      
      // Call the parent's update function
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
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-white">Lead Details</h1>
      </div>

      {/* Lead Info Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            {lead.name}
            <Badge className="bg-primary text-white">
              {lead.currentStage}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{lead.email}</span>
            </div>
          </div>
          
          {lead.offerType && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400">{lead.offerType}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pipeline Visualization */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Lead Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-8 overflow-x-auto pb-4">
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
            <div className="text-center">
              <Button
                onClick={() => handleStageUpdate(nextStageIndex)}
                disabled={isUpdating}
                className="bg-green-500 hover:bg-green-600 text-white glow-green"
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
            <div className="text-center">
              <Badge className="bg-emerald-500 text-white text-lg py-2 px-4">
                🎉 Lead Completed!
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

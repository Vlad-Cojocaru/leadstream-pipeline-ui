
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail, FileText, ArrowRight, User } from 'lucide-react';
import { PipelineStage } from './PipelineStage';
import { useToast } from '@/hooks/use-toast';
import { stagesService, Stage } from '@/services/stagesService';
import { useSwipeable } from 'react-swipeable';
import { getStageName } from '@/utils/stageUtils';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  offerType: string;
  currentStage: number; // stageid
  lastUpdate: string;
}

interface LeadDetailProps {
  lead: Lead;
  onBack: () => void;
  onStageUpdate: (leadId: string, newStageId: number, newIndex: number) => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onBack, onStageUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [stages, setStages] = useState<Stage[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    stagesService.fetchStages().then((fetchedStages) => setStages(fetchedStages));
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => onBack(),
    delta: 60, // minimum distance(px) before a swipe is detected
    trackTouch: true,
    trackMouse: false,
  });

  const currentIndex = stages.findIndex(s => s.idstage === lead.currentStage);
  const nextStageIndex = Math.min(currentIndex + 1, stages.length - 1);
  const canMoveToNext = currentIndex < stages.length - 1;

  const handleStageUpdate = async (newIndex: number) => {
    if (newIndex === currentIndex || isUpdating) return;
    setIsUpdating(true);
    try {
      const newStageId = stages[newIndex].idstage;
      onStageUpdate(lead.id, newStageId, newIndex);
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

  const stageColorMap: { [id: number]: string } = {
    1: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/30 dark:text-blue-300 dark:border-blue-500',
    2: 'bg-[#0f7969]/10 text-[#0f7969] border-[#0f7969] dark:bg-yellow-500/30 dark:text-yellow-300 dark:border-yellow-500',
    3: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/30 dark:text-purple-300 dark:border-purple-500',
    4: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/30 dark:text-green-300 dark:border-green-500',
    5: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/30 dark:text-teal-300 dark:border-teal-500',
    6: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/30 dark:text-red-300 dark:border-red-500',
    7: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/30 dark:text-emerald-300 dark:border-emerald-500'
  };

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-[#16161d]" {...swipeHandlers}>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="absolute left-4 text-[#16161d] dark:text-white hover:text-[#0f7969] hover:bg-[#0f7969]/10 dark:hover:text-[#0f7969] dark:hover:bg-[#0f7969]/20"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 ml-8">
            <User className="w-8 h-8 text-[#0f7969]" />
            <h1 className="text-2xl font-brand text-[#16161d] dark:text-white">Lead Details</h1>
            <span className="inline-block px-3 py-1 rounded-full bg-[#0f7969]/10 text-[#0f7969] font-semibold text-lg ml-1">
              {lead.name.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Lead Info Card */}
      <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#16161d] dark:text-white flex items-center justify-between text-lg">
            {lead.name}
            <span className={`inline-block px-3 py-1 rounded-full font-medium text-xs border ${stageColorMap[lead.currentStage]}`}>
              {getStageName(lead.currentStage, stages)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Phone className="w-4 h-4" />
              <a
                href={`tel:${lead.phone}`}
                className="text-sm text-[#0f7969] hover:underline focus:underline"
                aria-label={`Call ${lead.phone}`}
              >
                {lead.phone}
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Mail className="w-4 h-4" />
              <a
                href={`mailto:${lead.email}`}
                className="text-sm text-[#0f7969] hover:underline focus:underline"
                aria-label={`Email ${lead.email}`}
              >
                {lead.email}
              </a>
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
              if (currentIndex > 0 && !isUpdating) {
                handleStageUpdate(currentIndex - 1);
              }
            }}
            disabled={currentIndex === 0 || isUpdating}
            aria-label="Move Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 mb-6">
            {stages.map((stage, index) => (
              <PipelineStage
                key={stage.idstage}
                stage={stage.name}
                index={index}
                currentIndex={currentIndex}
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
                    Move to {getStageName(stages[nextStageIndex]?.idstage)}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          {currentIndex === stages.length - 1 && (
            <div className="text-center pt-4 border-t border-gray-200">
              <Badge className="bg-emerald-500 text-white text-base py-2 px-4 border-emerald-500 pointer-events-none select-none">
                🎉 Lead Completed!
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

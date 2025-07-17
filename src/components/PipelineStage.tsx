
import React from 'react';
import { Check, Circle, Clock, FileText, Handshake, Hammer, Trophy } from 'lucide-react';

interface PipelineStageProps {
  stage: string;
  index: number;
  currentIndex: number;
  isNextStage?: boolean;
  onClick?: () => void;
}

const stageIcons = {
  'New Lead': Circle,
  'Contacted': Check,
  'Follow-Up': Clock,
  'Proposal Sent': FileText,
  'Sold': Handshake,
  'In Progress': Hammer,
  'Completed': Trophy
};

export const PipelineStage: React.FC<PipelineStageProps> = ({
  stage,
  index,
  currentIndex,
  isNextStage,
  onClick
}) => {
  const Icon = stageIcons[stage as keyof typeof stageIcons];
  const isActive = index === currentIndex;
  const isCompleted = index < currentIndex;
  
  let stageClass = 'border-2 border-gray-300 bg-white text-gray-400';
  let textClass = 'text-gray-500';
  
  if (isCompleted) {
    stageClass = 'border-2 border-accent bg-accent text-white';
    textClass = 'text-accent font-medium';
  } else if (isActive) {
    stageClass = 'border-2 border-primary bg-primary text-white shadow-lg';
    textClass = 'text-primary font-semibold';
  } else if (isNextStage) {
    stageClass = 'border-2 border-accent bg-accent/5 text-accent glow-accent animate-pulse-glow cursor-pointer hover:bg-accent/10';
    textClass = 'text-accent font-medium';
  }

  return (
    <div className="flex flex-col items-center relative flex-1 min-w-0">
      <div
        className={`
          w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
          transition-all duration-300 ${stageClass}
        `}
        onClick={onClick}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      
      <div className="mt-2 text-center px-1">
        <p className={`text-xs sm:text-sm font-medium ${textClass} leading-tight`}>
          {stage}
        </p>
      </div>
      
      {index < 6 && (
        <div 
          className={`
            absolute top-6 sm:top-7 left-6 sm:left-7 right-0 h-0.5 
            ${isCompleted ? 'bg-accent' : 'bg-gray-300'}
            transition-colors duration-300 z-0
          `}
        />
      )}
    </div>
  );
};

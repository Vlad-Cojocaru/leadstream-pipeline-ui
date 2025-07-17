
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

const stageColors = {
  'New Lead': 'border-blue-300 bg-blue-50 text-blue-700',
  'Contacted': 'border-amber-300 bg-amber-50 text-amber-700',
  'Follow-Up': 'border-purple-300 bg-purple-50 text-purple-700',
  'Proposal Sent': 'border-green-300 bg-green-50 text-green-700',
  'Sold': 'border-teal-300 bg-teal-50 text-teal-700',
  'In Progress': 'border-red-300 bg-red-50 text-red-700',
  'Completed': 'border-emerald-300 bg-emerald-50 text-emerald-700'
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
  
  let stageClass = 'border-2 border-gray-200 bg-gray-50 text-gray-400';
  let textClass = 'text-gray-500';
  let lineClass = 'bg-gray-200';
  
  if (isCompleted) {
    stageClass = 'border-2 border-primary bg-primary text-white shadow-sm';
    textClass = 'text-primary font-medium';
    lineClass = 'bg-primary';
  } else if (isActive) {
    stageClass = `border-2 ${stageColors[stage as keyof typeof stageColors]} shadow-md`;
    textClass = 'text-foreground font-semibold';
    lineClass = 'bg-primary';
  } else if (isNextStage) {
    stageClass = 'border-2 border-primary bg-primary/5 text-primary glow-primary animate-pulse-glow cursor-pointer hover:bg-primary/10';
    textClass = 'text-primary font-medium';
  }

  return (
    <div className="flex items-start relative">
      {/* Stage Circle */}
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          transition-all duration-300 ${stageClass} shrink-0
        `}
        onClick={onClick}
      >
        <Icon className="w-5 h-5" />
      </div>
      
      {/* Stage Content */}
      <div className="ml-4 flex-1 min-w-0">
        <h4 className={`text-sm font-medium ${textClass} leading-tight mb-1`}>
          {stage}
        </h4>
        <p className="text-xs text-muted-foreground">
          {isCompleted ? 'Completed' : isActive ? 'Current' : isNextStage ? 'Next' : 'Pending'}
        </p>
      </div>
      
      {/* Vertical Line */}
      {index < 6 && (
        <div 
          className={`
            absolute top-10 left-5 w-0.5 h-8
            ${lineClass}
            transition-colors duration-300
          `}
        />
      )}
    </div>
  );
};

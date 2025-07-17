
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
  'New Lead': 'border-gray-500 text-gray-400',
  'Contacted': 'border-yellow-500 text-yellow-400',
  'Follow-Up': 'border-orange-500 text-orange-400',
  'Proposal Sent': 'border-blue-500 text-blue-400',
  'Sold': 'border-green-500 text-green-400',
  'In Progress': 'border-purple-500 text-purple-400',
  'Completed': 'border-emerald-500 text-emerald-400'
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
  
  let stageClass = 'border-gray-600 text-gray-500';
  
  if (isCompleted) {
    stageClass = 'border-green-500 text-green-400 bg-green-500/10';
  } else if (isActive) {
    stageClass = 'border-primary text-primary bg-primary/10 glow-primary';
  } else if (isNextStage) {
    stageClass = 'border-green-400 text-green-400 glow-green animate-pulse-glow cursor-pointer hover:bg-green-500/20';
  }

  return (
    <div className="flex flex-col items-center relative">
      <div
        className={`
          w-16 h-16 rounded-full border-2 flex items-center justify-center
          transition-all duration-300 ${stageClass}
        `}
        onClick={onClick}
      >
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="mt-2 text-center">
        <p className={`text-xs font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-green-400' : isNextStage ? 'text-green-400' : 'text-gray-500'}`}>
          {stage}
        </p>
      </div>
      
      {index < 6 && (
        <div 
          className={`
            absolute top-8 left-16 w-8 h-0.5 
            ${isCompleted ? 'bg-green-500' : 'bg-gray-600'}
            transition-colors duration-300
          `}
        />
      )}
    </div>
  );
};

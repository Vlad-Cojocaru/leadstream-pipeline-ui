import React, { useState, useEffect } from 'react';
import { leadApiService, LeadData } from '@/services/leadApiService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Circle, Check, Clock, FileText, Handshake, Hammer, Trophy } from 'lucide-react';

const stages = [
  'New Lead',
  'Contacted', 
  'Follow-Up',
  'Proposal Sent',
  'Sold',
  'In Progress',
  'Completed'
];

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
  'New Lead': 'bg-blue-500',
  'Contacted': 'bg-amber-500',
  'Follow-Up': 'bg-purple-500',
  'Proposal Sent': 'bg-green-500',
  'Sold': 'bg-teal-500',
  'In Progress': 'bg-red-500',
  'Completed': 'bg-emerald-500'
};

const FunnelPage = () => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { clientSlug, loading: authLoading } = useAuth();

  useEffect(() => {
    if (clientSlug && !authLoading) {
      loadLeads();
    }
  }, [clientSlug, authLoading]);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const fetchedLeads = await leadApiService.fetchLeads(clientSlug);
      setLeads(fetchedLeads);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leads. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStageCount = (stage: string) => {
    return leads.filter(lead => lead.currentStage === stage).length;
  };

  const getTotalLeads = () => {
    return leads.length;
  };

  const getStageWidth = (stage: string) => {
    const count = getStageCount(stage);
    const total = getTotalLeads();
    if (total === 0) return 100;
    return Math.max((count / total) * 100, 10); // Minimum 10% width for visibility
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#16161d] flex items-center justify-center pb-16">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0f7969] dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0f7969] dark:text-white">Loading funnel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#16161d] pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 px-4 py-6 shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/21ca0443-32f3-4f4b-a21c-bec7c180b4f7.png" 
            alt="CurateFlow Logo" 
            className="w-8 h-8"
          />
          <h1 className="text-2xl font-brand text-[#16161d] dark:text-white">Sales Funnel</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Pipeline overview and analytics</p>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {/* Funnel Visualization */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#16161d] dark:text-white mb-6 text-center">
            Lead Pipeline Funnel
          </h2>
          
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const count = getStageCount(stage);
              const width = getStageWidth(stage);
              const Icon = stageIcons[stage as keyof typeof stageIcons];
              const colorClass = stageColors[stage as keyof typeof stageColors];
              
              return (
                <div key={stage} className="flex items-center gap-4">
                  <div className="w-32 text-right shrink-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {stage}
                    </span>
                  </div>
                  
                  <div className="w-80 relative">
                    <div className="h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                      <div 
                        className={`h-full ${colorClass} transition-all duration-500 flex items-center justify-between px-4 rounded-lg shadow-sm`}
                        style={{ width: `${width}%` }}
                      >
                        <div className="flex items-center gap-2 text-white">
                          <Icon className="w-4 h-4" />
                          <span className="font-semibold text-white drop-shadow-sm">{count}</span>
                        </div>
                        {count > 0 && (
                          <span className="text-white text-sm font-semibold drop-shadow-sm">
                            {((count / getTotalLeads()) * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-16 text-left shrink-0">
                    <span className="text-lg font-bold text-[#16161d] dark:text-white">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700">
            <div className="text-center">
              <span className="text-2xl font-bold text-[#0f7969]">{getTotalLeads()}</span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">Total Leads</span>
            </div>
          </div>
        </div>

        {/* Stage Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((stage) => {
            const count = getStageCount(stage);
            const Icon = stageIcons[stage as keyof typeof stageIcons];
            const colorClass = stageColors[stage as keyof typeof stageColors];
            
            return (
              <div key={stage} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 ${colorClass} rounded-full flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-medium text-[#16161d] dark:text-white">{stage}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#16161d] dark:text-white">{count}</span>
                  <span className="text-sm text-gray-500">
                    {getTotalLeads() > 0 ? `${((count / getTotalLeads()) * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FunnelPage;
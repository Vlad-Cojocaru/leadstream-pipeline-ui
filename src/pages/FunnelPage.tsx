import React, { useState, useEffect } from 'react';
import { leadApiService, LeadData } from '@/services/leadApiService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Circle, Check, Clock, FileText, Handshake, Hammer, Trophy, Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';
import { stageStyles } from '@/components/LeadList';
import { useLeads } from '@/context/LeadsContext';

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

const FunnelPage = () => {
  const { leads, setLeads, isLoading, setIsLoading } = useLeads();
  const { toast } = useToast();
  const { clientSlug, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, logout, loading: authLoadingBtn } = useAuth();
  const [openDropdowns, setOpenDropdowns] = useState<{ [stage: string]: boolean }>({});

  const toggleDropdown = (stage: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [stage]: !prev[stage] }));
  };

  useEffect(() => {
    if (clientSlug && !authLoading && leads.length === 0) {
      setIsLoading(true);
      leadApiService.fetchLeads(clientSlug)
        .then(fetchedLeads => setLeads(fetchedLeads))
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to load leads. Please refresh the page.",
            variant: "destructive",
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [clientSlug, authLoading, leads.length, setLeads, setIsLoading, toast]);

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
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/21ca0443-32f3-4f4b-a21c-bec7c180b4f7.png" 
              alt="CurateFlow Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-brand text-[#16161d] dark:text-white">Sales Funnel</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="bg-white dark:bg-[#23272f] border border-[#0f7969] text-[#0f7969] dark:text-white rounded-full p-2 shadow hover:bg-[#0f7969]/10 dark:hover:bg-[#0f7969]/30 transition"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            {isLoggedIn && !authLoadingBtn && (
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 text-sm font-medium shadow"
                style={{ minWidth: 0 }}
              >
                Log Out
              </button>
            )}
          </div>
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
              // Use the neon-like style for the bar and indicator
              const styleClass = stageStyles[stage as keyof typeof stageStyles];
              return (
                <div key={stage} className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                  {/* Mobile Layout */}
                  <div className="md:hidden w-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 border ${styleClass} rounded-full flex items-center justify-center`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {stage}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#16161d] dark:text-white">
                          {count}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({getTotalLeads() > 0 ? `${((count / getTotalLeads()) * 100).toFixed(1)}%` : '0%'})
                        </span>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${styleClass} transition-all duration-500 rounded-full border`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-center gap-4 w-full">
                    <div className="w-36 text-right shrink-0">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {stage}
                      </span>
                    </div>
                    
                    <div className="w-96 lg:w-[500px] relative">
                      <div className="h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                        <div 
                          className={`h-full ${styleClass} transition-all duration-500 flex items-center justify-between px-4 rounded-lg shadow-sm border`}
                          style={{ width: `${width}%` }}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="font-semibold drop-shadow-sm">
                              {count}
                            </span>
                          </div>
                          {count > 0 && (
                            <span className="text-sm font-semibold drop-shadow-sm">
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
            const styleClass = stageStyles[stage as keyof typeof stageStyles];
            const leadsInStage = leads.filter(lead => lead.currentStage === stage);
            const isOpen = openDropdowns[stage];
            return (
              <div key={stage} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 border border-gray-200 dark:border-zinc-700">
                <button
                  className="w-full flex items-center gap-3 mb-2 focus:outline-none"
                  onClick={() => toggleDropdown(stage)}
                  aria-expanded={isOpen}
                  aria-controls={`dropdown-${stage}`}
                >
                  <div className={`w-8 h-8 border ${styleClass} rounded-full flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-[#16161d] dark:text-white flex-1 text-left">{stage}</h3>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#16161d] dark:text-white">{count}</span>
                  <span className="text-sm text-gray-500">
                    {getTotalLeads() > 0 ? `${((count / getTotalLeads()) * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
                {isOpen && (
                  <div id={`dropdown-${stage}`} className="mt-4 border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-2">
                    {leadsInStage.length === 0 ? (
                      <div className="text-gray-400 text-sm italic">No leads in this stage</div>
                    ) : (
                      leadsInStage.map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 rounded px-3 py-2">
                          <span className="font-medium text-[#16161d] dark:text-white truncate">{lead.name}</span>
                          {lead.offerType && (
                            <span className="text-xs text-[#0f7969] bg-[#0f7969]/10 dark:bg-[#0f7969]/20 border border-[#0f7969]/20 px-2 py-1 rounded-md font-medium ml-2">
                              {lead.offerType}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FunnelPage;
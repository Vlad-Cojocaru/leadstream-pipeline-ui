import React, { useState, useEffect } from 'react';
import { leadApiService, LeadData } from '@/services/leadApiService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Circle, Check, Clock, FileText, Handshake, Hammer, Trophy, Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';
import { useLeads } from '@/context/LeadsContext';
import { stagesService, Stage } from '@/services/stagesService';
import BottomNavigation from '@/components/BottomNavigation';

const stageIcons = {
  'New Lead': Circle,
  'Contacted': Check,
  'Follow-Up': Clock,
  'Proposal Sent': FileText,
  'Sold': Handshake,
  'In Progress': Hammer,
  'Completed': Trophy
};

const stageColorMap: { [id: number]: string } = {
  1: 'bg-blue-400 dark:bg-blue-600/40',
  2: 'bg-yellow-400 dark:bg-yellow-500/40',
  3: 'bg-purple-400 dark:bg-purple-600/40',
  4: 'bg-green-400 dark:bg-green-600/40',
  5: 'bg-teal-400 dark:bg-teal-600/40',
  6: 'bg-red-400 dark:bg-red-600/40',
  7: 'bg-emerald-400 dark:bg-emerald-600/40'
};

const stageBorderColorMap: { [id: number]: string } = {
  1: 'border-blue-400',
  2: 'border-yellow-400',
  3: 'border-purple-400',
  4: 'border-green-400',
  5: 'border-teal-400',
  6: 'border-red-400',
  7: 'border-emerald-400'
};

const stageFillColorMap: { [id: number]: string } = {
  1: 'bg-blue-50 text-blue-700',
  2: 'bg-yellow-50 text-yellow-700',
  3: 'bg-purple-50 text-purple-700',
  4: 'bg-green-50 text-green-700',
  5: 'bg-teal-50 text-teal-700',
  6: 'bg-red-50 text-red-700',
  7: 'bg-emerald-50 text-emerald-700'
};

// Remove stageNeonMap and instead use the same classes as in LeadList's stageColorMap for icon backgrounds
const stageTagDarkMap: { [id: number]: string } = {
  1: 'dark:bg-blue-500/50 dark:text-blue-300 dark:border-blue-500 bg-blue-50 text-blue-700 border-blue-200',
  2: 'dark:bg-yellow-500/50 dark:text-yellow-300 dark:border-yellow-500 bg-[#0f7969]/10 text-[#0f7969] border-[#0f7969]',
  3: 'dark:bg-purple-500/50 dark:text-purple-300 dark:border-purple-500 bg-purple-50 text-purple-700 border-purple-200',
  4: 'dark:bg-green-500/50 dark:text-green-300 dark:border-green-500 bg-green-50 text-green-700 border-green-200',
  5: 'dark:bg-teal-500/50 dark:text-teal-300 dark:border-teal-500 bg-teal-50 text-teal-700 border-teal-200',
  6: 'dark:bg-red-500/50 dark:text-red-300 dark:border-red-500 bg-red-50 text-red-700 border-red-200',
  7: 'dark:bg-emerald-500/50 dark:text-emerald-300 dark:border-emerald-500 bg-emerald-50 text-emerald-700 border-emerald-200'
};

// Update the bar background extraction logic to use 40% opacity for dark mode
const stageBarDarkBgMap: { [id: number]: string } = {
  1: 'dark:bg-blue-500/40 bg-blue-500/30',
  2: 'dark:bg-yellow-500/40 bg-yellow-500/30',
  3: 'dark:bg-purple-500/40 bg-purple-500/30',
  4: 'dark:bg-green-500/40 bg-green-500/30',
  5: 'dark:bg-teal-500/40 bg-teal-500/30',
  6: 'dark:bg-red-500/40 bg-red-500/30',
  7: 'dark:bg-emerald-500/40 bg-emerald-500/30'
};

// Add a new map for dropdown icon backgrounds
const stageDropdownIconBgMap: { [id: number]: string } = {
  1: 'bg-blue-100 dark:bg-blue-700/80 text-blue-700 dark:text-blue-200 border-blue-300 dark:border-blue-600',
  2: 'bg-yellow-100 dark:bg-yellow-600/80 text-yellow-700 dark:text-yellow-200 border-yellow-300 dark:border-yellow-500',
  3: 'bg-purple-100 dark:bg-purple-700/80 text-purple-700 dark:text-purple-200 border-purple-300 dark:border-purple-600',
  4: 'bg-green-100 dark:bg-green-700/80 text-green-700 dark:text-green-200 border-green-300 dark:border-green-600',
  5: 'bg-teal-100 dark:bg-teal-700/80 text-teal-700 dark:text-teal-200 border-teal-300 dark:border-teal-600',
  6: 'bg-red-100 dark:bg-red-700/80 text-red-700 dark:text-red-200 border-red-300 dark:border-red-600',
  7: 'bg-emerald-100 dark:bg-emerald-700/80 text-emerald-700 dark:text-emerald-200 border-emerald-300 dark:border-emerald-600'
};

// Set all dropdown icon backgrounds to green
const dropdownIconGreenBg = 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-200 border-emerald-400 dark:border-emerald-600';
// Set all dropdown icons to have no background, just a green border and green icon
const dropdownIconGreenOutline = 'bg-transparent border-2 border-emerald-600 text-emerald-600';

export default function FunnelPage() {
  const { leads, setLeads, isLoading, setIsLoading, mutationFlag, setMutationFlag } = useLeads();
  const { toast } = useToast();
  const { clientName, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, logout, loading: authLoadingBtn } = useAuth();
  const [stages, setStages] = useState<Stage[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<{ [stageId: number]: boolean }>({});

  const toggleDropdown = (stageId: number) => {
    setOpenDropdowns((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  useEffect(() => {
    let ignore = false;
    if (clientName && !authLoading && (leads.length === 0 || mutationFlag)) {
      setIsLoading(true);
      console.log('Fetching leads for', clientName, 'on', window.location.pathname);
      leadApiService.fetchLeads(clientName)
        .then(fetchedLeads => {
          if (!ignore) setLeads(fetchedLeads);
        })
        .catch(() => {
          if (!ignore) {
            toast({
              title: "Error",
              description: "Failed to load leads. Please refresh the page.",
              variant: "destructive",
            });
          }
        })
        .finally(() => {
          if (!ignore) {
            setIsLoading(false);
            setMutationFlag(false);
          }
        });
    }
    return () => { ignore = true; };
  }, [clientName, authLoading, mutationFlag, setLeads, setIsLoading, setMutationFlag, toast]);

  useEffect(() => {
    // Fetch stages from backend
    stagesService.fetchStages().then((fetchedStages) => setStages(fetchedStages));
  }, []);

  const getStageName = (stageId: number) => stages.find(s => s.idstage === stageId)?.name || '';

  const getStageCount = (stageId: number) => {
    return leads.filter(lead => lead.currentStage === stageId).length;
  };

  const getLeadsForStage = (stageId: number) => {
    return leads.filter(lead => lead.currentStage === stageId);
  };

  const getTotalLeads = () => {
    return leads.length;
  };

  const getStageWidth = (stageId: number) => {
    const count = getStageCount(stageId);
    const total = getTotalLeads();
    if (total === 0) return 100;
    return Math.max((count / total) * 100, 10); // Minimum 10% width for visibility
  };

  if (isLoading && leads.length === 0) {
    // Only show spinner if this is the very first load or after mutation
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
              className="bg-white dark:bg-[#23272f] border border-[#0f7969] text-[#0f7969] dark:text-white rounded-full p-1.5 shadow hover:bg-[#0f7969]/10 dark:hover:bg-[#0f7969]/30 transition"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            {isLoggedIn && !authLoadingBtn && (
              <button
                onClick={() => {
                  logout();
                }}
                className="bg-red-500 text-white px-2 py-1.5 rounded hover:bg-red-600 text-xs font-medium shadow"
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
              const count = getStageCount(stage.idstage);
              const width = getStageWidth(stage.idstage);
              const Icon = stageIcons[stage.name as keyof typeof stageIcons];
              // Use tag style for icon background and bar color
              const tagClass = stageTagDarkMap[stage.idstage] || 'dark:bg-blue-500/30 dark:text-blue-300 dark:border-blue-500 bg-blue-50 text-blue-700 border-blue-200';
              // Use 40% opacity for bar background in dark mode
              const barBgClass = stageBarDarkBgMap[stage.idstage] || 'dark:bg-blue-500/40 bg-blue-50';
              return (
                <div key={stage.idstage} className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                  {/* Mobile Layout */}
                  <div className="md:hidden w-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {/* Tag-style icon background, no shadow */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${tagClass} transition-all duration-300`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {stage.name}
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
                    {/* Neon-like colored bar, 40% opacity in dark mode, no glow, no border */}
                    <div className="h-6 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${barBgClass}`} 
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-center gap-4 w-full">
                    <div className="w-36 text-right shrink-0">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {stage.name}
                      </span>
                    </div>
                    <div className="w-96 lg:w-[500px] relative flex items-center gap-3">
                      {/* Tag-style icon background, no shadow */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${tagClass} transition-all duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 flex items-center justify-between px-4 rounded-lg ${barBgClass}`} 
                            style={{ width: `${width}%` }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold drop-shadow-sm text-white">
                                {count}
                              </span>
                            </div>
                            {count > 0 && (
                              <span className="text-sm font-semibold drop-shadow-sm text-white">
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
            const count = getStageCount(stage.idstage);
            const Icon = stageIcons[stage.name as keyof typeof stageIcons];
            const leadsInStage = getLeadsForStage(stage.idstage);
            const isOpen = openDropdowns[stage.idstage];
            return (
              <div key={stage.idstage} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 border border-gray-200 dark:border-zinc-700">
                <button
                  className="w-full flex items-center gap-3 mb-2 focus:outline-none"
                  onClick={() => toggleDropdown(stage.idstage)}
                  aria-expanded={isOpen}
                  aria-controls={`dropdown-${stage.idstage}`}
                >
                  <div className={`w-8 h-8 ${dropdownIconGreenOutline} rounded-full flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-medium text-[#16161d] dark:text-white flex-1 text-left">{stage.name}</h3>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#16161d] dark:text-white">{count}</span>
                  <span className="text-sm text-gray-500">
                    {getTotalLeads() > 0 ? `${((count / getTotalLeads()) * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
                {isOpen && (
                  <div id={`dropdown-${stage.idstage}`} className="mt-4 border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-2">
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
      <BottomNavigation />
    </div>
  );
}
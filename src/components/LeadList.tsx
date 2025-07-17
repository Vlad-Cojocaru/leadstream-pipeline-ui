
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, ArrowRight, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  offerType: string;
  currentStage: string;
  stageIndex: number;
}

interface LeadListProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
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

export const LeadList: React.FC<LeadListProps> = ({ leads, onLeadSelect }) => {
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const filteredLeads = selectedStage === 'all' 
    ? leads 
    : leads.filter(lead => lead.currentStage === selectedStage);

  const getStageCount = (stage: string) => {
    return leads.filter(lead => lead.currentStage === stage).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6 shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/21ca0443-32f3-4f4b-a21c-bec7c180b4f7.png" 
            alt="CurateFlow Logo" 
            className="w-8 h-8"
          />
          <h1 className="text-2xl font-brand text-foreground">Lead Stream Pro</h1>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-muted-foreground">Manage your pipeline efficiently</p>
          <Badge variant="outline" className="border-primary text-primary bg-primary/5">
            {filteredLeads.length} {selectedStage === 'all' ? 'Total' : selectedStage} Leads
          </Badge>
        </div>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages ({leads.length})</SelectItem>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage} ({getStageCount(stage)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Lead List */}
      <div className="p-4 space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {selectedStage === 'all' ? 'No leads found' : `No leads in ${selectedStage} stage`}
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <Card 
              key={lead.id}
              className="bg-card border border-border hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => onLeadSelect(lead)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {lead.name}
                      </h3>
                      <Badge 
                        className={`${stageStyles[lead.currentStage as keyof typeof stageStyles]} text-xs border font-medium shrink-0`}
                      >
                        {lead.currentStage}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 shrink-0" />
                        <span className="truncate">{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    </div>
                    
                    {lead.offerType && (
                      <div className="mt-3">
                        <span className="text-xs text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-md font-medium">
                          {lead.offerType}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-4" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

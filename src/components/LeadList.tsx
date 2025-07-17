
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, ArrowRight } from 'lucide-react';

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

const stageColors = {
  'New Lead': 'bg-gray-500',
  'Contacted': 'bg-yellow-500',
  'Follow-Up': 'bg-orange-500',
  'Proposal Sent': 'bg-blue-500',
  'Sold': 'bg-green-500',
  'In Progress': 'bg-purple-500',
  'Completed': 'bg-emerald-500'
};

export const LeadList: React.FC<LeadListProps> = ({ leads, onLeadSelect }) => {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Lead Stream Pro</h1>
        <Badge variant="outline" className="text-sm">
          {leads.length} Active Leads
        </Badge>
      </div>
      
      <div className="space-y-3">
        {leads.map((lead) => (
          <Card 
            key={lead.id}
            className="bg-card border-border hover:border-primary/50 transition-all duration-200 cursor-pointer group"
            onClick={() => onLeadSelect(lead)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                      {lead.name}
                    </h3>
                    <Badge 
                      className={`${stageColors[lead.currentStage as keyof typeof stageColors]} text-white text-xs`}
                    >
                      {lead.currentStage}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{lead.email}</span>
                    </div>
                  </div>
                  
                  {lead.offerType && (
                    <div className="mt-2">
                      <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                        {lead.offerType}
                      </span>
                    </div>
                  )}
                </div>
                
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

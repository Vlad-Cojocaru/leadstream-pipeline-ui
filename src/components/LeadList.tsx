
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
  'New Lead': 'bg-gray-100 text-gray-700 border-gray-200',
  'Contacted': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Follow-Up': 'bg-orange-100 text-orange-800 border-orange-200',
  'Proposal Sent': 'bg-blue-100 text-blue-800 border-blue-200',
  'Sold': 'bg-green-100 text-green-800 border-green-200',
  'In Progress': 'bg-purple-100 text-purple-800 border-purple-200',
  'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200'
};

export const LeadList: React.FC<LeadListProps> = ({ leads, onLeadSelect }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-6">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/21ca0443-32f3-4f4b-a21c-bec7c180b4f7.png" 
            alt="CurateFlow Logo" 
            className="w-8 h-8"
          />
          <h1 className="text-2xl font-brand text-foreground">Lead Stream Pro</h1>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-muted-foreground">Manage your leads efficiently</p>
          <Badge variant="outline" className="border-accent text-accent bg-accent/5">
            {leads.length} Active Leads
          </Badge>
        </div>
      </div>
      
      {/* Lead List */}
      <div className="p-4 space-y-3">
        {leads.map((lead) => (
          <Card 
            key={lead.id}
            className="bg-white border border-border hover:border-accent hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => onLeadSelect(lead)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                      {lead.name}
                    </h3>
                    <Badge 
                      className={`${stageColors[lead.currentStage as keyof typeof stageColors]} text-xs border font-medium shrink-0`}
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
                
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0 ml-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

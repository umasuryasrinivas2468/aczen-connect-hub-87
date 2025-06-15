
import React from 'react';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Communication {
  id: string;
  contact_id: string;
  contact_name: string;
  contact_company: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  timestamp: string;
  summary: string;
  notes: string;
  user_id: string;
  user_name: string;
  created_at: Date;
}

interface CommunicationTimelineProps {
  communications: Communication[];
  onAddFollowUp?: (communicationId: string) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'call': return '📞';
    case 'email': return '📧';
    case 'meeting': return '🤝';
    case 'note': return '📝';
    default: return '💬';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'call': return 'bg-green-100 text-green-800';
    case 'email': return 'bg-blue-100 text-blue-800';
    case 'meeting': return 'bg-purple-100 text-purple-800';
    case 'note': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRelativeDate = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date)) return format(date, 'EEEE');
  return format(date, 'MMM d, yyyy');
};

const CommunicationTimeline = ({ communications, onAddFollowUp }: CommunicationTimelineProps) => {
  // Group communications by date
  const groupedCommunications = communications.reduce((groups, comm) => {
    const date = format(new Date(comm.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(comm);
    return groups;
  }, {} as Record<string, Communication[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedCommunications).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date} className="relative">
          {/* Date Header */}
          <div className="sticky top-0 z-10 bg-gray-50 py-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {getRelativeDate(new Date(date))}
            </h3>
            <div className="h-px bg-gray-200 mt-2" />
          </div>

          {/* Communications for this date */}
          <div className="space-y-3 pl-4">
            {groupedCommunications[date]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((comm, index) => (
                <div key={comm.id} className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
                  
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-6 w-3 h-3 bg-white border-2 border-gray-300 rounded-full transform -translate-x-1/2" />

                  {/* Communication Card */}
                  <Card className="ml-6 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeColor(comm.type)}>
                              {getTypeIcon(comm.type)} {comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(new Date(comm.timestamp), 'h:mm a')}
                            </span>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-1">
                            {comm.contact_name} • {comm.contact_company}
                          </h4>
                          
                          <p className="text-gray-700 mb-2">{comm.summary}</p>
                          
                          {comm.notes && (
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-gray-200">
                              {comm.notes}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {comm.user_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">
                                Logged by {comm.user_name || 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onAddFollowUp?.(comm.id)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Follow-up Task
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Edit Communication
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete Communication
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunicationTimeline;

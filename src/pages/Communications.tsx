
import React, { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import CommunicationLogModal from "@/components/CommunicationLogModal";
import CommunicationTimeline from "@/components/CommunicationTimeline";
import CommunicationFilters from "@/components/CommunicationFilters";
import { isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

const Communications = () => {
  const { communications, contacts } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [contactFilter, setContactFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Filter communications based on active filters
  const filteredCommunications = useMemo(() => {
    return communications.filter(comm => {
      // Type filter
      if (typeFilter !== 'all' && comm.type !== typeFilter) {
        return false;
      }

      // Contact filter
      if (contactFilter !== 'all' && comm.contact_id !== contactFilter) {
        return false;
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const commDate = new Date(comm.timestamp);
        
        if (dateRange.from && isBefore(commDate, startOfDay(dateRange.from))) {
          return false;
        }
        
        if (dateRange.to && isAfter(commDate, endOfDay(dateRange.to))) {
          return false;
        }
      }

      return true;
    });
  }, [communications, typeFilter, contactFilter, dateRange]);

  // Calculate stats from filtered communications
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyComms = filteredCommunications.filter(comm => {
      const commDate = new Date(comm.timestamp);
      return commDate.getMonth() === currentMonth && commDate.getFullYear() === currentYear;
    });

    return {
      total: monthlyComms.length,
      calls: monthlyComms.filter(c => c.type === 'call').length,
      emails: monthlyComms.filter(c => c.type === 'email').length,
      meetings: monthlyComms.filter(c => c.type === 'meeting').length,
    };
  }, [filteredCommunications]);

  const handleClearFilters = () => {
    setTypeFilter('all');
    setContactFilter('all');
    setDateRange({});
  };

  const handleAddFollowUp = (communicationId: string) => {
    // This would integrate with the tasks system
    console.log('Adding follow-up task for communication:', communicationId);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
            <p className="text-gray-600 mt-1">Track all your client interactions</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Log Communication
          </Button>
        </div>

        {/* Communication Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.calls}</div>
              <p className="text-xs text-gray-500">Phone calls</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.emails}</div>
              <p className="text-xs text-gray-500">Email communications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.meetings}</div>
              <p className="text-xs text-gray-500">In-person meetings</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <CommunicationFilters
            typeFilter={typeFilter}
            contactFilter={contactFilter}
            dateRange={dateRange}
            contacts={contacts}
            onTypeFilterChange={setTypeFilter}
            onContactFilterChange={setContactFilter}
            onDateRangeChange={setDateRange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Communication Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Timeline</CardTitle>
            <CardDescription>
              {filteredCommunications.length > 0 
                ? `Showing ${filteredCommunications.length} communication${filteredCommunications.length !== 1 ? 's' : ''}`
                : "No communications match your current filters"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCommunications.length > 0 ? (
              <div className="max-h-[600px] overflow-y-auto">
                <CommunicationTimeline 
                  communications={filteredCommunications}
                  onAddFollowUp={handleAddFollowUp}
                />
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No communications found</h3>
                <p className="text-gray-400 mb-6">
                  {communications.length === 0 
                    ? "Start tracking your client interactions"
                    : "Try adjusting your filters or log a new communication"
                  }
                </p>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Communication
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Communication Log Modal */}
        <CommunicationLogModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen} 
        />
      </div>
    </Layout>
  );
};

export default Communications;

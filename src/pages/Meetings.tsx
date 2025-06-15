
import React, { useState } from 'react';
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, Users, Video, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { useData } from "@/contexts/DataContext";
import ScheduleMeetingModal from "@/components/ScheduleMeetingModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Meeting {
  id: string;
  title: string;
  contact_id: string;
  contact_name: string;
  date: Date;
  duration: number;
  description: string;
  meet_link: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: Date;
}

const Meetings = () => {
  const { contacts, meetings, addMeeting } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [selectedDayMeetings, setSelectedDayMeetings] = useState<Meeting[]>([]);

  const handleScheduleMeeting = async (meetingData: any) => {
    await addMeeting(meetingData);
    setIsModalOpen(false);
  };

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(meeting => isSameDay(meeting.date, date));
  };

  const handleDayClick = (date: Date) => {
    const dayMeetings = getMeetingsForDate(date);
    setSelectedDate(date);
    setSelectedDayMeetings(dayMeetings);
    setIsDayModalOpen(true);
  };

  const handleScheduleFromDay = () => {
    setIsDayModalOpen(false);
    setIsModalOpen(true);
  };

  const getTotalMeetings = () => meetings.length;
  const getUpcomingMeetings = () => meetings.filter(m => m.date > new Date()).length;
  const getCompletedMeetings = () => meetings.filter(m => m.status === 'completed').length;

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map(day => {
          const dayMeetings = getMeetingsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div
              key={day.toISOString()}
              className={`min-h-24 p-1 border border-gray-100 cursor-pointer hover:bg-gray-50 ${
                !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
              } ${isToday(day) ? 'bg-blue-50 border-blue-200' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayMeetings.slice(0, 2).map(meeting => (
                  <div
                    key={meeting.id}
                    className="text-xs p-1 bg-purple-100 text-purple-800 rounded truncate"
                  >
                    {format(meeting.date, 'HH:mm')} {meeting.title}
                  </div>
                ))}
                {dayMeetings.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayMeetings.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekDays = eachDayOfInterval({ 
      start: weekStart, 
      end: endOfWeek(currentDate) 
    });

    return (
      <div className="grid grid-cols-8 gap-1">
        {/* Time column header */}
        <div className="p-2"></div>
        
        {/* Day headers */}
        {weekDays.map(day => (
          <div key={day.toISOString()} className="p-2 text-center border-b">
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div className={`text-lg ${isToday(day) ? 'text-blue-600 font-bold' : ''}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}

        {/* Time slots */}
        {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
          <React.Fragment key={hour}>
            <div className="p-2 text-sm text-gray-500 border-r">
              {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
            </div>
            {weekDays.map(day => {
              const dayMeetings = getMeetingsForDate(day).filter(meeting => 
                meeting.date.getHours() === hour
              );
              
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="min-h-12 p-1 border border-gray-100 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleDayClick(new Date(day.setHours(hour, 0, 0, 0)))}
                >
                  {dayMeetings.map(meeting => (
                    <div
                      key={meeting.id}
                      className="text-xs p-1 bg-purple-100 text-purple-800 rounded mb-1"
                    >
                      {meeting.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
            <p className="text-gray-600 mt-1">Schedule and manage client meetings</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Meetings</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalMeetings()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getUpcomingMeetings()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCompletedMeetings()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
              <Video className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {meetings.filter(m => isSameMonth(m.date, new Date())).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={view === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('month')}
                >
                  Month
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('week')}
                >
                  Week
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === 'month' ? renderMonthView() : renderWeekView()}
          </CardContent>
        </Card>

        {/* Day Details Modal */}
        <Dialog open={isDayModalOpen} onOpenChange={setIsDayModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {selectedDayMeetings.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Scheduled Meetings</h3>
                  {selectedDayMeetings.map((meeting) => (
                    <div key={meeting.id} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                          <p className="text-sm text-gray-600">{meeting.contact_name}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {format(meeting.date, 'HH:mm')} ({meeting.duration} min)
                            </div>
                            <Badge variant={
                              meeting.status === 'scheduled' ? 'default' :
                              meeting.status === 'completed' ? 'secondary' : 'destructive'
                            }>
                              {meeting.status}
                            </Badge>
                          </div>
                          {meeting.description && (
                            <p className="text-sm text-gray-600 mt-2">{meeting.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {meeting.meet_link && (
                        <div className="mt-3 pt-3 border-t">
                          <a 
                            href={meeting.meet_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                          >
                            <Video className="h-4 w-4" />
                            Join Google Meet
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No meetings scheduled for this day</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button 
                  onClick={handleScheduleFromDay}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Schedule Meeting Modal */}
        <ScheduleMeetingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSchedule={handleScheduleMeeting}
          contacts={contacts}
          selectedDate={selectedDate}
        />
      </div>
    </Layout>
  );
};

export default Meetings;

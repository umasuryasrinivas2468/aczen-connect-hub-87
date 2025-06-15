
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Video, Mail } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
}

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

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (meetingData: any) => void;
  contacts: Contact[];
  meetings: Meeting[];
  selectedDate?: Date | null;
}

const ScheduleMeetingModal = ({ 
  isOpen, 
  onClose, 
  onSchedule, 
  contacts, 
  meetings,
  selectedDate 
}: ScheduleMeetingModalProps) => {
  const [formData, setFormData] = useState({
    contact_id: '',
    contact_name: '',
    title: '',
    date: selectedDate || new Date(),
    time: '14:00',
    duration: 30,
    description: '',
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  const handleContactChange = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    setFormData(prev => ({
      ...prev,
      contact_id: contactId,
      contact_name: contact ? `${contact.name} - ${contact.company}` : '',
    }));
  };

  const checkTimeConflict = (meetingDateTime: Date, duration: number) => {
    const meetingEnd = new Date(meetingDateTime.getTime() + duration * 60000);
    
    return meetings.some(existing => {
      if (existing.status === 'cancelled') return false;
      
      const existingStart = new Date(existing.date);
      const existingEnd = new Date(existingStart.getTime() + existing.duration * 60000);
      
      // Check for overlap
      return (meetingDateTime < existingEnd && meetingEnd > existingStart);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contact_id || !formData.title || !formData.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Combine date and time
    const [hours, minutes] = formData.time.split(':').map(Number);
    const meetingDateTime = new Date(formData.date);
    meetingDateTime.setHours(hours, minutes, 0, 0);

    // Check if meeting is in the past
    if (isBefore(meetingDateTime, new Date())) {
      toast({
        title: "Error",
        description: "Cannot schedule meetings in the past",
        variant: "destructive",
      });
      return;
    }

    // Check for time conflicts
    if (checkTimeConflict(meetingDateTime, formData.duration)) {
      toast({
        title: "Time Conflict",
        description: "Another meeting is already scheduled at this time",
        variant: "destructive",
      });
      return;
    }

    const meetingData = {
      ...formData,
      date: meetingDateTime,
    };

    onSchedule(meetingData);
    
    toast({
      title: "Meeting Scheduled",
      description: `Meeting with ${formData.contact_name} has been scheduled for ${format(meetingDateTime, 'PPP p')}`,
    });

    // Reset form
    setFormData({
      contact_id: '',
      contact_name: '',
      title: '',
      date: new Date(),
      time: '14:00',
      duration: 30,
      description: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-purple-600" />
            Schedule Meeting
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Selection */}
          <div className="space-y-2">
            <Label htmlFor="contact">Contact *</Label>
            <Select value={formData.contact_id} onValueChange={handleContactChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name} - {contact.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Meeting Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Product Demo, Project Kickoff"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select 
              value={formData.duration.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    15 minutes
                  </div>
                </SelectItem>
                <SelectItem value="30">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    30 minutes
                  </div>
                </SelectItem>
                <SelectItem value="60">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    1 hour
                  </div>
                </SelectItem>
                <SelectItem value="90">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    1.5 hours
                  </div>
                </SelectItem>
                <SelectItem value="120">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    2 hours
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description/Agenda</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Meeting agenda, topics to discuss..."
              rows={3}
            />
          </div>

          {/* Auto-generated Google Meet Link Info */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800">
              <Video className="h-4 w-4" />
              <span className="text-sm font-medium">Google Meet Link</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              A Google Meet link will be automatically generated and included in the meeting invite.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
              <Mail className="h-4 w-4 mr-2" />
              Schedule & Send Invite
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingModal;

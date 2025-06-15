
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CommunicationFiltersProps {
  typeFilter: string;
  contactFilter: string;
  dateRange: { from?: Date; to?: Date };
  contacts: Array<{ id: string; name: string; company: string }>;
  onTypeFilterChange: (value: string) => void;
  onContactFilterChange: (value: string) => void;
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  onClearFilters: () => void;
}

const CommunicationFilters = ({
  typeFilter,
  contactFilter,
  dateRange,
  contacts,
  onTypeFilterChange,
  onContactFilterChange,
  onDateRangeChange,
  onClearFilters,
}: CommunicationFiltersProps) => {
  const hasActiveFilters = typeFilter !== 'all' || contactFilter !== 'all' || dateRange.from || dateRange.to;

  return (
    <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Filter by:</span>
      </div>

      {/* Type Filter */}
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="call">📞 Calls</SelectItem>
          <SelectItem value="email">📧 Emails</SelectItem>
          <SelectItem value="meeting">🤝 Meetings</SelectItem>
          <SelectItem value="note">📝 Notes</SelectItem>
        </SelectContent>
      </Select>

      {/* Contact Filter */}
      <Select value={contactFilter} onValueChange={onContactFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Contact" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Contacts</SelectItem>
          {contacts.map((contact) => (
            <SelectItem key={contact.id} value={contact.id}>
              {contact.name} - {contact.company}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => onDateRangeChange(range || {})}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default CommunicationFilters;

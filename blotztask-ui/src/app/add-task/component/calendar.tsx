'use client';

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  value: Date | undefined; 
  onChange: (_date: Date | undefined) => void; 
  error?: string; 
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, error }) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange} // Bind the `onSelect` callback
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

import * as React from 'react';
import { format, addMonths, differenceInDays, subMonths } from 'date-fns';
import { th } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

const MAX_DAYS = 31; // Maximum 1 month

const DateRangePicker = ({ dateRange, onDateRangeChange, className }: DateRangePickerProps) => {
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(dateRange);

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const daysDiff = differenceInDays(range.to, range.from);
      
      if (daysDiff > MAX_DAYS) {
        toast({
          title: "ช่วงเวลาเกินกำหนด",
          description: `กรุณาเลือกช่วงเวลาไม่เกิน 1 เดือน (${MAX_DAYS} วัน)`,
          variant: "destructive",
        });
        // Auto-adjust end date to max 1 month from start
        const adjustedEnd = addMonths(range.from, 1);
        setTempRange({ from: range.from, to: adjustedEnd });
        onDateRangeChange({ from: range.from, to: adjustedEnd });
        return;
      }
    }
    
    setTempRange(range);
    if (range?.from && range?.to) {
      onDateRangeChange(range);
    }
  };

  const formatThaiDate = (date: Date) => {
    const day = date.getDate();
    const month = format(date, 'MMMM', { locale: th });
    const year = date.getFullYear() + 543; // Convert to Buddhist Era
    return `${day} ${month} ${year}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 px-4 gap-2 font-normal justify-start",
            !dateRange && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">ช่วงเวลา:</span>
          <span className="text-foreground font-medium">
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {formatThaiDate(dateRange.from)} - {formatThaiDate(dateRange.to)}
                </>
              ) : (
                formatThaiDate(dateRange.from)
              )
            ) : (
              "เลือกช่วงเวลา"
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b border-border">
          <p className="text-sm text-muted-foreground">
            เลือกช่วงเวลาสูงสุด 1 เดือน ({MAX_DAYS} วัน)
          </p>
        </div>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={tempRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          locale={th}
          className={cn("p-3 pointer-events-auto")}
          disabled={(date) => date > new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;

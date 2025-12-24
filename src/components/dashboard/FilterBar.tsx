import { useState } from 'react';
import { subMonths } from 'date-fns';
import { DateRange } from 'react-day-picker';
import DateRangePicker from './DateRangePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

const FilterBar = ({ onDateRangeChange }: FilterBarProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onDateRangeChange?.(range);
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6 animate-fade-in">
      <p className="text-sm text-muted-foreground mb-3">ตัวกรอง</p>
      <div className="flex flex-wrap gap-3">
        {/* Date Range Picker */}
        <DateRangePicker 
          dateRange={dateRange} 
          onDateRangeChange={handleDateRangeChange} 
        />

        {/* Age Range Filter */}
        <FilterSelect label="ช่วงอายุ" placeholder="ทั้งหมด" />

        {/* Region Filter */}
        <FilterSelect label="ภูมิภาค" placeholder="ทั้งหมด" />

        {/* Province Filter */}
        <FilterSelect label="จังหวัด" placeholder="ทั้งหมด" />

        {/* Occupation Filter */}
        <FilterSelect label="อาชีพ" placeholder="ทั้งหมด" />
      </div>
    </div>
  );
};

interface FilterSelectProps {
  label: string;
  placeholder: string;
}

const FilterSelect = ({ label, placeholder }: FilterSelectProps) => {
  return (
    <Select defaultValue="all">
      <SelectTrigger className="h-10 w-auto min-w-[140px] gap-2 bg-card border-input">
        <span className="text-foreground">{label}:</span>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">ทั้งหมด</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FilterBar;

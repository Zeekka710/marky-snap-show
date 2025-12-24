import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  dateRange?: string;
}

const FilterBar = ({ dateRange = "1 มกราคม 2568 - 31 ธันวาคม 2568" }: FilterBarProps) => {
  return (
    <div className="bg-card rounded-lg p-4 mb-6 animate-fade-in">
      <p className="text-sm text-muted-foreground mb-3">ตัวกรอง</p>
      <div className="flex flex-wrap gap-3">
        {/* Date Range */}
        <Button variant="outline" className="h-10 px-4 gap-2 font-normal">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">ช่วงเวลา:</span>
          <span className="text-foreground font-medium">{dateRange}</span>
        </Button>

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

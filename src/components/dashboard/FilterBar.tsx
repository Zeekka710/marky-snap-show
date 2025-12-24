import { useState, useEffect } from 'react';
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

export interface FilterValues {
  dateRange: DateRange | undefined;
  ageRange: string;
  region: string;
  province: string;
  occupation: string;
}

interface FilterBarProps {
  onFilterChange?: (filters: FilterValues) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

// Age range options
const ageRangeOptions = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: '7-15', label: '7-15 ปี' },
  { value: '16-30', label: '16-30 ปี' },
  { value: '31-45', label: '31-45 ปี' },
  { value: '46-60', label: '46-60 ปี' },
  { value: '60+', label: '60 ปีขึ้นไป' },
];

// Region options
const regionOptions = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'central', label: 'ภาคกลาง' },
  { value: 'north', label: 'ภาคเหนือ' },
  { value: 'northeast', label: 'ภาคตะวันออกเฉียงเหนือ' },
  { value: 'east', label: 'ภาคตะวันออก' },
  { value: 'west', label: 'ภาคตะวันตก' },
  { value: 'south', label: 'ภาคใต้' },
];

// Province options by region
const provincesByRegion: Record<string, { value: string; label: string }[]> = {
  all: [{ value: 'all', label: 'ทั้งหมด' }],
  central: [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'กรุงเทพมหานคร', label: 'กรุงเทพมหานคร' },
    { value: 'นนทบุรี', label: 'นนทบุรี' },
    { value: 'ปทุมธานี', label: 'ปทุมธานี' },
    { value: 'สมุทรปราการ', label: 'สมุทรปราการ' },
    { value: 'พระนครศรีอยุธยา', label: 'พระนครศรีอยุธยา' },
    { value: 'นครปฐม', label: 'นครปฐม' },
    { value: 'สระบุรี', label: 'สระบุรี' },
    { value: 'ลพบุรี', label: 'ลพบุรี' },
  ],
  north: [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'เชียงใหม่', label: 'เชียงใหม่' },
    { value: 'เชียงราย', label: 'เชียงราย' },
    { value: 'ลำปาง', label: 'ลำปาง' },
    { value: 'ลำพูน', label: 'ลำพูน' },
    { value: 'แม่ฮ่องสอน', label: 'แม่ฮ่องสอน' },
    { value: 'พิษณุโลก', label: 'พิษณุโลก' },
    { value: 'เพชรบูรณ์', label: 'เพชรบูรณ์' },
    { value: 'นครสวรรค์', label: 'นครสวรรค์' },
  ],
  northeast: [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'นครราชสีมา', label: 'นครราชสีมา' },
    { value: 'ขอนแก่น', label: 'ขอนแก่น' },
    { value: 'อุดรธานี', label: 'อุดรธานี' },
    { value: 'อุบลราชธานี', label: 'อุบลราชธานี' },
    { value: 'บุรีรัมย์', label: 'บุรีรัมย์' },
    { value: 'สุรินทร์', label: 'สุรินทร์' },
    { value: 'ศรีสะเกษ', label: 'ศรีสะเกษ' },
    { value: 'ร้อยเอ็ด', label: 'ร้อยเอ็ด' },
  ],
  east: [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'ชลบุรี', label: 'ชลบุรี' },
    { value: 'ระยอง', label: 'ระยอง' },
    { value: 'จันทบุรี', label: 'จันทบุรี' },
    { value: 'ตราด', label: 'ตราด' },
    { value: 'ฉะเชิงเทรา', label: 'ฉะเชิงเทรา' },
    { value: 'ปราจีนบุรี', label: 'ปราจีนบุรี' },
    { value: 'สระแก้ว', label: 'สระแก้ว' },
  ],
  west: [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'กาญจนบุรี', label: 'กาญจนบุรี' },
    { value: 'ราชบุรี', label: 'ราชบุรี' },
    { value: 'เพชรบุรี', label: 'เพชรบุรี' },
    { value: 'ประจวบคีรีขันธ์', label: 'ประจวบคีรีขันธ์' },
    { value: 'ตาก', label: 'ตาก' },
  ],
  south: [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'สงขลา', label: 'สงขลา' },
    { value: 'ภูเก็ต', label: 'ภูเก็ต' },
    { value: 'สุราษฎร์ธานี', label: 'สุราษฎร์ธานี' },
    { value: 'นครศรีธรรมราช', label: 'นครศรีธรรมราช' },
    { value: 'กระบี่', label: 'กระบี่' },
    { value: 'ตรัง', label: 'ตรัง' },
    { value: 'พัทลุง', label: 'พัทลุง' },
  ],
};

// Occupation options
const occupationOptions = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'พนักงานบริษัทเอกชน', label: 'พนักงานบริษัทเอกชน' },
  { value: 'ข้าราชการ', label: 'ข้าราชการ' },
  { value: 'พนักงานรัฐวิสาหกิจ', label: 'พนักงานรัฐวิสาหกิจ' },
  { value: 'เจ้าของกิจการ', label: 'เจ้าของกิจการ / ผู้ประกอบการ' },
  { value: 'ฟรีแลนซ์', label: 'ฟรีแลนซ์ / อาชีพอิสระ' },
  { value: 'นักศึกษา', label: 'นักศึกษา' },
  { value: 'แพทย์', label: 'แพทย์ / พยาบาล' },
  { value: 'ครู', label: 'ครู / อาจารย์' },
  { value: 'วิศวกร', label: 'วิศวกร' },
  { value: 'เกษตรกร', label: 'เกษตรกร' },
  { value: 'อื่นๆ', label: 'อื่นๆ' },
];

const FilterBar = ({ onFilterChange, onDateRangeChange }: FilterBarProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  const [ageRange, setAgeRange] = useState('all');
  const [region, setRegion] = useState('all');
  const [province, setProvince] = useState('all');
  const [occupation, setOccupation] = useState('all');

  // Get province options based on selected region
  const currentProvinceOptions = provincesByRegion[region] || provincesByRegion.all;

  // Reset province when region changes
  useEffect(() => {
    setProvince('all');
  }, [region]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange?.({
      dateRange,
      ageRange,
      region,
      province,
      occupation,
    });
  }, [dateRange, ageRange, region, province, occupation, onFilterChange]);

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
        <Select value={ageRange} onValueChange={setAgeRange}>
          <SelectTrigger className="h-10 w-auto min-w-[160px] gap-2 bg-card border-input">
            <span className="text-foreground">ช่วงอายุ:</span>
            <SelectValue placeholder="ทั้งหมด" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {ageRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Region Filter */}
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="h-10 w-auto min-w-[180px] gap-2 bg-card border-input">
            <span className="text-foreground">ภูมิภาค:</span>
            <SelectValue placeholder="ทั้งหมด" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {regionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Province Filter */}
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger className="h-10 w-auto min-w-[180px] gap-2 bg-card border-input">
            <span className="text-foreground">จังหวัด:</span>
            <SelectValue placeholder="ทั้งหมด" />
          </SelectTrigger>
          <SelectContent className="bg-popover max-h-[300px]">
            {currentProvinceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Occupation Filter */}
        <Select value={occupation} onValueChange={setOccupation}>
          <SelectTrigger className="h-10 w-auto min-w-[200px] gap-2 bg-card border-input">
            <span className="text-foreground">อาชีพ:</span>
            <SelectValue placeholder="ทั้งหมด" />
          </SelectTrigger>
          <SelectContent className="bg-popover max-h-[300px]">
            {occupationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;

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

// All 77 provinces of Thailand
const allProvinces = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'กรุงเทพมหานคร', label: 'กรุงเทพมหานคร' },
  { value: 'กระบี่', label: 'กระบี่' },
  { value: 'กาญจนบุรี', label: 'กาญจนบุรี' },
  { value: 'กาฬสินธุ์', label: 'กาฬสินธุ์' },
  { value: 'กำแพงเพชร', label: 'กำแพงเพชร' },
  { value: 'ขอนแก่น', label: 'ขอนแก่น' },
  { value: 'จันทบุรี', label: 'จันทบุรี' },
  { value: 'ฉะเชิงเทรา', label: 'ฉะเชิงเทรา' },
  { value: 'ชลบุรี', label: 'ชลบุรี' },
  { value: 'ชัยนาท', label: 'ชัยนาท' },
  { value: 'ชัยภูมิ', label: 'ชัยภูมิ' },
  { value: 'ชุมพร', label: 'ชุมพร' },
  { value: 'เชียงราย', label: 'เชียงราย' },
  { value: 'เชียงใหม่', label: 'เชียงใหม่' },
  { value: 'ตรัง', label: 'ตรัง' },
  { value: 'ตราด', label: 'ตราด' },
  { value: 'ตาก', label: 'ตาก' },
  { value: 'นครนายก', label: 'นครนายก' },
  { value: 'นครปฐม', label: 'นครปฐม' },
  { value: 'นครพนม', label: 'นครพนม' },
  { value: 'นครราชสีมา', label: 'นครราชสีมา' },
  { value: 'นครศรีธรรมราช', label: 'นครศรีธรรมราช' },
  { value: 'นครสวรรค์', label: 'นครสวรรค์' },
  { value: 'นนทบุรี', label: 'นนทบุรี' },
  { value: 'นราธิวาส', label: 'นราธิวาส' },
  { value: 'น่าน', label: 'น่าน' },
  { value: 'บึงกาฬ', label: 'บึงกาฬ' },
  { value: 'บุรีรัมย์', label: 'บุรีรัมย์' },
  { value: 'ปทุมธานี', label: 'ปทุมธานี' },
  { value: 'ประจวบคีรีขันธ์', label: 'ประจวบคีรีขันธ์' },
  { value: 'ปราจีนบุรี', label: 'ปราจีนบุรี' },
  { value: 'ปัตตานี', label: 'ปัตตานี' },
  { value: 'พระนครศรีอยุธยา', label: 'พระนครศรีอยุธยา' },
  { value: 'พะเยา', label: 'พะเยา' },
  { value: 'พังงา', label: 'พังงา' },
  { value: 'พัทลุง', label: 'พัทลุง' },
  { value: 'พิจิตร', label: 'พิจิตร' },
  { value: 'พิษณุโลก', label: 'พิษณุโลก' },
  { value: 'เพชรบุรี', label: 'เพชรบุรี' },
  { value: 'เพชรบูรณ์', label: 'เพชรบูรณ์' },
  { value: 'แพร่', label: 'แพร่' },
  { value: 'ภูเก็ต', label: 'ภูเก็ต' },
  { value: 'มหาสารคาม', label: 'มหาสารคาม' },
  { value: 'มุกดาหาร', label: 'มุกดาหาร' },
  { value: 'แม่ฮ่องสอน', label: 'แม่ฮ่องสอน' },
  { value: 'ยโสธร', label: 'ยโสธร' },
  { value: 'ยะลา', label: 'ยะลา' },
  { value: 'ร้อยเอ็ด', label: 'ร้อยเอ็ด' },
  { value: 'ระนอง', label: 'ระนอง' },
  { value: 'ระยอง', label: 'ระยอง' },
  { value: 'ราชบุรี', label: 'ราชบุรี' },
  { value: 'ลพบุรี', label: 'ลพบุรี' },
  { value: 'ลำปาง', label: 'ลำปาง' },
  { value: 'ลำพูน', label: 'ลำพูน' },
  { value: 'เลย', label: 'เลย' },
  { value: 'ศรีสะเกษ', label: 'ศรีสะเกษ' },
  { value: 'สกลนคร', label: 'สกลนคร' },
  { value: 'สงขลา', label: 'สงขลา' },
  { value: 'สตูล', label: 'สตูล' },
  { value: 'สมุทรปราการ', label: 'สมุทรปราการ' },
  { value: 'สมุทรสงคราม', label: 'สมุทรสงคราม' },
  { value: 'สมุทรสาคร', label: 'สมุทรสาคร' },
  { value: 'สระแก้ว', label: 'สระแก้ว' },
  { value: 'สระบุรี', label: 'สระบุรี' },
  { value: 'สิงห์บุรี', label: 'สิงห์บุรี' },
  { value: 'สุโขทัย', label: 'สุโขทัย' },
  { value: 'สุพรรณบุรี', label: 'สุพรรณบุรี' },
  { value: 'สุราษฎร์ธานี', label: 'สุราษฎร์ธานี' },
  { value: 'สุรินทร์', label: 'สุรินทร์' },
  { value: 'หนองคาย', label: 'หนองคาย' },
  { value: 'หนองบัวลำภู', label: 'หนองบัวลำภู' },
  { value: 'อ่างทอง', label: 'อ่างทอง' },
  { value: 'อำนาจเจริญ', label: 'อำนาจเจริญ' },
  { value: 'อุดรธานี', label: 'อุดรธานี' },
  { value: 'อุตรดิตถ์', label: 'อุตรดิตถ์' },
  { value: 'อุทัยธานี', label: 'อุทัยธานี' },
  { value: 'อุบลราชธานี', label: 'อุบลราชธานี' },
];

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

  // Use all provinces list
  const currentProvinceOptions = allProvinces;

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

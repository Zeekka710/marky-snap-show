import { ArrowRight } from 'lucide-react';

interface FilterBulletsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const filterOptions = [
  { id: 'province', label: 'Province' },
  { id: 'age', label: 'Age range' },
  { id: 'career', label: 'Career' },
];

const ageRanges = [
  '15-17 (Teens)',
  '18-24 (Young adults)',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
];

const careerOptions = [
  'นักเรียน/นักศึกษา',
  'พนักงานบริษัทเอกชน',
  'ข้าราชการ/รัฐวิสาหกิจ',
  'ธุรกิจส่วนตัว',
  'ฟรีแลนซ์',
  'อื่นๆ',
];

const provinceInfo = [
  'จังหวัดทั้งหมด 77 จังหวัด',
  'แบ่งตามภูมิภาค',
];

const FilterBullets = ({ selectedFilter, onFilterChange }: FilterBulletsProps) => {
  const getFilterDetails = () => {
    switch (selectedFilter) {
      case 'age':
        return ageRanges;
      case 'career':
        return careerOptions;
      case 'province':
      default:
        return provinceInfo;
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <p className="text-sm text-muted-foreground mb-4">ตัวกรองข้อมูลแผนที่</p>
      <div className="flex items-start gap-8">
        {/* Filter options with bullets */}
        <div className="space-y-3">
          {filterOptions.map((option) => (
            <div 
              key={option.id}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                selectedFilter === option.id 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onFilterChange(option.id)}
            >
              <span className={`w-2 h-2 rounded-full ${
                selectedFilter === option.id ? 'bg-primary' : 'bg-muted-foreground'
              }`} />
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>

        {/* Details display based on selected filter */}
        <div className="flex items-center gap-4">
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          <div className="space-y-1">
            {getFilterDetails().map((item, index) => (
              <p key={index} className="text-sm text-muted-foreground">{item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBullets;

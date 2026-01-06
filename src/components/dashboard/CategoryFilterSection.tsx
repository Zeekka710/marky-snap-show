import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { provinceData, occupationData, ageDistributionData } from '@/data/mockDashboardData';
import { provinceDataMap } from '@/data/thailandGeoData';

export interface CategoryFilters {
  province: string;
  ageRange: string;
  career: string;
}

interface CategoryFilterSectionProps {
  filters: CategoryFilters;
  onFiltersChange: (filters: CategoryFilters) => void;
  onViewAll: () => void;
}

const CategoryFilterSection = ({ filters, onFiltersChange, onViewAll }: CategoryFilterSectionProps) => {
  const handleProvinceChange = (value: string) => {
    // Reset other filters when province changes (OR logic)
    onFiltersChange({ province: value, ageRange: 'all', career: 'all' });
  };

  const handleAgeRangeChange = (value: string) => {
    // Reset other filters when age range changes (OR logic)
    onFiltersChange({ province: 'all', ageRange: value, career: 'all' });
  };

  const handleCareerChange = (value: string) => {
    // Reset other filters when career changes (OR logic)
    onFiltersChange({ province: 'all', ageRange: 'all', career: value });
  };

  // Get all provinces from thailand geo data (77 provinces)
  const provinces = Object.keys(provinceDataMap || {}).sort((a, b) => a.localeCompare(b, 'th'));
  
  // Get age ranges from data
  const ageRanges = ageDistributionData.map((a) => a.ageRange);
  
  // Get unique careers from data
  const careers = occupationData.map((o) => o.name);
  
  // Determine which filter is currently active
  const activeFilter = filters.career !== 'all' 
    ? 'career' 
    : filters.ageRange !== 'all' 
      ? 'ageRange' 
      : filters.province !== 'all' 
        ? 'province' 
        : 'none';

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-4 animate-fade-in">
      <div className="flex flex-wrap items-center gap-4">
        {/* Province Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">จังหวัด:</span>
          <Select value={filters.province} onValueChange={handleProvinceChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ทั้งหมด" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50 max-h-[300px]">
              <SelectItem value="all">ทั้งหมด</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Age Range Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">ช่วงอายุ:</span>
          <Select value={filters.ageRange} onValueChange={handleAgeRangeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="ทั้งหมด" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="all">ทั้งหมด</SelectItem>
              {ageRanges.map((age) => (
                <SelectItem key={age} value={age}>
                  {age} ปี
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Career Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">อาชีพ:</span>
          <Select value={filters.career} onValueChange={handleCareerChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="ทั้งหมด" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50 max-h-[300px]">
              <SelectItem value="all">ทั้งหมด</SelectItem>
              {careers.map((career) => (
                <SelectItem key={career} value={career}>
                  {career}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View All Button */}
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground ml-auto"
          onClick={onViewAll}
        >
          ดูอันดับทั้งหมด
        </Button>
      </div>
    </div>
  );
};

export default CategoryFilterSection;

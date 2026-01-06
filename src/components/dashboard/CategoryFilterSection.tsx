import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { provinceData, occupationData, ageDistributionData } from '@/data/mockDashboardData';

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
    onFiltersChange({ ...filters, province: value });
  };

  const handleAgeRangeChange = (value: string) => {
    onFiltersChange({ ...filters, ageRange: value });
  };

  const handleCareerChange = (value: string) => {
    onFiltersChange({ ...filters, career: value });
  };

  // Get unique provinces from data
  const provinces = provinceData.map((p) => p.name);
  
  // Get age ranges from data
  const ageRanges = ageDistributionData.map((a) => a.ageRange);
  
  // Get unique careers from data
  const careers = occupationData.map((o) => o.name);

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

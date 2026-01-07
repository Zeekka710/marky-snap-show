import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type CategoryType = 'province' | 'ageRange' | 'occupation' | 'region';

export interface CategoryFilters {
  province: string;
  ageRange: string;
  career: string;
  categoryType: CategoryType;
}

interface CategoryFilterSectionProps {
  filters: CategoryFilters;
  onFiltersChange: (filters: CategoryFilters) => void;
  onViewAll: () => void;
}

const categoryOptions = [
  { value: 'region', label: 'ภูมิภาค' },
  { value: 'province', label: 'จังหวัด' },
  { value: 'ageRange', label: 'ช่วงอายุ' },
  { value: 'occupation', label: 'อาชีพ' },
];

const CategoryFilterSection = ({ filters, onFiltersChange, onViewAll }: CategoryFilterSectionProps) => {
  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      province: 'all',
      ageRange: 'all',
      career: 'all',
      categoryType: value as CategoryType,
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">หมวดหมู่:</span>
        <Select value={filters.categoryType} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="เลือกหมวดหมู่" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={onViewAll}
      >
        ดูอันดับทั้งหมด
      </Button>
    </div>
  );
};

export default CategoryFilterSection;

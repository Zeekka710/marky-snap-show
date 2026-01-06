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

const FilterBullets = ({ selectedFilter, onFilterChange }: FilterBulletsProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
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
              <span className="text-lg">•</span>
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>

        {/* Age range display (shown when age filter is selected) */}
        {selectedFilter === 'age' && (
          <div className="flex items-center gap-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="space-y-1">
              {ageRanges.map((range, index) => (
                <p key={index} className="text-sm text-muted-foreground">{range}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBullets;

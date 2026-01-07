import { useState, useMemo, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { subMonths, eachDayOfInterval, format, addMonths } from 'date-fns';
import { th } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import FilterBar, { FilterValues } from '@/components/dashboard/FilterBar';
import TotalUsersCard from '@/components/dashboard/TotalUsersCard';
import TokenLimitCard from '@/components/dashboard/TokenLimitCard';
import ProjectDurationCard from '@/components/dashboard/ProjectDurationCard';
import ProvinceMapSection from '@/components/dashboard/ProvinceMapSection';
import OccupationTable, { TableRowData } from '@/components/dashboard/OccupationTable';
import CategoryFilterSection, { CategoryFilters, CategoryType } from '@/components/dashboard/CategoryFilterSection';
import ActiveUsersChart from '@/components/dashboard/ActiveUsersChart';
import NewRegisterChart from '@/components/dashboard/NewRegisterChart';
import { DailyEngagementData } from '@/types/dashboard';
import {
  provinceData,
  occupationData,
  ageDistributionData,
  totalUsersOverview,
  regionData,
} from '@/data/mockDashboardData';
import { provinceDataMap } from '@/data/thailandGeoData';

// Mock project data
const projectName = 'โครงการ AI สำหรับประชาชน';
const projectStartDate = new Date('2024-11-26');
const projectEndDate = addMonths(projectStartDate, 1);

// Mock token models data with more models for horizontal scroll
const tokenModels = [
  { name: 'ChatGPT o3', used: 600000, total: 1000000 },
  { name: 'ChatGPT 5.1', used: 450000, total: 800000 },
  { name: 'Gemini 3 Pro', used: 300000, total: 500000 },
  { name: 'Gemini 3 Flash', used: 200000, total: 600000 },
  { name: 'Claude Sonnet 4.5', used: 150000, total: 400000 },
];

// Generate mock daily data based on date range and filters
const generateDailyData = (dateRange: DateRange | undefined, filters: FilterValues): DailyEngagementData[] => {
  if (!dateRange?.from || !dateRange?.to) return [];
  
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
  
  const getMultiplier = () => {
    let multiplier = 1;
    if (filters.ageRange !== 'all') multiplier *= 0.2;
    if (filters.region !== 'all') multiplier *= 0.15;
    if (filters.province !== 'all') multiplier *= 0.05;
    if (filters.occupation !== 'all') multiplier *= 0.1;
    return multiplier || 0.01;
  };
  
  const multiplier = getMultiplier();
  
  return days.map((day) => ({
    date: format(day, 'd MMM', { locale: th }),
    activeUsers: Math.floor((70000 + Math.random() * 40000) * multiplier),
    active1Day: 22 + Math.random() * 6,
    active7Day: 33 + Math.random() * 8,
    active30Day: 60 + Math.random() * 10,
  }));
};

// Generate new register data
const generateNewRegisterData = (dateRange: DateRange | undefined, filters: FilterValues): DailyEngagementData[] => {
  if (!dateRange?.from || !dateRange?.to) return [];
  
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
  
  const getMultiplier = () => {
    let multiplier = 1;
    if (filters.ageRange !== 'all') multiplier *= 0.2;
    if (filters.region !== 'all') multiplier *= 0.15;
    if (filters.province !== 'all') multiplier *= 0.05;
    if (filters.occupation !== 'all') multiplier *= 0.1;
    return multiplier || 0.01;
  };
  
  const multiplier = getMultiplier();
  
  return days.map((day) => ({
    date: format(day, 'd MMM', { locale: th }),
    activeUsers: Math.floor((50000 + Math.random() * 30000) * multiplier),
    active1Day: 18 + Math.random() * 8,
    active7Day: 28 + Math.random() * 10,
    active30Day: 55 + Math.random() * 12,
  }));
};

// Filter map data based on category filters
const filterMapData = (
  categoryFilters: CategoryFilters,
  userType: string
): Record<string, number> => {
  // Ensure provinceDataMap exists
  if (!provinceDataMap || Object.keys(provinceDataMap).length === 0) {
    return {};
  }
  
  let result = { ...provinceDataMap };
  
  // Apply user type filter
  if (userType === 'active') {
    result = Object.fromEntries(
      Object.entries(result).map(([name, value]) => [name, Math.round(value * 0.72)])
    );
  }
  
  // Apply province filter
  if (categoryFilters.province !== 'all') {
    const selectedProvince = categoryFilters.province;
    result = Object.fromEntries(
      Object.entries(result).map(([name, value]) => [
        name,
        name === selectedProvince ? value : Math.round(value * 0.1),
      ])
    );
  }
  
  // Apply age range filter (simulate effect)
  if (categoryFilters.ageRange !== 'all') {
    result = Object.fromEntries(
      Object.entries(result).map(([name, value]) => [name, Math.round(value * 0.4)])
    );
  }
  
  // Apply career filter (simulate effect)
  if (categoryFilters.career !== 'all') {
    result = Object.fromEntries(
      Object.entries(result).map(([name, value]) => [name, Math.round(value * 0.3)])
    );
  }
  
  return result;
};

// Generate table data based on category type filter
const generateTableData = (categoryFilters: CategoryFilters): { data: TableRowData[]; title: string; valueLabel: string } => {
  const categoryType = categoryFilters.categoryType;
  
  if (categoryType === 'region') {
    // Show all regions sorted by user count
    const regionEntries = [...regionData]
      .sort((a, b) => b.userCount - a.userCount)
      .map((item, index) => ({
        rank: index + 1,
        name: item.name,
        value: item.userCount,
      }));
    return {
      data: regionEntries,
      title: 'ภูมิภาค',
      valueLabel: 'จำนวนผู้ใช้งาน (บัญชี)',
    };
  }
  
  if (categoryType === 'province') {
    // Show all provinces sorted by user count
    const provinceEntries = Object.entries(provinceDataMap || {})
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        rank: index + 1,
        name: item.name,
        value: item.value,
      }));
    return {
      data: provinceEntries,
      title: 'จังหวัด',
      valueLabel: 'จำนวนผู้ใช้งาน (บัญชี)',
    };
  }
  
  if (categoryType === 'ageRange') {
    // Show all age ranges sorted by user count
    const ageData = ageDistributionData
      .map((a) => ({ name: `${a.ageRange} ปี`, value: a.registeredUsers }))
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        rank: index + 1,
        name: item.name,
        value: item.value,
      }));
    return {
      data: ageData,
      title: 'ช่วงอายุ',
      valueLabel: 'จำนวนผู้ใช้งาน (บัญชี)',
    };
  }
  
  // Default: occupation - show all occupations sorted by user count
  const occupationSorted = [...occupationData]
    .sort((a, b) => b.userCount - a.userCount)
    .map((o, index) => ({
      rank: index + 1,
      name: o.name,
      value: o.userCount,
    }));
  return {
    data: occupationSorted,
    title: 'อาชีพ',
    valueLabel: 'จำนวนผู้ใช้งาน (บัญชี)',
  };
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Category filters for map and table (Province, Age range, Career)
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilters>({
    province: 'all',
    ageRange: 'all',
    career: 'all',
    categoryType: 'occupation',
  });
  
  // User type filter for map
  const [userType, setUserType] = useState('registered');
  
  // Dialog state for viewing all provinces
  const [isViewAllDialogOpen, setIsViewAllDialogOpen] = useState(false);
  
  // Chart section filters (Date, Age, Region, Province)
  const [chartFilters, setChartFilters] = useState<FilterValues>({
    dateRange: {
      from: subMonths(new Date(), 1),
      to: new Date(),
    },
    ageRange: 'all',
    region: 'all',
    province: 'all',
    occupation: 'all',
  });

  const handleChartFilterChange = useCallback((newFilters: FilterValues) => {
    setChartFilters(newFilters);
  }, []);

  // Memoize chart data (affected by chartFilters)
  const dailyEngagementData = useMemo(() => generateDailyData(chartFilters.dateRange, chartFilters), [chartFilters]);
  const newRegisterData = useMemo(() => generateNewRegisterData(chartFilters.dateRange, chartFilters), [chartFilters]);
  
  // Memoize map data (affected by categoryFilters and userType)
  const filteredMapData = useMemo(() => filterMapData(categoryFilters, userType), [categoryFilters, userType]);
  
  // Memoize table data (affected by categoryFilters)
  const tableConfig = useMemo(() => generateTableData(categoryFilters), [categoryFilters]);

  // Calculate accumulated new register
  const accumNewRegister = useMemo(() => {
    return newRegisterData.reduce((acc, day) => acc + day.activeUsers, 0);
  }, [newRegisterData]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Usage Trend</h1>
        </div>

        {/* Row 1: Project Title */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">{projectName}</h2>
        </div>

        {/* Row 2: Accum Users + Project Duration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TotalUsersCard totalUsers={totalUsersOverview} />
          <ProjectDurationCard startDate={projectStartDate} endDate={projectEndDate} />
        </div>

        {/* Row 3: Token Limit per model */}
        <div className="mb-6">
          <TokenLimitCard models={tokenModels} />
        </div>

        {/* Row 4: Map + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ProvinceMapSection 
            provinceData={filteredMapData}
            userType={userType}
            onUserTypeChange={setUserType}
            isDialogOpen={isViewAllDialogOpen}
            onDialogOpenChange={setIsViewAllDialogOpen}
          />
          <OccupationTable 
            data={tableConfig.data}
            title={tableConfig.title}
            valueLabel={tableConfig.valueLabel}
            filterSection={
              <CategoryFilterSection 
                filters={categoryFilters}
                onFiltersChange={setCategoryFilters}
                onViewAll={() => setIsViewAllDialogOpen(true)}
              />
            }
          />
        </div>

        {/* Row 6: Filter Bar for Charts */}
        <div className="mb-6">
          <FilterBar onFilterChange={handleChartFilterChange} />
        </div>

        {/* Row 7: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveUsersChart data={dailyEngagementData} />
          <NewRegisterChart data={newRegisterData} accumTotal={accumNewRegister} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

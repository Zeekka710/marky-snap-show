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
import OccupationTable from '@/components/dashboard/OccupationTable';
import ActiveUsersChart from '@/components/dashboard/ActiveUsersChart';
import NewRegisterChart from '@/components/dashboard/NewRegisterChart';
import { DailyEngagementData, ProvinceData, OccupationData } from '@/types/dashboard';
import {
  provinceData,
  occupationData,
  totalUsersOverview,
} from '@/data/mockDashboardData';

// Mock project data
const projectName = 'โครงการ AI สำหรับประชาชน';
const projectStartDate = new Date('2024-11-26');
const projectEndDate = addMonths(projectStartDate, 1);

// Mock token models data with more models for horizontal scroll
const tokenModels = [
  { name: 'Chat GPT 5.2', used: 600000, total: 1000000 },
  { name: 'Claude 3.5', used: 450000, total: 800000 },
  { name: 'Gemini Pro', used: 300000, total: 500000 },
  { name: 'Llama 3.1', used: 200000, total: 600000 },
  { name: 'Mistral', used: 150000, total: 400000 },
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

// Filter province data based on map filters
const filterProvinceData = (data: ProvinceData[], mapFilter: string): ProvinceData[] => {
  let filtered = [...data];
  
  // Apply different sorting/filtering based on map filter type
  if (mapFilter === 'age') {
    // Simulate age-based filtering with different multiplier
    filtered = filtered.map(p => ({
      ...p,
      value: Math.floor(p.value * (0.3 + Math.random() * 0.4)),
    }));
  } else if (mapFilter === 'career') {
    // Simulate career-based filtering with different multiplier
    filtered = filtered.map(p => ({
      ...p,
      value: Math.floor(p.value * (0.2 + Math.random() * 0.5)),
    }));
  }
  
  return filtered
    .sort((a, b) => b.value - a.value)
    .map((p, i) => ({ ...p, rank: i + 1 }));
};

// Filter occupation data based on map filters
const filterOccupationData = (data: OccupationData[], mapFilter: string): OccupationData[] => {
  let filtered = [...data];
  
  if (mapFilter === 'age') {
    filtered = filtered.map(o => ({
      ...o,
      userCount: Math.floor(o.userCount * (0.3 + Math.random() * 0.4)),
    }));
  } else if (mapFilter === 'career') {
    filtered = filtered.map(o => ({
      ...o,
      userCount: Math.floor(o.userCount * (0.2 + Math.random() * 0.5)),
    }));
  }
  
  return filtered
    .sort((a, b) => b.userCount - a.userCount)
    .map((o, i) => ({ ...o, rank: i + 1 }));
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Map section filter (Province, Age range, Career)
  const [mapFilter, setMapFilter] = useState('province');
  
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
  
  // Memoize map data (affected by mapFilter)
  const filteredProvinceData = useMemo(() => filterProvinceData(provinceData, mapFilter), [mapFilter]);
  const filteredOccupationData = useMemo(() => filterOccupationData(occupationData, mapFilter), [mapFilter]);

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

        {/* Row 4: Map + Top 10 Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ProvinceMapSection 
            provinces={filteredProvinceData} 
            mapFilter={mapFilter}
            onMapFilterChange={setMapFilter}
          />
          <OccupationTable data={filteredOccupationData} />
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

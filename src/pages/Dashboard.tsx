import { useState, useMemo, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { subMonths, eachDayOfInterval, format } from 'date-fns';
import { th } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import FilterBar, { FilterValues } from '@/components/dashboard/FilterBar';
import TotalUsersCard from '@/components/dashboard/TotalUsersCard';
import TokenLimitCard from '@/components/dashboard/TokenLimitCard';
import ProvinceMapSection from '@/components/dashboard/ProvinceMapSection';
import OccupationTable from '@/components/dashboard/OccupationTable';
import ActiveUsersChart from '@/components/dashboard/ActiveUsersChart';
import NewRegisterChart from '@/components/dashboard/NewRegisterChart';
import FilterBullets from '@/components/dashboard/FilterBullets';
import { DailyEngagementData, ProvinceData, OccupationData } from '@/types/dashboard';
import {
  provinceData,
  occupationData,
  totalUsersOverview,
} from '@/data/mockDashboardData';

// Mock token models data
const tokenModels = [
  { name: 'Chat GPT 5.2', used: 600000, total: 1000000 },
  { name: 'Chat GPT 5.2', used: 600000, total: 1000000 },
  { name: 'Chat GPT 5.2', used: 600000, total: 1000000 },
];

// Generate mock daily data based on date range and filters
const generateDailyData = (dateRange: DateRange | undefined, filters: FilterValues): DailyEngagementData[] => {
  if (!dateRange?.from || !dateRange?.to) return [];
  
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
  
  // Apply multiplier based on filters
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

// Filter province data
const filterProvinceData = (data: ProvinceData[], filters: FilterValues): ProvinceData[] => {
  let filtered = [...data];
  
  const regionProvinces: Record<string, string[]> = {
    central: ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'พระนครศรีอยุธยา', 'นครปฐม', 'สระบุรี', 'ลพบุรี'],
    north: ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'ลำพูน', 'แม่ฮ่องสอน', 'พิษณุโลก', 'เพชรบูรณ์', 'นครสวรรค์'],
    northeast: ['นครราชสีมา', 'ขอนแก่น', 'อุดรธานี', 'อุบลราชธานี', 'บุรีรัมย์', 'สุรินทร์', 'ศรีสะเกษ', 'ร้อยเอ็ด'],
    east: ['ชลบุรี', 'ระยอง', 'จันทบุรี', 'ตราด', 'ฉะเชิงเทรา', 'ปราจีนบุรี', 'สระแก้ว'],
    west: ['กาญจนบุรี', 'ราชบุรี', 'เพชรบุรี', 'ประจวบคีรีขันธ์', 'ตาก'],
    south: ['สงขลา', 'ภูเก็ต', 'สุราษฎร์ธานี', 'นครศรีธรรมราช', 'กระบี่', 'ตรัง', 'พัทลุง'],
  };
  
  if (filters.region !== 'all') {
    const allowedProvinces = regionProvinces[filters.region] || [];
    filtered = filtered.filter(p => allowedProvinces.includes(p.name));
  }
  
  if (filters.province !== 'all') {
    filtered = filtered.filter(p => p.name === filters.province);
  }
  
  let multiplier = 1;
  if (filters.ageRange !== 'all') multiplier *= 0.2;
  if (filters.occupation !== 'all') multiplier *= 0.1;
  
  if (multiplier !== 1) {
    filtered = filtered.map(p => ({
      ...p,
      value: Math.floor(p.value * multiplier),
    }));
  }
  
  return filtered
    .sort((a, b) => b.value - a.value)
    .map((p, i) => ({ ...p, rank: i + 1 }));
};

// Filter occupation data
const filterOccupationData = (data: OccupationData[], filters: FilterValues): OccupationData[] => {
  let filtered = [...data];
  
  if (filters.occupation !== 'all') {
    filtered = filtered.filter(o => o.name.includes(filters.occupation));
  }
  
  let multiplier = 1;
  if (filters.ageRange !== 'all') multiplier *= 0.2;
  if (filters.region !== 'all') multiplier *= 0.15;
  if (filters.province !== 'all') multiplier *= 0.05;
  
  if (multiplier !== 1) {
    filtered = filtered.map(o => ({
      ...o,
      userCount: Math.floor(o.userCount * multiplier),
    }));
  }
  
  return filtered
    .sort((a, b) => b.userCount - a.userCount)
    .map((o, i) => ({ ...o, rank: i + 1 }));
};

// Filter total users
const filterTotalUsers = (total: number, filters: FilterValues): number => {
  let multiplier = 1;
  if (filters.ageRange !== 'all') multiplier *= 0.2;
  if (filters.region !== 'all') multiplier *= 0.15;
  if (filters.province !== 'all') multiplier *= 0.05;
  if (filters.occupation !== 'all') multiplier *= 0.1;
  return Math.floor(total * multiplier);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('province');
  const [filters, setFilters] = useState<FilterValues>({
    dateRange: {
      from: subMonths(new Date(), 1),
      to: new Date(),
    },
    ageRange: 'all',
    region: 'all',
    province: 'all',
    occupation: 'all',
  });

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  // Memoize filtered data
  const dailyEngagementData = useMemo(() => generateDailyData(filters.dateRange, filters), [filters]);
  const newRegisterData = useMemo(() => generateNewRegisterData(filters.dateRange, filters), [filters]);
  const filteredProvinceData = useMemo(() => filterProvinceData(provinceData, filters), [filters]);
  const filteredOccupationData = useMemo(() => filterOccupationData(occupationData, filters), [filters]);
  const filteredTotalUsers = useMemo(() => filterTotalUsers(totalUsersOverview, filters), [filters]);

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

        {/* Top Section: Accum users + Token Limit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TotalUsersCard totalUsers={filteredTotalUsers} />
          <TokenLimitCard models={tokenModels} />
        </div>
        
        {/* Filter Bar */}
        <FilterBar onFilterChange={handleFilterChange} />

        {/* Middle Section: Map + Filter Bullets + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Thailand Map */}
          <ProvinceMapSection provinces={filteredProvinceData} />
          
          {/* Right: Filter Bullets + Occupation Table */}
          <div className="space-y-6">
            <FilterBullets 
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
            <OccupationTable data={filteredOccupationData} />
          </div>
        </div>

        {/* Bottom Section: Two Charts side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveUsersChart data={dailyEngagementData} />
          <NewRegisterChart data={newRegisterData} accumTotal={accumNewRegister} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

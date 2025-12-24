import { useState, useMemo, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { subMonths, eachDayOfInterval, format } from 'date-fns';
import { th } from 'date-fns/locale';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import FilterBar, { FilterValues } from '@/components/dashboard/FilterBar';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import MetricCard from '@/components/dashboard/MetricCard';
import TotalUsersCard from '@/components/dashboard/TotalUsersCard';
import ProvinceMapSection from '@/components/dashboard/ProvinceMapSection';
import DemographicsCharts from '@/components/dashboard/DemographicsCharts';
import OccupationTable from '@/components/dashboard/OccupationTable';
import EngagementChart from '@/components/dashboard/EngagementChart';
import { DailyEngagementData, MetricCard as MetricCardType, ProvinceData, OccupationData, AgeDistributionData, OccupationDistributionData } from '@/types/dashboard';
import {
  summaryMetrics,
  provinceData,
  occupationData,
  ageDistributionData,
  occupationDistributionData,
  totalUsersOverview,
} from '@/data/mockDashboardData';

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

// Filter metrics based on filters
const filterMetrics = (metrics: MetricCardType[], filters: FilterValues): MetricCardType[] => {
  let multiplier = 1;
  if (filters.ageRange !== 'all') multiplier *= 0.2;
  if (filters.region !== 'all') multiplier *= 0.15;
  if (filters.province !== 'all') multiplier *= 0.05;
  if (filters.occupation !== 'all') multiplier *= 0.1;
  
  if (multiplier === 1) return metrics;
  
  return metrics.map(metric => ({
    ...metric,
    value: Math.floor(metric.value * multiplier),
    previous_period_value: Math.floor(metric.previous_period_value * multiplier),
  }));
};

// Filter province data
const filterProvinceData = (data: ProvinceData[], filters: FilterValues): ProvinceData[] => {
  let filtered = [...data];
  
  // Filter by region
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
  
  // Apply age/occupation multiplier
  let multiplier = 1;
  if (filters.ageRange !== 'all') multiplier *= 0.2;
  if (filters.occupation !== 'all') multiplier *= 0.1;
  
  if (multiplier !== 1) {
    filtered = filtered.map(p => ({
      ...p,
      value: Math.floor(p.value * multiplier),
    }));
  }
  
  // Re-rank
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
  
  // Apply region/province/age multiplier
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

// Filter age distribution data
const filterAgeDistributionData = (data: AgeDistributionData[], filters: FilterValues): AgeDistributionData[] => {
  let filtered = [...data];
  
  if (filters.ageRange !== 'all') {
    // Map filter values to data ageRange values
    const ageMap: Record<string, string> = {
      '7-15': '7-15',
      '16-30': '16-30',
      '31-45': '31-45',
      '46-60': '45-60',
      '60+': '60 ขึ้นไป',
    };
    const targetAge = ageMap[filters.ageRange];
    if (targetAge) {
      filtered = filtered.filter(a => a.ageRange === targetAge);
    }
  }
  
  // Apply other filters as multiplier
  let multiplier = 1;
  if (filters.region !== 'all') multiplier *= 0.15;
  if (filters.province !== 'all') multiplier *= 0.05;
  if (filters.occupation !== 'all') multiplier *= 0.1;
  
  if (multiplier !== 1) {
    filtered = filtered.map(a => ({
      ...a,
      registeredUsers: Math.floor(a.registeredUsers * multiplier),
    }));
  }
  
  return filtered;
};

// Filter occupation distribution data
const filterOccupationDistributionData = (data: OccupationDistributionData[], filters: FilterValues): OccupationDistributionData[] => {
  let filtered = [...data];
  
  // Apply filters as multiplier
  let multiplier = 1;
  if (filters.ageRange !== 'all') multiplier *= 0.2;
  if (filters.region !== 'all') multiplier *= 0.15;
  if (filters.province !== 'all') multiplier *= 0.05;
  
  if (multiplier !== 1) {
    filtered = filtered.map(o => ({
      ...o,
      registeredUsers: Math.floor(o.registeredUsers * multiplier),
    }));
  }
  
  return filtered;
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

const tabs = [
  { id: 'users', label: 'จำนวนผู้ใช้งาน' },
  { id: 'tokens', label: 'จำนวนการใช้งานโทเคน' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
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
  const filteredMetrics = useMemo(() => filterMetrics(summaryMetrics, filters), [filters]);
  const filteredProvinceData = useMemo(() => filterProvinceData(provinceData, filters), [filters]);
  const filteredOccupationData = useMemo(() => filterOccupationData(occupationData, filters), [filters]);
  const filteredAgeDistributionData = useMemo(() => filterAgeDistributionData(ageDistributionData, filters), [filters]);
  const filteredOccupationDistributionData = useMemo(() => filterOccupationDistributionData(occupationDistributionData, filters), [filters]);
  const filteredTotalUsers = useMemo(() => filterTotalUsers(totalUsersOverview, filters), [filters]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">แดชบอร์ด</h1>
        
        <FilterBar onFilterChange={handleFilterChange} />
        
        <DashboardTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {activeTab === 'users' ? (
          <UserOverviewTab 
            dailyEngagementData={dailyEngagementData}
            metrics={filteredMetrics}
            provinceData={filteredProvinceData}
            ageDistributionData={filteredAgeDistributionData}
            occupationDistributionData={filteredOccupationDistributionData}
          />
        ) : (
          <TokenUsageTab 
            totalUsers={filteredTotalUsers}
            occupationData={filteredOccupationData}
          />
        )}
      </main>
    </div>
  );
};

interface UserOverviewTabProps {
  dailyEngagementData: DailyEngagementData[];
  metrics: MetricCardType[];
  provinceData: ProvinceData[];
  ageDistributionData: AgeDistributionData[];
  occupationDistributionData: OccupationDistributionData[];
}

const UserOverviewTab = ({ 
  dailyEngagementData, 
  metrics, 
  provinceData: provinces,
  ageDistributionData: ageData,
  occupationDistributionData: occData,
}: UserOverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Summary Metrics Section */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">จำนวนผู้ใช้งานภาพรวม</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.metric_name} metric={metric} size="large" />
          ))}
        </div>
      </section>

      {/* Engagement Chart */}
      <EngagementChart data={dailyEngagementData} />

      {/* Province Map Section */}
      <ProvinceMapSection provinces={provinces} />

      {/* Demographics Charts */}
      <DemographicsCharts 
        ageData={ageData} 
        occupationData={occData} 
      />
    </div>
  );
};

interface TokenUsageTabProps {
  totalUsers: number;
  occupationData: OccupationData[];
}

const TokenUsageTab = ({ totalUsers, occupationData: occData }: TokenUsageTabProps) => {
  return (
    <div className="space-y-6">
      <TotalUsersCard totalUsers={totalUsers} />
      <OccupationTable data={occData} />
    </div>
  );
};

export default Dashboard;

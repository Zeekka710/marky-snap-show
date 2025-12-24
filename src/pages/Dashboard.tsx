import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { subMonths, eachDayOfInterval, format } from 'date-fns';
import { th } from 'date-fns/locale';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import FilterBar from '@/components/dashboard/FilterBar';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import MetricCard from '@/components/dashboard/MetricCard';
import TotalUsersCard from '@/components/dashboard/TotalUsersCard';
import ProvinceMapSection from '@/components/dashboard/ProvinceMapSection';
import DemographicsCharts from '@/components/dashboard/DemographicsCharts';
import OccupationTable from '@/components/dashboard/OccupationTable';
import EngagementChart from '@/components/dashboard/EngagementChart';
import { DailyEngagementData } from '@/types/dashboard';
import {
  summaryMetrics,
  provinceData,
  occupationData,
  ageDistributionData,
  occupationDistributionData,
  totalUsersOverview,
} from '@/data/mockDashboardData';

// Generate mock daily data based on date range
const generateDailyData = (dateRange: DateRange | undefined): DailyEngagementData[] => {
  if (!dateRange?.from || !dateRange?.to) return [];
  
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
  
  return days.map((day) => ({
    date: format(day, 'd MMM', { locale: th }),
    activeUsers: Math.floor(70000 + Math.random() * 40000),
    active1Day: 22 + Math.random() * 6,
    active7Day: 33 + Math.random() * 8,
    active30Day: 60 + Math.random() * 10,
  }));
};

const tabs = [
  { id: 'users', label: 'จำนวนผู้ใช้งาน' },
  { id: 'tokens', label: 'จำนวนการใช้งานโทเคน' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const dailyEngagementData = useMemo(() => generateDailyData(dateRange), [dateRange]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">แดชบอร์ด</h1>
        
        <FilterBar onDateRangeChange={setDateRange} />
        
        <DashboardTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {activeTab === 'users' ? (
          <UserOverviewTab dailyEngagementData={dailyEngagementData} />
        ) : (
          <TokenUsageTab />
        )}
      </main>
    </div>
  );
};

interface UserOverviewTabProps {
  dailyEngagementData: DailyEngagementData[];
}

const UserOverviewTab = ({ dailyEngagementData }: UserOverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Summary Metrics Section */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">จำนวนผู้ใช้งานภาพรวม</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summaryMetrics.map((metric) => (
            <MetricCard key={metric.metric_name} metric={metric} size="large" />
          ))}
        </div>
      </section>

      {/* Engagement Chart */}
      <EngagementChart data={dailyEngagementData} />

      {/* Province Map Section */}
      <ProvinceMapSection provinces={provinceData} />

      {/* Demographics Charts */}
      <DemographicsCharts 
        ageData={ageDistributionData} 
        occupationData={occupationDistributionData} 
      />
    </div>
  );
};

const TokenUsageTab = () => {
  return (
    <div className="space-y-6">
      <TotalUsersCard totalUsers={totalUsersOverview} />
      
      <DashboardTabs 
        tabs={[
          { id: 'users-sub', label: 'จำนวนผู้ใช้งาน' },
          { id: 'tokens-sub', label: 'จำนวนการใช้งานโทเคน' },
        ]}
        activeTab="tokens-sub"
        onTabChange={() => {}}
      />
      
      <OccupationTable data={occupationData} />
    </div>
  );
};

export default Dashboard;

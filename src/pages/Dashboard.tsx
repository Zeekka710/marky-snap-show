import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import FilterBar from '@/components/dashboard/FilterBar';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import MetricCard from '@/components/dashboard/MetricCard';
import TotalUsersCard from '@/components/dashboard/TotalUsersCard';
import ProvinceMapSection from '@/components/dashboard/ProvinceMapSection';
import DemographicsCharts from '@/components/dashboard/DemographicsCharts';
import OccupationTable from '@/components/dashboard/OccupationTable';
import {
  summaryMetrics,
  engagementMetrics,
  provinceData,
  occupationData,
  ageDistributionData,
  occupationDistributionData,
  totalUsersOverview,
} from '@/data/mockDashboardData';

const tabs = [
  { id: 'users', label: 'จำนวนผู้ใช้งาน' },
  { id: 'tokens', label: 'จำนวนการใช้งานโทเคน' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">แดชบอร์ด</h1>
        
        <FilterBar />
        
        <DashboardTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {activeTab === 'users' ? (
          <UserOverviewTab />
        ) : (
          <TokenUsageTab />
        )}
      </main>
    </div>
  );
};

const UserOverviewTab = () => {
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

      {/* Engagement Metrics */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {engagementMetrics.map((metric) => (
            <MetricCard key={metric.metric_name} metric={metric} />
          ))}
        </div>
      </section>

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

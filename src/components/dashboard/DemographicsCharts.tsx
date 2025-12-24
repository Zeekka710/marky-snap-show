import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { AgeDistributionData, OccupationDistributionData } from '@/types/dashboard';
import { occupationData } from '@/data/mockDashboardData';
import { Search } from 'lucide-react';
import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface DemographicsChartsProps {
  ageData: AgeDistributionData[];
  occupationData: OccupationDistributionData[];
}

const DemographicsCharts = ({ ageData, occupationData: chartOccupationData }: DemographicsChartsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get all occupations from mock data
  const allOccupations = occupationData;

  // Filter occupations based on search
  const filteredOccupations = allOccupations.filter((occupation) =>
    occupation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total users
  const totalUsers = allOccupations.reduce((sum, occ) => sum + occ.userCount, 0);

  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">ผู้ใช้งานรายกลุ่ม</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution Chart */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <h4 className="text-sm font-medium text-foreground mb-4">
            จำนวนผู้ลงทะเบียนสะสมตามช่วงอายุ
          </h4>
          
          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-chart-blue" />
              <span className="text-muted-foreground">จำนวนผู้ลงทะเบียนสะสม</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-chart-orange" />
              <span className="text-muted-foreground">% ผู้ใช้งานในช่วง 1 วัน</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ageData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="ageRange" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="registeredUsers" 
                  fill="hsl(var(--chart-blue))" 
                  radius={[4, 4, 0, 0]}
                  name="ผู้ลงทะเบียน"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="activePercentage" 
                  stroke="hsl(var(--chart-orange))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-orange))', strokeWidth: 0, r: 4 }}
                  name="% Active"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-2">ช่วงอายุ</p>
        </div>

        {/* Occupation Distribution Chart */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-foreground">
              จำนวนผู้ลงทะเบียนสะสมตามอาชีพ (Top 10)
            </h4>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
              onClick={() => setIsDialogOpen(true)}
            >
              ดูอันดับทั้งหมด
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-chart-blue" />
              <span className="text-muted-foreground">จำนวนผู้ลงทะเบียนสะสม</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-chart-orange" />
              <span className="text-muted-foreground">% เฉลี่ยผู้ใช้งานในช่วง 1 วัน</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartOccupationData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="occupation" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  interval={0}
                  height={50}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="registeredUsers" 
                  fill="hsl(var(--chart-blue))" 
                  radius={[4, 4, 0, 0]}
                  name="ผู้ลงทะเบียน"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="activePercentage" 
                  stroke="hsl(var(--chart-orange))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-orange))', strokeWidth: 0, r: 4 }}
                  name="% Active"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-2">อาชีพ</p>
        </div>
      </div>

      {/* All Occupations Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">อันดับอาชีพทั้งหมด</DialogTitle>
          </DialogHeader>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-b border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{allOccupations.length}</p>
              <p className="text-sm text-muted-foreground">อาชีพ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalUsers.toLocaleString('th-TH')}</p>
              <p className="text-sm text-muted-foreground">ผู้ใช้งานทั้งหมด</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {Math.round(totalUsers / allOccupations.length).toLocaleString('th-TH')}
              </p>
              <p className="text-sm text-muted-foreground">เฉลี่ยต่ออาชีพ</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาอาชีพ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Occupation List */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-1">
              {filteredOccupations.map((occupation) => (
                <div 
                  key={occupation.name} 
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        occupation.rank <= 3 
                          ? 'bg-primary text-primary-foreground' 
                          : occupation.rank <= 10 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {occupation.rank}
                    </span>
                    <span className="text-sm font-medium text-foreground">{occupation.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      {occupation.userCount.toLocaleString('th-TH')}
                    </span>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {((occupation.userCount / totalUsers) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
              
              {filteredOccupations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  ไม่พบอาชีพที่ค้นหา
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemographicsCharts;

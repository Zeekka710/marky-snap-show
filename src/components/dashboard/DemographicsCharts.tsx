import { Button } from '@/components/ui/button';
import { AgeDistributionData, OccupationDistributionData } from '@/types/dashboard';
import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface DemographicsChartsProps {
  ageData: AgeDistributionData[];
  occupationData: OccupationDistributionData[];
}

const DemographicsCharts = ({ ageData, occupationData }: DemographicsChartsProps) => {
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
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
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
              <ComposedChart data={occupationData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
    </div>
  );
};

export default DemographicsCharts;

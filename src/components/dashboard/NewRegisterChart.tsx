import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyEngagementData } from '@/types/dashboard';

interface NewRegisterChartProps {
  data: DailyEngagementData[];
  accumTotal?: number;
}

const NewRegisterChart = ({ data, accumTotal }: NewRegisterChartProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">New register</h3>
        {accumTotal !== undefined && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">ผู้ใช้ใหม่สะสม</p>
            <p className="text-lg font-bold text-foreground">{accumTotal.toLocaleString('th-TH')}</p>
          </div>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">จำนวนผู้ใช้งาน Active รายวัน</p>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => value.toLocaleString('th-TH')}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => {
                return [value.toLocaleString('th-TH'), name];
              }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            
            <Bar 
              dataKey="activeUsers" 
              name="จำนวนผู้ใช้งาน" 
              fill="hsl(217, 91%, 53%)" 
              radius={[2, 2, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NewRegisterChart;

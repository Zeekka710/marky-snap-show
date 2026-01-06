import { Bar, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyEngagementData } from '@/types/dashboard';

interface ActiveUsersChartProps {
  data: DailyEngagementData[];
}

const ActiveUsersChart = ({ data }: ActiveUsersChartProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-2">Active users</h3>
      <p className="text-sm text-muted-foreground mb-4">จำนวนผู้ใช้งาน Active รายวัน</p>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => value.toLocaleString('th-TH')}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'จำนวนผู้ใช้งาน') {
                  return [value.toLocaleString('th-TH'), name];
                }
                return [`${value.toFixed(1)}%`, name];
              }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            
            <Bar 
              yAxisId="left"
              dataKey="activeUsers" 
              name="จำนวนผู้ใช้งาน" 
              fill="hsl(217, 91%, 53%)" 
              radius={[2, 2, 0, 0]}
              opacity={0.8}
            />
            
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="active1Day" 
              name="% Active 1 วัน" 
              stroke="hsl(25, 95%, 53%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(25, 95%, 53%)', strokeWidth: 1, r: 2 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="active7Day" 
              name="% Active 7 วัน" 
              stroke="hsl(142, 76%, 36%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 1, r: 2 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="active30Day" 
              name="% Active 30 วัน" 
              stroke="hsl(262, 83%, 58%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(262, 83%, 58%)', strokeWidth: 1, r: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActiveUsersChart;

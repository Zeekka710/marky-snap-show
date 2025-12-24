import { Bar, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyEngagementData } from '@/types/dashboard';

interface EngagementChartProps {
  data: DailyEngagementData[];
}

const EngagementChart = ({ data }: EngagementChartProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">จำนวนผู้ใช้งาน Active รายวัน</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => value.toLocaleString('th-TH')}
              label={{ 
                value: 'จำนวนผู้ใช้งาน', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 }
              }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              label={{ 
                value: '% Active', 
                angle: 90, 
                position: 'insideRight',
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 }
              }}
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
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
            />
            
            {/* Bar for daily active users count */}
            <Bar 
              yAxisId="left"
              dataKey="activeUsers" 
              name="จำนวนผู้ใช้งาน" 
              fill="hsl(217, 91%, 53%)" 
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
            
            {/* Lines for 1-day, 7-day, 30-day active percentages */}
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="active1Day" 
              name="% Active 1 วัน" 
              stroke="hsl(25, 95%, 53%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(25, 95%, 53%)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="active7Day" 
              name="% Active 7 วัน" 
              stroke="hsl(142, 76%, 36%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="active30Day" 
              name="% Active 30 วัน" 
              stroke="hsl(262, 83%, 58%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(262, 83%, 58%)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EngagementChart;

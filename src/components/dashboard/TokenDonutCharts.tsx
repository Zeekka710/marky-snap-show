import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface TokenByFeatureData {
  name: string;
  value: number;
  color: string;
}

export interface TokenByModelData {
  name: string;
  value: number;
  color: string;
}

interface TokenDonutChartsProps {
  featureData: TokenByFeatureData[];
  modelData: TokenByModelData[];
  totalTokens: number;
  unit?: 'tokens' | 'users';
}

const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const DonutChart = ({ 
  data, 
  title, 
  totalValue,
  unit = 'tokens'
}: { 
  data: { name: string; value: number; color: string }[]; 
  title: string;
  totalValue: number;
  unit?: 'tokens' | 'users';
}) => {
  const unitLabel = unit === 'tokens' ? 'Tokens' : 'ผู้ใช้งาน';
  
  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatNumber(value), unitLabel]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm text-muted-foreground">ทั้งหมด</span>
              <span className="text-2xl font-bold text-primary">{formatNumber(totalValue)}</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-col gap-2">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TokenDonutCharts = ({ featureData, modelData, totalTokens, unit = 'tokens' }: TokenDonutChartsProps) => {
  const featureTitle = unit === 'tokens' ? 'จำนวนโทเคนตามฟีเจอร์การใช้งาน' : 'จำนวนการใช้งานตามฟีเจอร์';
  const modelTitle = unit === 'tokens' ? 'จำนวนโทเคนตามโมเดล' : 'จำนวนผู้ใช้งานตามโมเดล';
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DonutChart 
        data={featureData} 
        title={featureTitle} 
        totalValue={totalTokens}
        unit={unit}
      />
      <DonutChart 
        data={modelData} 
        title={modelTitle} 
        totalValue={totalTokens}
        unit={unit}
      />
    </div>
  );
};

export default TokenDonutCharts;

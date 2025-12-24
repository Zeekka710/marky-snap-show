import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricCard as MetricCardType } from '@/types/dashboard';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
interface MetricCardProps {
  metric: MetricCardType;
  size?: 'default' | 'large';
  className?: string;
}
const colorMap: Record<string, {
  line: string;
  fill: string;
}> = {
  blue: {
    line: 'hsl(217, 91%, 53%)',
    fill: 'hsl(217, 91%, 53%, 0.1)'
  },
  orange: {
    line: 'hsl(25, 95%, 53%)',
    fill: 'hsl(25, 95%, 53%, 0.1)'
  },
  green: {
    line: 'hsl(142, 76%, 36%)',
    fill: 'hsl(142, 76%, 36%, 0.1)'
  },
  purple: {
    line: 'hsl(262, 83%, 58%)',
    fill: 'hsl(262, 83%, 58%, 0.1)'
  },
  yellow: {
    line: 'hsl(45, 93%, 47%)',
    fill: 'hsl(45, 93%, 47%, 0.1)'
  }
};
const MetricCard = ({
  metric,
  size = 'default',
  className
}: MetricCardProps) => {
  const isLarge = size === 'large';
  const colors = colorMap[metric.color || 'blue'];
  const chartData = metric.sparkline_data?.map((value, index) => ({
    value,
    index
  })) || [];
  const formatValue = (value: number) => {
    if (metric.metric_name.includes('%')) {
      return `${value}%`;
    }
    return value.toLocaleString('th-TH');
  };
  return <div className={cn("bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow animate-fade-in", isLarge && "col-span-1", className)}>
      <p className="text-sm text-muted-foreground mb-2">{metric.metric_name}</p>
      
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className={cn("font-bold text-foreground", isLarge ? "text-3xl" : "text-2xl")}>
            {formatValue(metric.value)}
          </span>
          
          <div className={cn("flex items-center gap-1 text-sm font-medium", metric.change_direction === 'up' ? "text-success" : "text-destructive")}>
            {metric.change_direction === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {metric.change_direction === 'up' ? '+' : ''}
              {metric.change_percentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Sparkline Chart */}
      {chartData.length > 0 && <div className="mt-4 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${metric.color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.line} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors.line} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={colors.line} strokeWidth={2} fill={`url(#gradient-${metric.color})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>}

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          
          
        </div>
        <div className="flex items-center gap-1.5">
          
          
        </div>
      </div>
    </div>;
};
export default MetricCard;
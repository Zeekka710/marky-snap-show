import { OccupationData } from '@/types/dashboard';
import { ArrowDown } from 'lucide-react';

interface OccupationTableProps {
  data: OccupationData[];
}

const OccupationTable = ({ data }: OccupationTableProps) => {
  return (
    <div className="animate-fade-in">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-1">
                  ลำดับ
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                อาชีพ
              </th>
              <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                จำนวนผู้ใช้งาน (บัญชี)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={item.rank}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-4 px-6 text-sm text-foreground">
                  {item.rank}
                </td>
                <td className="py-4 px-6 text-sm text-foreground">
                  {item.name}
                </td>
                <td className="py-4 px-6 text-sm text-foreground text-right tabular-nums">
                  {item.userCount.toLocaleString('th-TH')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OccupationTable;

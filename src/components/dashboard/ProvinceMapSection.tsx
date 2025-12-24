import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProvinceData } from '@/types/dashboard';
import ThailandMap from './ThailandMap';
import { provinceDataMap } from '@/data/thailandGeoData';

interface ProvinceMapSectionProps {
  provinces: ProvinceData[];
}

const ProvinceMapSection = ({ provinces }: ProvinceMapSectionProps) => {
  const maxValue = Math.max(...Object.values(provinceDataMap));
  const minValue = Math.min(...Object.values(provinceDataMap));

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">ภาพรวมผู้ใช้งานรายจังหวัด</h3>
        <div className="flex items-center gap-3">
          <Select defaultValue="registered">
            <SelectTrigger className="w-[220px]">
              <span className="text-muted-foreground">ภาพรวมผู้ใช้งาน:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="registered">จำนวนผู้ลงทะเบียน</SelectItem>
              <SelectItem value="active">จำนวนผู้ใช้งาน Active</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            ดูอันดับทั้งหมด
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Map */}
        <div className="relative">
          <ThailandMap />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-3 rounded" style={{ backgroundColor: 'hsl(217, 91%, 23%)' }} />
              <span className="text-muted-foreground">{maxValue.toLocaleString('th-TH')}</span>
            </div>
            <div 
              className="w-8 h-32 rounded" 
              style={{ 
                background: 'linear-gradient(to bottom, hsl(217, 91%, 23%), hsl(217, 91%, 83%))' 
              }} 
            />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">{minValue.toLocaleString('th-TH')}</span>
            </div>
          </div>
        </div>

        {/* Top 10 Rankings */}
        <div>
          <h4 className="text-base font-semibold text-foreground mb-4">10 อันดับสูงสุด</h4>
          <div className="space-y-3">
            {provinces.slice(0, 10).map((province) => (
              <div key={province.rank} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-foreground">
                  {province.rank}. {province.name}
                </span>
                <span className="text-sm font-medium text-foreground tabular-nums">
                  {province.value.toLocaleString('th-TH')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvinceMapSection;

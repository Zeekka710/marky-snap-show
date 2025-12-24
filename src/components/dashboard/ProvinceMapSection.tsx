import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProvinceData } from '@/types/dashboard';

interface ProvinceMapSectionProps {
  provinces: ProvinceData[];
}

const ProvinceMapSection = ({ provinces }: ProvinceMapSectionProps) => {
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
        {/* Map Placeholder */}
        <div className="relative">
          <ThailandMapSVG provinces={provinces} />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-8 h-3 bg-primary rounded" />
              <span className="text-muted-foreground">3,013,512</span>
            </div>
            <div className="w-8 h-32 bg-gradient-to-b from-primary to-primary/10 rounded" />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">5</span>
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

// Simplified Thailand Map SVG
const ThailandMapSVG = ({ provinces }: { provinces: ProvinceData[] }) => {
  return (
    <svg viewBox="0 0 400 500" className="w-full h-auto max-h-[400px]">
      {/* Simplified Thailand map outline */}
      <g fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--border))" strokeWidth="0.5">
        {/* Northern region */}
        <path d="M180 50 L220 45 L250 60 L260 90 L240 110 L200 100 L170 80 Z" fill="hsl(var(--primary) / 0.3)" />
        <path d="M200 100 L240 110 L250 140 L220 160 L180 150 L170 120 Z" fill="hsl(var(--primary) / 0.5)" />
        
        {/* Northeastern region */}
        <path d="M250 90 L300 100 L340 120 L350 160 L320 180 L270 170 L250 140 Z" fill="hsl(var(--primary) / 0.4)" />
        <path d="M270 170 L320 180 L340 220 L300 250 L260 230 L250 190 Z" fill="hsl(var(--primary) / 0.35)" />
        
        {/* Central region */}
        <path d="M180 150 L220 160 L250 190 L240 230 L200 250 L160 230 L150 190 Z" fill="hsl(var(--primary) / 0.7)" />
        
        {/* Eastern region */}
        <path d="M260 230 L300 250 L310 290 L280 320 L240 300 L240 260 Z" fill="hsl(var(--primary) / 0.25)" />
        
        {/* Western region */}
        <path d="M120 180 L150 190 L160 230 L140 270 L100 260 L90 220 Z" fill="hsl(var(--primary) / 0.2)" />
        
        {/* Southern region - upper */}
        <path d="M160 270 L200 280 L210 320 L180 360 L140 340 L130 300 Z" fill="hsl(var(--primary) / 0.3)" />
        
        {/* Southern region - lower */}
        <path d="M160 360 L180 380 L175 420 L160 460 L145 470 L130 440 L140 400 Z" fill="hsl(var(--primary) / 0.25)" />
        <path d="M160 460 L175 470 L180 500 L160 520 L145 510 L145 480 Z" fill="hsl(var(--primary) / 0.2)" />
      </g>
      
      {/* Bangkok highlight */}
      <circle cx="200" cy="230" r="8" fill="hsl(var(--primary))" opacity="0.8" />
      <circle cx="200" cy="230" r="12" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" />
    </svg>
  );
};

export default ProvinceMapSection;

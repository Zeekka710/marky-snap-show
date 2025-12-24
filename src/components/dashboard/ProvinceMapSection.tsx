import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ProvinceData } from '@/types/dashboard';
import ThailandMap from './ThailandMap';
import { provinceDataMap } from '@/data/thailandGeoData';
import { Search } from 'lucide-react';

interface ProvinceMapSectionProps {
  provinces: ProvinceData[];
}

const ProvinceMapSection = ({ provinces }: ProvinceMapSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const maxValue = Math.max(...Object.values(provinceDataMap));
  const minValue = Math.min(...Object.values(provinceDataMap));

  // Get all provinces sorted by value
  const allProvinces = Object.entries(provinceDataMap)
    .map(([name, value], index) => ({
      rank: index + 1,
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  // Filter provinces based on search
  const filteredProvinces = allProvinces.filter((province) =>
    province.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total users
  const totalUsers = Object.values(provinceDataMap).reduce((sum, val) => sum + val, 0);

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
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setIsDialogOpen(true)}
          >
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

      {/* All Provinces Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">อันดับจังหวัดทั้งหมด</DialogTitle>
          </DialogHeader>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-b border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{allProvinces.length}</p>
              <p className="text-sm text-muted-foreground">จังหวัด</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalUsers.toLocaleString('th-TH')}</p>
              <p className="text-sm text-muted-foreground">ผู้ใช้งานทั้งหมด</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {Math.round(totalUsers / allProvinces.length).toLocaleString('th-TH')}
              </p>
              <p className="text-sm text-muted-foreground">เฉลี่ยต่อจังหวัด</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาจังหวัด..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Province List */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-1">
              {filteredProvinces.map((province) => (
                <div 
                  key={province.name} 
                  className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        province.rank <= 3 
                          ? 'bg-primary text-primary-foreground' 
                          : province.rank <= 10 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {province.rank}
                    </span>
                    <span className="text-sm font-medium text-foreground">{province.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      {province.value.toLocaleString('th-TH')}
                    </span>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {((province.value / totalUsers) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
              
              {filteredProvinces.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  ไม่พบจังหวัดที่ค้นหา
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProvinceMapSection;

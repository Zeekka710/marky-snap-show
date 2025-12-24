import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { thailandGeoJson, provinceDataMap } from '@/data/thailandGeoData';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ThailandMapProps {
  onProvinceClick?: (province: string, value: number) => void;
}

const ThailandMap = ({ onProvinceClick }: ThailandMapProps) => {
  const [selectedProvince, setSelectedProvince] = useState<{
    name: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const maxValue = useMemo(() => Math.max(...Object.values(provinceDataMap)), []);
  const minValue = useMemo(() => Math.min(...Object.values(provinceDataMap)), []);

  const getProvinceColor = (provinceName: string) => {
    const value = provinceDataMap[provinceName] || 0;
    if (value === 0) return 'hsl(217, 91%, 95%)';
    
    // Normalize value between 0 and 1
    const normalized = (value - minValue) / (maxValue - minValue);
    // Map to opacity between 0.2 and 1
    const opacity = 0.2 + (normalized * 0.8);
    
    return `hsl(217, 91%, ${53 - normalized * 30}%)`;
  };

  const handleProvinceClick = (geo: any, event: React.MouseEvent) => {
    const provinceName = geo.properties.name;
    const value = provinceDataMap[provinceName] || 0;
    
    setSelectedProvince({
      name: provinceName,
      value,
      x: event.clientX,
      y: event.clientY,
    });

    onProvinceClick?.(provinceName, value);
  };

  return (
    <div className="relative w-full h-[400px]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2800,
          center: [100.5, 13.5],
        }}
        className="w-full h-full"
      >
        <ZoomableGroup center={[100.5, 13.5]} zoom={1}>
          <Geographies geography={thailandGeoJson}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const provinceName = geo.properties.name;
                const value = provinceDataMap[provinceName] || 0;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getProvinceColor(provinceName)}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      hover: {
                        fill: 'hsl(217, 91%, 45%)',
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: 'hsl(217, 91%, 40%)',
                        outline: 'none',
                      },
                    }}
                    onClick={(event) => handleProvinceClick(geo, event)}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Popup */}
      {selectedProvince && (
        <div
          className="fixed z-50 bg-card border border-border rounded-lg shadow-lg p-4 min-w-[200px] animate-fade-in"
          style={{
            left: Math.min(selectedProvince.x + 10, window.innerWidth - 220),
            top: Math.min(selectedProvince.y - 60, window.innerHeight - 120),
          }}
          onClick={() => setSelectedProvince(null)}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-foreground">{selectedProvince.name}</h4>
            <button 
              onClick={() => setSelectedProvince(null)}
              className="text-muted-foreground hover:text-foreground text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">จำนวนผู้ลงทะเบียน:</span>
              <span className="font-medium text-foreground">
                {selectedProvince.value.toLocaleString('th-TH')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">% ของทั้งหมด:</span>
              <span className="font-medium text-foreground">
                {((selectedProvince.value / maxValue) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {selectedProvince && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setSelectedProvince(null)}
        />
      )}
    </div>
  );
};

export default ThailandMap;

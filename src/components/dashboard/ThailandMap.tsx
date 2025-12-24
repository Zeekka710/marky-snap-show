import { useState } from 'react';
import { provinceDataMap } from '@/data/thailandGeoData';

interface ThailandMapProps {
  onProvinceClick?: (province: string, value: number) => void;
}

const ThailandMap = ({ onProvinceClick }: ThailandMapProps) => {
  const [selectedProvince, setSelectedProvince] = useState<{
    name: string;
    value: number;
  } | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const maxValue = Math.max(...Object.values(provinceDataMap));
  const minValue = Math.min(...Object.values(provinceDataMap));

  const getProvinceColor = (provinceName: string) => {
    const value = provinceDataMap[provinceName] || 0;
    if (value === 0) return 'hsl(217, 91%, 92%)';
    
    const normalized = (value - minValue) / (maxValue - minValue);
    const lightness = 85 - (normalized * 52);
    
    return `hsl(217, 91%, ${lightness}%)`;
  };

  const handleProvinceClick = (provinceName: string, event: React.MouseEvent) => {
    const value = provinceDataMap[provinceName] || 0;
    const rect = (event.target as SVGElement).getBoundingClientRect();
    
    setPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    
    setSelectedProvince({ name: provinceName, value });
    onProvinceClick?.(provinceName, value);
  };

  const ProvinceShape = ({ name, d }: { name: string; d: string }) => (
    <path
      d={d}
      fill={hoveredProvince === name ? 'hsl(217, 91%, 45%)' : getProvinceColor(name)}
      stroke="hsl(var(--card))"
      strokeWidth="1"
      className="cursor-pointer transition-colors duration-150"
      onMouseEnter={() => setHoveredProvince(name)}
      onMouseLeave={() => setHoveredProvince(null)}
      onClick={(e) => handleProvinceClick(name, e)}
    />
  );

  return (
    <div className="relative w-full h-[400px]">
      <svg viewBox="0 0 200 380" className="w-full h-full" style={{ maxHeight: '400px' }}>
        {/* Northern Region */}
        <ProvinceShape name="เชียงราย" d="M95,15 L115,12 L125,25 L120,40 L100,42 L90,30 Z" />
        <ProvinceShape name="แม่ฮ่องสอน" d="M55,25 L75,22 L82,45 L75,65 L55,62 L48,42 Z" />
        <ProvinceShape name="เชียงใหม่" d="M70,40 L100,38 L108,65 L95,85 L68,82 L60,58 Z" />
        <ProvinceShape name="พะเยา" d="M105,38 L125,35 L132,55 L125,70 L108,68 L102,52 Z" />
        <ProvinceShape name="น่าน" d="M125,45 L148,42 L155,75 L145,95 L125,90 L120,65 Z" />
        <ProvinceShape name="ลำพูน" d="M85,80 L100,78 L105,92 L98,102 L82,98 Z" />
        <ProvinceShape name="ลำปาง" d="M95,65 L120,62 L128,90 L118,108 L92,105 L88,82 Z" />
        <ProvinceShape name="แพร่" d="M115,85 L135,82 L142,105 L132,120 L115,115 L110,98 Z" />
        <ProvinceShape name="อุตรดิตถ์" d="M125,100 L148,95 L158,125 L145,142 L125,138 L120,118 Z" />
        
        {/* Upper Central */}
        <ProvinceShape name="ตาก" d="M50,90 L78,88 L85,135 L70,165 L45,155 L42,115 Z" />
        <ProvinceShape name="สุโขทัย" d="M95,105 L118,102 L125,130 L115,148 L92,145 L88,122 Z" />
        <ProvinceShape name="พิษณุโลก" d="M115,125 L145,120 L155,155 L140,175 L115,170 L108,148 Z" />
        <ProvinceShape name="กำแพงเพชร" d="M80,138 L105,135 L112,165 L100,182 L78,178 L72,155 Z" />
        <ProvinceShape name="พิจิตร" d="M100,160 L125,155 L132,182 L120,198 L98,195 L92,175 Z" />
        <ProvinceShape name="เพชรบูรณ์" d="M130,150 L158,145 L168,195 L152,218 L128,212 L122,178 Z" />
        
        {/* Northeastern Region */}
        <ProvinceShape name="เลย" d="M145,110 L172,105 L182,145 L170,165 L145,160 L138,135 Z" />
        <ProvinceShape name="หนองบัวลำภู" d="M155,148 L175,145 L182,168 L172,182 L155,178 Z" />
        <ProvinceShape name="อุดรธานี" d="M168,135 L195,130 L205,168 L192,188 L168,182 L162,158 Z" />
        <ProvinceShape name="หนองคาย" d="M172,105 L202,100 L212,132 L198,148 L175,142 Z" />
        <ProvinceShape name="บึงกาฬ" d="M200,98 L225,95 L235,125 L222,140 L202,135 Z" />
        <ProvinceShape name="สกลนคร" d="M198,135 L228,130 L238,168 L222,188 L198,182 Z" />
        <ProvinceShape name="นครพนม" d="M228,130 L255,125 L265,175 L248,195 L228,188 Z" />
        <ProvinceShape name="ขอนแก่น" d="M170,175 L202,170 L215,215 L198,235 L170,228 Z" />
        <ProvinceShape name="มุกดาหาร" d="M235,175 L258,170 L268,210 L252,228 L235,222 Z" />
        <ProvinceShape name="กาฬสินธุ์" d="M195,168 L222,165 L232,200 L218,218 L195,212 Z" />
        <ProvinceShape name="มหาสารคาม" d="M185,210 L210,205 L220,238 L205,255 L185,248 Z" />
        <ProvinceShape name="ร้อยเอ็ด" d="M208,200 L238,195 L248,238 L232,258 L208,252 Z" />
        <ProvinceShape name="ยโสธร" d="M232,195 L255,190 L265,228 L250,245 L232,240 Z" />
        <ProvinceShape name="อำนาจเจริญ" d="M252,188 L272,185 L282,218 L268,235 L252,230 Z" />
        <ProvinceShape name="ชัยภูมิ" d="M152,185 L178,180 L188,225 L172,248 L150,242 Z" />
        <ProvinceShape name="นครราชสีมา" d="M145,235 L190,230 L205,290 L180,312 L142,300 Z" />
        <ProvinceShape name="บุรีรัมย์" d="M185,275 L218,270 L232,315 L212,335 L185,325 Z" />
        <ProvinceShape name="สุรินทร์" d="M215,285 L248,280 L262,328 L240,348 L215,338 Z" />
        <ProvinceShape name="ศรีสะเกษ" d="M245,290 L275,285 L290,340 L265,360 L242,348 Z" />
        <ProvinceShape name="อุบลราชธานี" d="M268,260 L305,255 L325,340 L295,365 L265,345 Z" />
        
        {/* Central Region */}
        <ProvinceShape name="นครสวรรค์" d="M85,175 L115,170 L125,210 L110,232 L82,225 Z" />
        <ProvinceShape name="อุทัยธานี" d="M65,185 L88,182 L95,218 L82,238 L62,232 Z" />
        <ProvinceShape name="ชัยนาท" d="M90,220 L110,218 L118,245 L105,260 L88,255 Z" />
        <ProvinceShape name="ลพบุรี" d="M115,215 L145,210 L155,255 L138,275 L112,268 Z" />
        <ProvinceShape name="สิงห์บุรี" d="M100,250 L118,248 L125,270 L115,282 L100,278 Z" />
        <ProvinceShape name="อ่างทอง" d="M98,275 L115,272 L122,292 L110,302 L98,298 Z" />
        <ProvinceShape name="สุพรรณบุรี" d="M62,235 L92,230 L102,282 L85,305 L58,295 Z" />
        <ProvinceShape name="สระบุรี" d="M125,265 L152,260 L162,300 L145,318 L125,310 Z" />
        <ProvinceShape name="อยุธยา" d="M100,290 L128,285 L138,325 L120,342 L98,335 Z" />
        <ProvinceShape name="นครปฐม" d="M70,305 L95,300 L105,338 L88,355 L68,348 Z" />
        <ProvinceShape name="นนทบุรี" d="M92,330 L108,328 L115,348 L105,358 L92,355 Z" />
        <ProvinceShape name="ปทุมธานี" d="M108,320 L128,318 L135,342 L122,355 L108,350 Z" />
        <ProvinceShape name="กรุงเทพมหานคร" d="M98,352 L120,348 L128,372 L115,385 L95,380 Z" />
        <ProvinceShape name="สมุทรปราการ" d="M115,378 L135,375 L142,398 L128,408 L115,402 Z" />
        
        {/* Eastern Region */}
        <ProvinceShape name="นครนายก" d="M135,312 L158,308 L168,340 L155,355 L135,348 Z" />
        <ProvinceShape name="ปราจีนบุรี" d="M152,325 L182,320 L195,365 L175,385 L150,375 Z" />
        <ProvinceShape name="สระแก้ว" d="M178,335 L215,330 L230,385 L205,408 L175,395 Z" />
        <ProvinceShape name="ฉะเชิงเทรา" d="M135,365 L165,360 L175,400 L155,418 L132,410 Z" />
        <ProvinceShape name="ชลบุรี" d="M128,405 L158,400 L168,445 L148,465 L125,455 Z" />
        <ProvinceShape name="ระยอง" d="M155,445 L185,440 L195,478 L175,495 L155,485 Z" />
        <ProvinceShape name="จันทบุรี" d="M178,475 L215,470 L228,525 L202,548 L175,535 Z" />
        <ProvinceShape name="ตราด" d="M210,530 L240,525 L252,568 L230,585 L208,572 Z" />
        
        {/* Western Region */}
        <ProvinceShape name="กาญจนบุรี" d="M35,205 L68,200 L82,280 L60,325 L28,305 Z" />
        <ProvinceShape name="ราชบุรี" d="M55,320 L82,315 L92,358 L75,378 L52,368 Z" />
        <ProvinceShape name="สมุทรสาคร" d="M78,368 L98,365 L105,390 L92,402 L78,395 Z" />
        <ProvinceShape name="สมุทรสงคราม" d="M68,392 L85,388 L92,412 L78,425 L68,418 Z" />
        <ProvinceShape name="เพชรบุรี" d="M52,405 L78,400 L88,455 L68,478 L48,465 Z" />
        <ProvinceShape name="ประจวบคีรีขันธ์" d="M45,475 L72,470 L82,565 L62,588 L42,572 Z" />
        
        {/* Southern Region */}
        <ProvinceShape name="ชุมพร" d="M58,580 L85,575 L95,640 L75,665 L55,650 Z" />
        <ProvinceShape name="ระนอง" d="M42,595 L62,590 L72,648 L55,668 L40,655 Z" />
        <ProvinceShape name="สุราษฎร์ธานี" d="M68,655 L108,650 L122,725 L95,752 L62,735 Z" />
        <ProvinceShape name="พังงา" d="M48,680 L72,675 L82,738 L62,758 L45,742 Z" />
        <ProvinceShape name="ภูเก็ต" d="M52,755 L72,752 L78,785 L62,798 L50,785 Z" />
        <ProvinceShape name="กระบี่" d="M72,745 L98,740 L108,798 L88,818 L68,805 Z" />
        <ProvinceShape name="นครศรีธรรมราช" d="M92,725 L135,720 L148,798 L118,825 L88,810 Z" />
        <ProvinceShape name="ตรัง" d="M72,815 L102,810 L112,865 L88,885 L68,868 Z" />
        <ProvinceShape name="พัทลุง" d="M108,802 L135,798 L145,855 L125,875 L105,862 Z" />
        <ProvinceShape name="สงขลา" d="M125,850 L165,845 L180,925 L148,952 L120,935 Z" />
        <ProvinceShape name="สตูล" d="M68,875 L95,870 L105,925 L82,945 L65,928 Z" />
        <ProvinceShape name="ปัตตานี" d="M155,920 L185,915 L195,958 L172,975 L152,962 Z" />
        <ProvinceShape name="ยะลา" d="M142,958 L178,952 L190,1005 L162,1025 L138,1008 Z" />
        <ProvinceShape name="นราธิวาส" d="M175,970 L210,965 L225,1030 L195,1052 L172,1035 Z" />
      </svg>

      {/* Hover tooltip */}
      {hoveredProvince && !selectedProvince && (
        <div className="absolute top-2 left-2 bg-card border border-border rounded-lg shadow-md px-3 py-2 text-sm pointer-events-none z-10">
          <span className="font-medium text-foreground">{hoveredProvince}</span>
          <span className="text-muted-foreground ml-2">
            {(provinceDataMap[hoveredProvince] || 0).toLocaleString('th-TH')}
          </span>
        </div>
      )}

      {/* Click popup */}
      {selectedProvince && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setSelectedProvince(null)}
          />
          <div
            className="fixed z-50 bg-card border border-border rounded-lg shadow-lg p-4 min-w-[220px] animate-fade-in"
            style={{
              left: Math.min(Math.max(popupPosition.x - 110, 10), window.innerWidth - 240),
              top: Math.max(popupPosition.y - 100, 10),
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">{selectedProvince.name}</h4>
              <button 
                onClick={() => setSelectedProvince(null)}
                className="text-muted-foreground hover:text-foreground text-xl leading-none w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">จำนวนผู้ลงทะเบียน:</span>
                <span className="font-medium text-foreground">
                  {selectedProvince.value.toLocaleString('th-TH')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">สัดส่วน:</span>
                <span className="font-medium text-foreground">
                  {((selectedProvince.value / maxValue) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThailandMap;

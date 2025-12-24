import { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { provinceDataMap } from '@/data/thailandGeoData';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ThailandMapProps {
  onProvinceClick?: (province: string, value: number) => void;
}

// Province code to Thai name mapping
const provinceCodeToName: Record<string, string> = {
  'th-ct': 'จันทบุรี',
  'th-4255': 'บึงกาฬ',
  'th-pg': 'พังงา',
  'th-st': 'สตูล',
  'th-kr': 'กระบี่',
  'th-sa': 'สระแก้ว',
  'th-tg': 'ตรัง',
  'th-tt': 'ตราด',
  'th-pl': 'พัทลุง',
  'th-ps': 'พิษณุโลก',
  'th-kp': 'กำแพงเพชร',
  'th-pc': 'ปราจีนบุรี',
  'th-sh': 'สิงห์บุรี',
  'th-at': 'อ่างทอง',
  'th-lb': 'ลพบุรี',
  'th-pa': 'ปทุมธานี',
  'th-np': 'นครปฐม',
  'th-sb': 'สระบุรี',
  'th-cn': 'ชัยนาท',
  'th-bm': 'กรุงเทพมหานคร',
  'th-pt': 'พะเยา',
  'th-no': 'หนองบัวลำภู',
  'th-sp': 'สมุทรปราการ',
  'th-ss': 'สมุทรสาคร',
  'th-sm': 'สมุทรสงคราม',
  'th-pe': 'เพชรบุรี',
  'th-cc': 'ฉะเชิงเทรา',
  'th-nn': 'หนองคาย',
  'th-cb': 'ชลบุรี',
  'th-br': 'บุรีรัมย์',
  'th-kk': 'ขอนแก่น',
  'th-ph': 'เพชรบูรณ์',
  'th-kl': 'กาฬสินธุ์',
  'th-sr': 'สุรินทร์',
  'th-nr': 'นครราชสีมา',
  'th-si': 'ศรีสะเกษ',
  'th-re': 'ร้อยเอ็ด',
  'th-le': 'เลย',
  'th-nk': 'นครพนม',
  'th-ac': 'อำนาจเจริญ',
  'th-md': 'มุกดาหาร',
  'th-sn': 'สกลนคร',
  'th-nw': 'นครสวรรค์',
  'th-pi': 'พิจิตร',
  'th-rn': 'ระนอง',
  'th-nt': 'นนทบุรี',
  'th-sg': 'สงขลา',
  'th-pr': 'แพร่',
  'th-py': 'พระนครศรีอยุธยา',
  'th-so': 'สุโขทัย',
  'th-ud': 'อุดรธานี',
  'th-kn': 'กาญจนบุรี',
  'th-tk': 'ตาก',
  'th-ut': 'อุทัยธานี',
  'th-ns': 'นครศรีธรรมราช',
  'th-pk': 'ประจวบคีรีขันธ์',
  'th-ur': 'อุตรดิตถ์',
  'th-sk': 'สุราษฎร์ธานี',
  'th-ry': 'ระยอง',
  'th-cy': 'ชัยภูมิ',
  'th-su': 'สุพรรณบุรี',
  'th-nf': 'นครนายก',
  'th-bk': 'ภูเก็ต',
  'th-mh': 'แม่ฮ่องสอน',
  'th-pu': 'ปัตตานี',
  'th-cp': 'ชุมพร',
  'th-yl': 'ยะลา',
  'th-cr': 'เชียงราย',
  'th-cm': 'เชียงใหม่',
  'th-ln': 'ลำปาง',
  'th-na': 'น่าน',
  'th-lg': 'ลำพูน',
  'th-pb': 'ปราจีนบุรี',
  'th-rt': 'ราชบุรี',
  'th-ys': 'ยโสธร',
  'th-ms': 'มหาสารคาม',
  'th-un': 'อุบลราชธานี',
  'th-nb': 'นราธิวาส',
};

const ThailandMap = ({ onProvinceClick }: ThailandMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  
  const [selectedProvince, setSelectedProvince] = useState<{
    name: string;
    value: number;
  } | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [hoveredValue, setHoveredValue] = useState<number>(0);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(1);

  const maxValue = Math.max(...Object.values(provinceDataMap));
  const minValue = Math.min(...Object.values(provinceDataMap));

  const getProvinceColor = useCallback((provinceName: string) => {
    const value = provinceDataMap[provinceName] || 0;
    if (value === 0) return 'hsl(217, 91%, 92%)';
    
    const normalized = (value - minValue) / (maxValue - minValue);
    const lightness = 85 - (normalized * 52);
    
    return `hsl(217, 91%, ${lightness}%)`;
  }, [minValue, maxValue]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.5);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 0.67);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  }, []);

  useEffect(() => {
    const fetchAndRenderMap = async () => {
      try {
        const response = await fetch(
          'https://code.highcharts.com/mapdata/countries/th/th-all.topo.json'
        );
        const topology = await response.json();
        
        if (!svgRef.current || !containerRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = 400;

        // Create a group for zoomable content
        const g = svg.append('g');
        gRef.current = g;

        // Extract GeoJSON features from TopoJSON
        const geojson = topojson.feature(topology, topology.objects.default) as any;

        // Create projection centered on Thailand
        const projection = d3.geoMercator()
          .fitSize([containerWidth - 20, containerHeight - 20], geojson);

        const path = d3.geoPath().projection(projection);

        // Create zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([1, 8])
          .translateExtent([[0, 0], [containerWidth, containerHeight]])
          .on('zoom', (event) => {
            g.attr('transform', event.transform);
            setCurrentZoom(event.transform.k);
            // Adjust stroke width based on zoom level
            g.selectAll('path').attr('stroke-width', 0.5 / event.transform.k);
          });

        zoomRef.current = zoom;

        // Apply zoom behavior to SVG
        svg.call(zoom);

        // Draw provinces
        g.selectAll('path')
          .data(geojson.features)
          .enter()
          .append('path')
          .attr('d', path as any)
          .attr('fill', (d: any) => {
            const code = d.properties['hc-key'];
            const thaiName = provinceCodeToName[code] || d.properties.name;
            return getProvinceColor(thaiName);
          })
          .attr('stroke', 'hsl(var(--card))')
          .attr('stroke-width', 0.5)
          .attr('cursor', 'pointer')
          .attr('class', 'transition-colors duration-150')
          .on('mouseenter', function(event: MouseEvent, d: any) {
            const code = d.properties['hc-key'];
            const thaiName = provinceCodeToName[code] || d.properties.name;
            const value = provinceDataMap[thaiName] || 0;
            
            d3.select(this).attr('fill', 'hsl(217, 91%, 45%)');
            setHoveredProvince(thaiName);
            setHoveredValue(value);
            
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              setTooltipPosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top - 40
              });
            }
          })
          .on('mousemove', function(event: MouseEvent) {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              setTooltipPosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top - 40
              });
            }
          })
          .on('mouseleave', function(event: MouseEvent, d: any) {
            const code = d.properties['hc-key'];
            const thaiName = provinceCodeToName[code] || d.properties.name;
            d3.select(this).attr('fill', getProvinceColor(thaiName));
            setHoveredProvince(null);
          })
          .on('click', function(event: MouseEvent, d: any) {
            event.stopPropagation();
            const code = d.properties['hc-key'];
            const thaiName = provinceCodeToName[code] || d.properties.name;
            const value = provinceDataMap[thaiName] || 0;
            
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              setPopupPosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
              });
            }
            
            setSelectedProvince({ name: thaiName, value });
            onProvinceClick?.(thaiName, value);
          });

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Thailand map:', error);
        setIsLoading(false);
      }
    };

    fetchAndRenderMap();

    // Handle resize
    const handleResize = () => {
      fetchAndRenderMap();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onProvinceClick, getProvinceColor]);

  return (
    <div ref={containerRef} className="relative w-full h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-card/90 backdrop-blur-sm"
          onClick={handleZoomIn}
          title="ซูมเข้า"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-card/90 backdrop-blur-sm"
          onClick={handleZoomOut}
          title="ซูมออก"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-card/90 backdrop-blur-sm"
          onClick={handleReset}
          title="รีเซ็ต"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-2 right-2 z-20 bg-card/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground">
        {Math.round(currentZoom * 100)}%
      </div>
      
      <svg 
        ref={svgRef} 
        width="100%" 
        height="400"
        className="w-full cursor-grab active:cursor-grabbing"
      />

      {/* Hover tooltip */}
      {hoveredProvince && !selectedProvince && (
        <div 
          className="absolute bg-card border border-border rounded-lg shadow-md px-3 py-2 text-sm pointer-events-none z-10"
          style={{
            left: Math.min(Math.max(tooltipPosition.x - 60, 10), containerRef.current?.clientWidth ? containerRef.current.clientWidth - 150 : 200),
            top: Math.max(tooltipPosition.y, 10)
          }}
        >
          <span className="font-medium text-foreground">{hoveredProvince}</span>
          <span className="text-muted-foreground ml-2">
            {hoveredValue.toLocaleString('th-TH')}
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
            className="absolute z-50 bg-card border border-border rounded-lg shadow-lg p-4 min-w-[220px] animate-fade-in"
            style={{
              left: Math.min(Math.max(popupPosition.x - 110, 10), containerRef.current?.clientWidth ? containerRef.current.clientWidth - 240 : 200),
              top: Math.max(popupPosition.y - 120, 10),
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

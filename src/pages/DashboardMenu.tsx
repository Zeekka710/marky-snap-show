import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { BarChart3, DollarSign, Menu, FileText, Users, FileCheck } from 'lucide-react';

const DashboardMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">แดชบอร์ด</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          {/* Usage Trend Card */}
          <div 
            onClick={() => navigate('/usage-trend')}
            className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-200 group"
          >
            <div className="aspect-square flex items-center justify-center mb-4">
              <div className="relative">
                {/* Chart illustration */}
                <div className="w-40 h-32 relative">
                  {/* Background decorations */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-muted/50 rounded-full opacity-60" />
                  <div className="absolute bottom-4 left-0 w-8 h-8 bg-muted/30 rounded-full opacity-40" />
                  
                  {/* Easel/Stand */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Stand legs */}
                      <line x1="25" y1="60" x2="15" y2="95" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round"/>
                      <line x1="75" y1="60" x2="85" y2="95" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round"/>
                      <line x1="50" y1="60" x2="50" y2="95" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
                      
                      {/* Board */}
                      <rect x="15" y="10" width="70" height="50" rx="3" fill="white" stroke="hsl(var(--border))" strokeWidth="2"/>
                      
                      {/* Chart bars */}
                      <rect x="25" y="35" width="8" height="20" fill="hsl(var(--chart-1))" rx="1"/>
                      <rect x="38" y="25" width="8" height="30" fill="hsl(var(--chart-2))" rx="1"/>
                      <rect x="51" y="30" width="8" height="25" fill="hsl(var(--chart-3))" rx="1"/>
                      <rect x="64" y="20" width="8" height="35" fill="hsl(var(--chart-4))" rx="1"/>
                      
                      {/* Magnifying glass */}
                      <circle cx="75" cy="45" r="8" fill="none" stroke="hsl(var(--chart-5))" strokeWidth="2"/>
                      <line x1="81" y1="51" x2="88" y2="58" stroke="hsl(var(--chart-5))" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-center text-lg font-medium text-foreground group-hover:text-primary transition-colors">
              Usage Trend
            </h3>
          </div>

          {/* Cost Management Card */}
          <div 
            onClick={() => navigate('/cost-management')}
            className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-200 group"
          >
            <div className="aspect-square flex items-center justify-center mb-4">
              <div className="relative">
                {/* Chart illustration */}
                <div className="w-40 h-32 relative">
                  {/* Background decorations */}
                  <div className="absolute top-2 left-4 w-10 h-10 bg-muted/40 rounded-full opacity-50" />
                  <div className="absolute top-0 right-2 w-6 h-6 bg-muted/30 rounded-full opacity-30" />
                  
                  <svg viewBox="0 0 120 100" className="w-full h-full">
                    {/* Background chart bars */}
                    <rect x="15" y="50" width="12" height="35" fill="hsl(var(--chart-3))" rx="2"/>
                    <rect x="32" y="35" width="12" height="50" fill="hsl(var(--chart-4))" rx="2"/>
                    <rect x="49" y="45" width="12" height="40" fill="hsl(var(--chart-2))" rx="2"/>
                    <rect x="66" y="25" width="12" height="60" fill="hsl(var(--chart-1))" rx="2"/>
                    
                    {/* Trend line */}
                    <path d="M 20 60 Q 45 30, 72 20" fill="none" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round"/>
                    <polygon points="75,15 85,22 78,25" fill="hsl(var(--foreground))"/>
                    
                    {/* Cost icon */}
                    <rect x="85" y="50" width="25" height="25" rx="4" fill="hsl(var(--chart-5))" />
                    <path d="M 97 57 L 97 70 M 93 60 L 101 60 M 93 67 L 101 67" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-center text-lg font-medium text-foreground group-hover:text-primary transition-colors">
              Cost Management
            </h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMenu;

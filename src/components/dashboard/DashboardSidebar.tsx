import { LayoutDashboard, Users, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  className?: string;
}

const DashboardSidebar = ({ className }: DashboardSidebarProps) => {
  return (
    <aside className={cn(
      "w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0",
      className
    )}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-primary flex items-center justify-center">
          <span className="text-sidebar-primary-foreground font-bold text-lg">AI</span>
        </div>
        <span className="font-semibold text-sidebar-foreground text-lg">TH-AI Passport</span>
        <button className="ml-auto text-sidebar-foreground/60 hover:text-sidebar-foreground">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <NavItem icon={Users} label="จัดการแอดมินและผู้ใช้งาน" />
        <NavItem icon={LayoutDashboard} label="แดชบอร์ด" active />
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <Users className="w-5 h-5 text-sidebar-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Papon Believe</p>
            <p className="text-xs text-muted-foreground truncate">Super Admin</p>
          </div>
          <button className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon: Icon, label, active }: NavItemProps) => {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};

export default DashboardSidebar;

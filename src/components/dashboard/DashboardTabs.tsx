import { cn } from '@/lib/utils';
interface Tab {
  id: string;
  label: string;
}
interface DashboardTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}
const DashboardTabs = ({
  tabs,
  activeTab,
  onTabChange
}: DashboardTabsProps) => {
  return;
};
export default DashboardTabs;
import { Users } from 'lucide-react';

interface TotalUsersCardProps {
  totalUsers: number;
}

const TotalUsersCard = ({ totalUsers }: TotalUsersCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm mb-6 animate-fade-in">
      <p className="text-sm text-muted-foreground mb-2">จำนวนผู้ใช้งานทั้งหมด</p>
      <div className="flex items-center justify-between">
        <span className="text-4xl font-bold text-foreground">
          {totalUsers.toLocaleString('th-TH')}
        </span>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default TotalUsersCard;

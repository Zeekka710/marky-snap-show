interface TotalUsersCardProps {
  totalUsers: number;
}

const TotalUsersCard = ({ totalUsers }: TotalUsersCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm animate-fade-in">
      <p className="text-sm text-muted-foreground mb-2">จำนวนผู้ลงทะเบียนสะสม</p>
      <span className="text-4xl font-bold text-foreground">
        {totalUsers.toLocaleString('th-TH')}
      </span>
    </div>
  );
};

export default TotalUsersCard;

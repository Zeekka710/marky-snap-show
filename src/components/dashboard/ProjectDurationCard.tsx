import { Calendar } from 'lucide-react';
import { differenceInDays, isAfter } from 'date-fns';

interface ProjectDurationCardProps {
  startDate: Date;
  endDate?: Date; // Optional - if not provided, project is ongoing
}

const ProjectDurationCard = ({ startDate, endDate }: ProjectDurationCardProps) => {
  const today = new Date();
  const isOngoing = !endDate || isAfter(endDate, today);
  
  // Calculate duration
  const getDuration = () => {
    const end = isOngoing ? today : endDate!;
    const days = differenceInDays(end, startDate);
    
    if (days < 30) {
      return `${days} วัน`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return remainingDays > 0 
        ? `${months} เดือน ${remainingDays} วัน`
        : `${months} เดือน`;
    } else {
      const years = Math.floor(days / 365);
      const remainingMonths = Math.floor((days % 365) / 30);
      return remainingMonths > 0
        ? `${years} ปี ${remainingMonths} เดือน`
        : `${years} ปี`;
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <p className="text-sm text-muted-foreground mb-2">ระยะเวลาของโครงการ</p>
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-primary" />
        <span className="text-lg font-semibold text-foreground">
          {getDuration()}
          {isOngoing && (
            <span className="ml-2 text-sm font-normal text-primary">(กำลังดำเนินการ)</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default ProjectDurationCard;

import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface ProjectDurationCardProps {
  startDate: Date;
  endDate?: Date;
}

const ProjectDurationCard = ({ startDate, endDate }: ProjectDurationCardProps) => {
  const formatDate = (date: Date) => {
    return format(date, 'd MMM yyyy', { locale: th });
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <p className="text-sm text-muted-foreground mb-3">ระยะเวลาโครงการ</p>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">เริ่มต้น</p>
            <span className="text-lg font-semibold text-foreground">{formatDate(startDate)}</span>
          </div>
        </div>
        <div className="text-muted-foreground">—</div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">สิ้นสุด</p>
            <span className="text-lg font-semibold text-foreground">
              {endDate ? formatDate(endDate) : 'ไม่ระบุ'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDurationCard;

import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface ProjectDurationCardProps {
  startDate: Date;
  endDate: Date;
}

const ProjectDurationCard = ({ startDate, endDate }: ProjectDurationCardProps) => {
  const formatDate = (date: Date) => {
    return format(date, 'd MMM yyyy', { locale: th });
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <p className="text-sm text-muted-foreground mb-2">ระยะเวลาของโครงการ</p>
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-primary" />
        <span className="text-lg font-semibold text-foreground">
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
      </div>
    </div>
  );
};

export default ProjectDurationCard;

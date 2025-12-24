import { useState } from 'react';
import { OccupationData } from '@/types/dashboard';
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface OccupationTableProps {
  data: OccupationData[];
}

const OccupationTable = ({ data }: OccupationTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground w-24">
                <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                  ลำดับ
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                อาชีพ
              </th>
              <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">
                จำนวนผู้ใช้งาน (บัญชี)
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr 
                key={item.rank}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="py-4 px-6 text-sm text-foreground">
                  {item.rank}
                </td>
                <td className="py-4 px-6 text-sm text-foreground">
                  {item.name}
                </td>
                <td className="py-4 px-6 text-sm text-foreground text-right tabular-nums">
                  {item.userCount.toLocaleString('th-TH')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>จำนวนแถวต่อหน้า :</span>
            <Select value={String(rowsPerPage)} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {startIndex + 1}-{Math.min(endIndex, data.length)} จาก {data.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OccupationTable;

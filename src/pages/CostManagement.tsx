import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import TokenDonutCharts from '@/components/dashboard/TokenDonutCharts';
import {
  tokenByOccupationData,
  modelOptions,
  featureOptions,
} from '@/data/costManagementData';
import {
  tokenByFeatureData,
  tokenByFeatureByModelData,
  tokenByModelData,
  totalTokens,
  totalUsersOverview,
} from '@/data/mockDashboardData';

const CostManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'occupation' | 'feature'>('occupation');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedModel, setSelectedModel] = useState('all');
  const [selectedFeature, setSelectedFeature] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(tokenByOccupationData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = tokenByOccupationData.slice(startIndex, startIndex + rowsPerPage);

  const formatNumber = (num: number) => {
    return num.toLocaleString('th-TH');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Cost Management Dashboard</h1>
        </div>

        {/* Breadcrumb */}
        <div className="ml-12 mb-6 text-sm text-muted-foreground">
          <span>แดชบอร์ด</span>
          <span className="mx-2">•</span>
          <span>Cost Management Dashboard</span>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-3">ตัวกรอง</p>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal min-w-[200px]"
                >
                  <span className="text-muted-foreground mr-2">ช่วงเวลา:</span>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'd MMMM yyyy', { locale: th })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Model Filter */}
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px]">
                <span className="text-muted-foreground mr-2">โมเดล:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Feature Filter */}
            <Select value={selectedFeature} onValueChange={setSelectedFeature}>
              <SelectTrigger className="w-[180px]">
                <span className="text-muted-foreground mr-2">ฟีเจอร์:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {featureOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Total Tokens and Users Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">จำนวนโทเคนที่ถูกใช้งานทั้งหมด</p>
                <p className="text-3xl font-bold text-foreground">{formatNumber(totalTokens)}</p>
              </div>
              <Button variant="outline" size="icon" className="rounded-full">
                <Eye className="h-5 w-5 text-primary" />
              </Button>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">จำนวนผู้ใช้งาน (บัญชี)</p>
                <p className="text-3xl font-bold text-foreground">{formatNumber(totalUsersOverview)}</p>
              </div>
              <Button variant="outline" size="icon" className="rounded-full">
                <Eye className="h-5 w-5 text-primary" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('occupation')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'occupation'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            จำนวนโทเคนที่ถูกใช้งานแยกตามอาชีพ
            {activeTab === 'occupation' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('feature')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'feature'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            จำนวนโทเคนที่ถูกใช้งานแยกตามฟีเจอร์
            {activeTab === 'feature' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'occupation' ? (
          <Card className="overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center gap-2">
                        ลำดับ
                        <span className="text-xs">↓</span>
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      อาชีพ
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                      จำนวนโทเคนที่ถูกใช้งาน
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.rank} className="border-b border-border last:border-0">
                      <td className="py-4 px-6 text-sm text-foreground">{item.rank}</td>
                      <td className="py-4 px-6 text-sm text-foreground">{item.occupation}</td>
                      <td className="py-4 px-6 text-sm text-foreground">
                        {formatNumber(item.tokenCount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-4 p-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>จำนวนแถวต่อหน้า :</span>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                {startIndex + 1}-{Math.min(startIndex + rowsPerPage, tokenByOccupationData.length)}{' '}
                จาก {tokenByOccupationData.length}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <TokenDonutCharts
              featureData={tokenByFeatureData}
              modelData={tokenByModelData}
              totalTokens={totalTokens}
            />
            
            {/* Horizontal Bar Chart for Token by Feature */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary">
                  จำนวนโทเคนตามฟีเจอร์การใช้งาน
                </h3>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[200px]">
                    <span className="text-muted-foreground mr-2">โมเดล:</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={tokenByFeatureByModelData[selectedModel] || tokenByFeatureByModelData['all']}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 120, bottom: 30 }}
                  >
                    <XAxis
                      type="number"
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                      width={110}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M`, 'โทเคน']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                      {(tokenByFeatureByModelData[selectedModel] || tokenByFeatureByModelData['all']).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default CostManagement;

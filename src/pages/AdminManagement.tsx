import { useState, useRef } from 'react';
import { Search, Clock, Plus, ChevronDown, Upload, X, FileSpreadsheet } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ImportedEmail {
  email: string;
  order: number;
}

const AdminManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('central');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'central' | 'project'>('central');
  const [email, setEmail] = useState('');
  const [importedEmails, setImportedEmails] = useState<ImportedEmail[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAddAdmin = (type: 'central' | 'project') => {
    setAddModalType(type);
    setIsAddModalOpen(true);
    setEmail('');
    setImportedEmails([]);
    setUploadedFileName(null);
  };

  const parseCSV = (content: string): ImportedEmail[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const emails: ImportedEmail[] = [];
    
    lines.forEach((line, index) => {
      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
      // Find email column (look for @ symbol)
      const emailCol = columns.find(col => col.includes('@'));
      if (emailCol && emailCol.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        emails.push({ email: emailCol, order: index + 1 });
      }
    });
    
    return emails;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = ['csv', 'xls', 'xlsx'].includes(fileExtension || '');

    if (!validTypes.includes(file.type) && !isValidExtension) {
      toast({
        title: 'ไฟล์ไม่ถูกต้อง',
        description: 'กรุณาเลือกไฟล์ CSV หรือ Excel (.csv, .xls, .xlsx)',
        variant: 'destructive',
      });
      return;
    }

    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const emails = parseCSV(content);
      
      if (emails.length === 0) {
        toast({
          title: 'ไม่พบอีเมล',
          description: 'ไม่พบอีเมลที่ถูกต้องในไฟล์',
          variant: 'destructive',
        });
        return;
      }

      setImportedEmails(emails);
      toast({
        title: 'นำเข้าสำเร็จ',
        description: `พบ ${emails.length} อีเมลในไฟล์`,
      });
    };
    reader.readAsText(file);
  };

  const handleRemoveImportedEmail = (order: number) => {
    setImportedEmails(prev => prev.filter(e => e.order !== order));
  };

  const handleClearFile = () => {
    setUploadedFileName(null);
    setImportedEmails([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    const emailsToAdd = importedEmails.length > 0 
      ? importedEmails.map(e => e.email) 
      : email ? [email] : [];
    
    if (emailsToAdd.length === 0) {
      toast({
        title: 'กรุณาระบุอีเมล',
        description: 'กรุณากรอกอีเมลหรืออัพโหลดไฟล์',
        variant: 'destructive',
      });
      return;
    }

    console.log('Adding admins:', { type: addModalType, emails: emailsToAdd });
    toast({
      title: 'เพิ่มแอดมินสำเร็จ',
      description: `เพิ่ม ${emailsToAdd.length} แอดมินเรียบร้อยแล้ว`,
    });
    setIsAddModalOpen(false);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-muted/50 rounded-xl flex items-center justify-center">
          <div className="space-y-2">
            <div className="flex gap-1 justify-center">
              <div className="w-2 h-2 bg-primary/40 rounded-full" />
              <div className="w-2 h-2 bg-primary/40 rounded-full" />
              <div className="w-2 h-2 bg-primary/40 rounded-full" />
            </div>
            <div className="w-16 h-2 bg-muted rounded" />
            <div className="w-12 h-2 bg-muted rounded mx-auto" />
          </div>
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-primary/30 rounded-full" />
        <div className="absolute -bottom-3 -left-3 w-3 h-3 bg-primary/20 rounded-full" />
        <div className="absolute top-1/2 -right-6 w-1.5 h-1.5 bg-muted-foreground/30 rounded-full" />
        <div className="absolute -top-4 left-1/3 w-1 h-1 bg-muted-foreground/40 rounded-full" />
      </div>
      <p className="text-muted-foreground">ไม่พบข้อมูล</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">จัดการแอดมินและผู้ใช้งาน</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Clock className="w-4 h-4" />
              Activity Log
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  เพิ่ม / นำเข้าแอดมิน
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleAddAdmin('central')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  เพิ่มแอดมินกลาง
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddAdmin('project')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  เพิ่มแอดมินโครงการ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
            <TabsTrigger 
              value="central" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-6 py-3"
            >
              แอดมินกลาง
            </TabsTrigger>
            <TabsTrigger 
              value="project" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-6 py-3"
            >
              แอดมินโครงการ
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-6 py-3"
            >
              ผู้ใช้งาน
            </TabsTrigger>
          </TabsList>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ค้นหาอีเมล หรือชื่อ นามสกุล"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Search className="w-4 h-4" />
              ค้นหา
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <span className="text-muted-foreground">สถานะ </span>
                <SelectValue placeholder="ทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="active">ใช้งาน</SelectItem>
                <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <TabsContent value="central" className="mt-0">
            <div className="bg-card rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-medium">
                      <div className="flex items-center gap-1">
                        อีเมล
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium">ชื่อ นามสกุล</TableHead>
                    <TableHead className="font-medium">โครงการที่ดูแล</TableHead>
                    <TableHead className="font-medium">ตำแหน่ง</TableHead>
                    <TableHead className="font-medium">เบอร์โทรศัพท์</TableHead>
                    <TableHead className="font-medium">สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Empty state */}
                </TableBody>
              </Table>
              <EmptyState />
            </div>
          </TabsContent>

          <TabsContent value="project" className="mt-0">
            <div className="bg-card rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-medium">
                      <div className="flex items-center gap-1">
                        อีเมล
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium">ชื่อ นามสกุล</TableHead>
                    <TableHead className="font-medium">โครงการที่ดูแล</TableHead>
                    <TableHead className="font-medium">ตำแหน่ง</TableHead>
                    <TableHead className="font-medium">เบอร์โทรศัพท์</TableHead>
                    <TableHead className="font-medium">สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Empty state */}
                </TableBody>
              </Table>
              <EmptyState />
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            <div className="bg-card rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-medium">
                      <div className="flex items-center gap-1">
                        อีเมล
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium">ชื่อ นามสกุล</TableHead>
                    <TableHead className="font-medium">โครงการที่ดูแล</TableHead>
                    <TableHead className="font-medium">ตำแหน่ง</TableHead>
                    <TableHead className="font-medium">เบอร์โทรศัพท์</TableHead>
                    <TableHead className="font-medium">สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Empty state */}
                </TableBody>
              </Table>
              <EmptyState />
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Admin Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {addModalType === 'central' ? 'เพิ่มแอดมินกลาง (รายบุคคล)' : 'เพิ่มแอดมินโครงการ (รายบุคคล)'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  อีเมล<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  disabled={importedEmails.length > 0}
                />
              </div>

              {/* Imported emails list */}
              {importedEmails.length > 0 && (
                <div className="space-y-2">
                  <Label>รายชื่อที่นำเข้า ({importedEmails.length} อีเมล)</Label>
                  <div className="max-h-40 overflow-y-auto border border-border rounded-lg p-2 space-y-1">
                    {importedEmails.map((item) => (
                      <div 
                        key={item.order} 
                        className="flex items-center justify-between bg-muted/50 rounded px-3 py-1.5 text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-muted-foreground w-6">{item.order}.</span>
                          {item.email}
                        </span>
                        <button
                          onClick={() => handleRemoveImportedEmail(item.order)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded file indicator */}
              {uploadedFileName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="flex-1 truncate">{uploadedFileName}</span>
                  <button
                    onClick={handleClearFile}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  อัพโหลด
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleSubmit}>
                  ตกลง
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminManagement;

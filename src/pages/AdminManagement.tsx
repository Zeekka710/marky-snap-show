import { useState, useRef } from 'react';
import { Search, Clock, Plus, ChevronDown, Upload, X, FileSpreadsheet, Eye, MoreVertical, AlertCircle, CheckCircle2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

interface ImportedEmail {
  email: string;
  order: number;
}

interface Admin {
  id: string;
  email: string;
  name: string | null;
  project: string | null;
  status: 'active' | 'suspended' | 'pending' | 'locked';
  tcVersion: string | null;
  version: string | null;
}

const initialCentralAdmins: Admin[] = [
  { id: '1', email: 'admin.central@gmail.com', name: 'ศุภชัย ธนากร', project: 'ทั้งหมด', status: 'active', tcVersion: '1.0', version: '2.0' },
  { id: '2', email: 'super.admin@gmail.com', name: 'สมศรี ใจดี', project: 'ทั้งหมด', status: 'active', tcVersion: '1.0', version: '2.0' },
  { id: '3', email: 'master.admin@gmail.com', name: 'ธนพล วิชัยดิษฐ์', project: 'ทั้งหมด', status: 'suspended', tcVersion: '1.0', version: '2.0' },
  { id: '4', email: 'locked.admin@gmail.com', name: 'วรินทร์ สุขใจ', project: 'ทั้งหมด', status: 'locked', tcVersion: '1.0', version: '2.0' },
];

const AdminManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('central');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'central' | 'project'>('central');
  const [email, setEmail] = useState('');
  const [importedEmails, setImportedEmails] = useState<ImportedEmail[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [centralAdmins, setCentralAdmins] = useState<Admin[]>(initialCentralAdmins);
  const [projectAdmins, setProjectAdmins] = useState<Admin[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState('10');
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAddAdmin = (type: 'central' | 'project') => {
    setAddModalType(type);
    setIsAddModalOpen(true);
    setEmail('');
    setImportedEmails([]);
    setUploadedFileName(null);
    setCsvErrors([]);
  };

  const parseCSV = (content: string, existingEmails: string[]): { emails: ImportedEmail[]; errors: string[] } => {
    const lines = content.split('\n').filter(line => line.trim());
    const emails: ImportedEmail[] = [];
    const errors: string[] = [];
    const seenEmails = new Set<string>();
    
    if (lines.length === 0) {
      errors.push('ไฟล์ว่างเปล่า');
      return { emails, errors };
    }

    // Check header row
    const headerRow = lines[0].toLowerCase();
    const hasEmailHeader = headerRow.includes('อีเมล') || headerRow.includes('email');
    
    if (!hasEmailHeader) {
      errors.push('ไม่พบคอลัมน์ "อีเมล" หรือ "email" ในหัวตาราง');
    }

    // Parse data rows (skip header)
    const dataLines = lines.slice(1);
    
    if (dataLines.length === 0) {
      errors.push('ไม่พบข้อมูลในไฟล์ (มีเฉพาะหัวตาราง)');
      return { emails, errors };
    }

    let emptyRowCount = 0;

    dataLines.forEach((line, index) => {
      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
      
      // Check if row is empty
      if (columns.every(col => !col)) {
        emptyRowCount++;
        return;
      }

      // Find email column (look for @ symbol)
      const emailCol = columns.find(col => col.includes('@'));
      
      if (!emailCol) {
        errors.push(`แถวที่ ${index + 2}: ไม่พบอีเมล`);
      } else if (!emailCol.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push(`แถวที่ ${index + 2}: รูปแบบอีเมลไม่ถูกต้อง "${emailCol}"`);
      } else {
        const normalizedEmail = emailCol.toLowerCase();
        // Check duplicate in file
        if (seenEmails.has(normalizedEmail)) {
          errors.push(`แถวที่ ${index + 2}: อีเมลซ้ำในไฟล์ "${emailCol}"`);
        // Check duplicate in system
        } else if (existingEmails.includes(normalizedEmail)) {
          errors.push(`แถวที่ ${index + 2}: อีเมลซ้ำในระบบ "${emailCol}"`);
        } else {
          seenEmails.add(normalizedEmail);
          emails.push({ email: emailCol, order: emails.length + 1 });
        }
      }
    });

    if (emptyRowCount > 0) {
      errors.push(`พบแถวว่าง ${emptyRowCount} แถว`);
    }

    return { emails, errors };
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
      // Get existing emails from both central and project admins
      const existingEmails = [...centralAdmins, ...projectAdmins].map(a => a.email.toLowerCase());
      const { emails, errors } = parseCSV(content, existingEmails);
      
      // Store errors for preview
      setCsvErrors(errors);
      setImportedEmails(emails);

      // Show toast summary
      if (errors.length > 0 && emails.length === 0) {
        toast({
          title: 'รูปแบบไฟล์ไม่ถูกต้อง',
          description: 'กรุณาตรวจสอบรายละเอียดข้อผิดพลาดด้านล่าง',
          variant: 'destructive',
        });
      } else if (errors.length > 0) {
        toast({
          title: 'พบข้อผิดพลาดบางส่วน',
          description: `พบ ${emails.length} อีเมลที่ถูกต้อง และ ${errors.length} ข้อผิดพลาด`,
          variant: 'default',
        });
      } else if (emails.length > 0) {
        toast({
          title: 'นำเข้าสำเร็จ',
          description: `พบ ${emails.length} อีเมลในไฟล์`,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleRemoveImportedEmail = (order: number) => {
    setImportedEmails(prev => prev.filter(e => e.order !== order));
  };

  const handleClearFile = () => {
    setUploadedFileName(null);
    setImportedEmails([]);
    setCsvErrors([]);
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

    const newAdmins: Admin[] = emailsToAdd.map((email, index) => ({
      id: `new-${Date.now()}-${index}`,
      email,
      name: null,
      project: null,
      status: 'pending' as const,
      tcVersion: null,
      version: null,
    }));

    if (addModalType === 'central') {
      setCentralAdmins(prev => [...prev, ...newAdmins]);
    } else {
      setProjectAdmins(prev => [...prev, ...newAdmins]);
    }

    toast({
      title: 'เพิ่มแอดมินสำเร็จ',
      description: `เพิ่ม ${emailsToAdd.length} แอดมินเรียบร้อยแล้ว`,
    });
    setIsAddModalOpen(false);
  };

  const getStatusBadge = (status: Admin['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">กำลังใช้งาน</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">ระงับการใช้งาน</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">ยังไม่เปิดใช้งาน</Badge>;
      case 'locked':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">ถูกล็อค</Badge>;
      default:
        return null;
    }
  };

  const renderAdminTable = (admins: Admin[]) => {
    const filteredAdmins = admins.filter(admin => {
      const matchesSearch = admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (admin.name && admin.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && admin.status === 'active') ||
        (statusFilter === 'inactive' && admin.status !== 'active');
      return matchesSearch && matchesStatus;
    });

    return (
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
              <TableHead className="font-medium">โครงการ</TableHead>
              <TableHead className="font-medium">สถานะผู้ใช้งาน</TableHead>
              <TableHead className="font-medium">เวอร์ชัน T&C</TableHead>
              <TableHead className="font-medium">เวอร์ชัน</TableHead>
              <TableHead className="font-medium w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.name || '-'}</TableCell>
                <TableCell>{admin.project || '-'}</TableCell>
                <TableCell>{getStatusBadge(admin.status)}</TableCell>
                <TableCell>{admin.tcVersion || '-'}</TableCell>
                <TableCell>{admin.version || '-'}</TableCell>
                <TableCell>
                  {admin.status === 'pending' ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredAdmins.length === 0 && <EmptyState />}
        {filteredAdmins.length > 0 && (
          <div className="flex items-center justify-end gap-4 px-4 py-3 border-t border-border text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>จำนวนแถวต่อหน้า :</span>
              <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <span>{filteredAdmins.length} จาก {admins.length}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                <ChevronDown className="w-4 h-4 rotate-90" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
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
          </div>

          <div className="mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-56">
                <span className="text-muted-foreground">สถานะผู้ใช้งาน </span>
                <SelectValue placeholder="ทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="active">กำลังใช้งาน</SelectItem>
                <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <TabsContent value="central" className="mt-0">
            {renderAdminTable(centralAdmins)}
          </TabsContent>

          <TabsContent value="project" className="mt-0">
            {renderAdminTable(projectAdmins)}
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            {renderAdminTable([])}
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
                        className="flex items-center bg-muted/50 rounded px-3 py-1.5 text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-muted-foreground w-6">{item.order}.</span>
                          {item.email}
                        </span>
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

              {/* Success State */}
              {uploadedFileName && csvErrors.length === 0 && importedEmails.length > 0 && (
                <div className="space-y-3 border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">สำเร็จ {importedEmails.length} รายการ</span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {uploadedFileName && csvErrors.length > 0 && importedEmails.length === 0 && (
                <div className="space-y-3 border border-destructive/30 rounded-lg p-4 bg-destructive/5">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">ไม่สำเร็จ {csvErrors.length} รายการ กรุณาตรวจสอบไฟล์</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">รายละเอียดข้อผิดพลาด:</p>
                    <div className="max-h-32 overflow-y-auto bg-destructive/5 border border-destructive/20 rounded-md p-2 space-y-1">
                      {csvErrors.map((error, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-2 text-xs text-destructive"
                        >
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearFile}
                    className="mt-2"
                  >
                    ย้อนกลับ
                  </Button>
                </div>
              )}

              {/* Partial Success State */}
              {uploadedFileName && csvErrors.length > 0 && importedEmails.length > 0 && (
                <div className="space-y-3 border border-border rounded-lg p-4 bg-muted/20">
                  <h4 className="text-sm font-medium text-foreground">ผลการตรวจสอบไฟล์</h4>
                  
                  {/* Summary */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>สำเร็จ: {importedEmails.length} รายการ</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>ไม่สำเร็จ: {csvErrors.length} รายการ</span>
                    </div>
                  </div>

                  {/* Error List */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">รายละเอียดข้อผิดพลาด:</p>
                    <div className="max-h-32 overflow-y-auto bg-destructive/5 border border-destructive/20 rounded-md p-2 space-y-1">
                      {csvErrors.map((error, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-2 text-xs text-destructive"
                        >
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1.5">
                    💡 เฉพาะอีเมลที่ถูกต้อง {importedEmails.length} รายการจะถูกนำเข้าเมื่อกดตกลง
                  </p>
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

import { MetricCard, ProvinceData, OccupationData, AgeDistributionData, OccupationDistributionData, DailyEngagementData } from '@/types/dashboard';

export const summaryMetrics: MetricCard[] = [
  {
    metric_name: 'จำนวนผู้ลงทะเบียนสะสม',
    value: 3500024,
    change_percentage: 2.34,
    change_direction: 'up',
    previous_period_value: 3419873,
    tooltip: 'จำนวนผู้ใช้ที่ลงทะเบียนทั้งหมดในระบบ',
    color: 'blue',
  },
  {
    metric_name: 'จำนวนผู้ลงทะเบียนใหม่',
    value: 55024,
    change_percentage: 1.94,
    change_direction: 'up',
    previous_period_value: 53977,
    tooltip: 'จำนวนผู้ใช้ใหม่ในช่วงเวลาที่เลือก',
    color: 'yellow',
  },
];

export const dailyEngagementData: DailyEngagementData[] = [
  { date: '1 ธ.ค.', activeUsers: 85000, active1Day: 24.2, active7Day: 35.1, active30Day: 68.5 },
  { date: '2 ธ.ค.', activeUsers: 92000, active1Day: 24.8, active7Day: 35.8, active30Day: 67.8 },
  { date: '3 ธ.ค.', activeUsers: 78000, active1Day: 23.5, active7Day: 36.2, active30Day: 67.2 },
  { date: '4 ธ.ค.', activeUsers: 95000, active1Day: 25.1, active7Day: 36.5, active30Day: 66.8 },
  { date: '5 ธ.ค.', activeUsers: 88000, active1Day: 24.9, active7Day: 36.8, active30Day: 66.5 },
  { date: '6 ธ.ค.', activeUsers: 102000, active1Day: 25.3, active7Day: 37.0, active30Day: 66.2 },
  { date: '7 ธ.ค.', activeUsers: 98000, active1Day: 25.6, active7Day: 37.5, active30Day: 65.7 },
];

export const provinceData: ProvinceData[] = [
  { rank: 1, name: 'กรุงเทพมหานคร', value: 3013512 },
  { rank: 2, name: 'เชียงใหม่', value: 1003510 },
  { rank: 3, name: 'กาญจนบุรี', value: 900123 },
  { rank: 4, name: 'กาฬสินธุ์', value: 812004 },
  { rank: 5, name: 'กำแพงเพชร', value: 809009 },
  { rank: 6, name: 'ขอนแก่น', value: 800002 },
  { rank: 7, name: 'จันทบุรี', value: 600009 },
  { rank: 8, name: 'ฉะเชิงเทรา', value: 509321 },
  { rank: 9, name: 'ชลบุรี', value: 209000 },
  { rank: 10, name: 'ชัยนาท', value: 105321 },
];

export const occupationData: OccupationData[] = [
  { rank: 1, name: 'พนักงานบริษัทเอกชน', userCount: 10000000 },
  { rank: 2, name: 'ข้าราชการ', userCount: 9000000 },
  { rank: 3, name: 'พนักงานรัฐวิสาหกิจ', userCount: 8000000 },
  { rank: 4, name: 'เจ้าหน้าที่องค์กรไม่แสวงหากำไร (NGO)', userCount: 7000000 },
  { rank: 5, name: 'เจ้าหน้าที่สำนักงาน / ธุรการ', userCount: 6000000 },
  { rank: 6, name: 'เจ้าของกิจการ / ผู้ประกอบการ', userCount: 5000000 },
  { rank: 7, name: 'ฟรีแลนซ์ / อาชีพอิสระ', userCount: 4000000 },
  { rank: 8, name: 'นักบัญชี / ที่ปรึกษาทางการเงิน', userCount: 3000000 },
  { rank: 9, name: 'นักกฎหมาย / ทนายความ', userCount: 2000000 },
  { rank: 10, name: 'นายหน้าอสังหาริมทรัพย์ / ตัวแทนขาย', userCount: 1000000 },
  { rank: 11, name: 'แพทย์ / พยาบาล', userCount: 950000 },
  { rank: 12, name: 'วิศวกร', userCount: 920000 },
  { rank: 13, name: 'ครู / อาจารย์', userCount: 890000 },
  { rank: 14, name: 'นักศึกษา', userCount: 850000 },
  { rank: 15, name: 'เกษตรกร', userCount: 780000 },
  { rank: 16, name: 'พ่อค้า / แม่ค้า', userCount: 720000 },
  { rank: 17, name: 'พนักงานขาย', userCount: 680000 },
  { rank: 18, name: 'ช่างเทคนิค', userCount: 620000 },
  { rank: 19, name: 'พนักงานขับรถ', userCount: 580000 },
  { rank: 20, name: 'แม่บ้าน', userCount: 520000 },
  { rank: 21, name: 'นักออกแบบ / กราฟิก', userCount: 480000 },
  { rank: 22, name: 'โปรแกรมเมอร์ / นักพัฒนาซอฟต์แวร์', userCount: 450000 },
  { rank: 23, name: 'นักการตลาด', userCount: 420000 },
  { rank: 24, name: 'เภสัชกร', userCount: 380000 },
  { rank: 25, name: 'สถาปนิก', userCount: 350000 },
  { rank: 26, name: 'นักข่าว / สื่อสารมวลชน', userCount: 320000 },
  { rank: 27, name: 'พนักงานโรงแรม', userCount: 280000 },
  { rank: 28, name: 'พนักงานธนาคาร', userCount: 250000 },
  { rank: 29, name: 'ทหาร / ตำรวจ', userCount: 220000 },
  { rank: 30, name: 'อื่นๆ', userCount: 180000 },
];

export const ageDistributionData: AgeDistributionData[] = [
  { ageRange: '7-15', registeredUsers: 8000, activePercentage: 45 },
  { ageRange: '16-30', registeredUsers: 15000, activePercentage: 78 },
  { ageRange: '31-45', registeredUsers: 12000, activePercentage: 65 },
  { ageRange: '45-60', registeredUsers: 9000, activePercentage: 52 },
  { ageRange: '60 ขึ้นไป', registeredUsers: 5000, activePercentage: 35 },
];

export const occupationDistributionData: OccupationDistributionData[] = [
  { occupation: 'พนักงาน\nบริษัท...', registeredUsers: 35000, activePercentage: 72 },
  { occupation: 'ข้าราชการ', registeredUsers: 28000, activePercentage: 68 },
  { occupation: 'พนักงานรัฐ\nวิสาหกิจ', registeredUsers: 22000, activePercentage: 58 },
  { occupation: 'เจ้าหน้าที่\nองค์กรไม่...', registeredUsers: 18000, activePercentage: 55 },
  { occupation: 'เจ้าหน้าที่\nสำนักงาน...', registeredUsers: 15000, activePercentage: 48 },
];

export const totalUsersOverview = 3500024;

export const tokenByFeatureData = [
  { name: 'ข้อความ', value: 300900000, color: 'hsl(217, 91%, 30%)' },
  { name: 'รูปภาพ', value: 150450000, color: 'hsl(217, 91%, 50%)' },
  { name: 'วิดีโอ', value: 50150000, color: 'hsl(217, 91%, 70%)' },
];

export const tokenByModelData = [
  { name: 'Gemini-2.5 Pro', value: 125375000, color: 'hsl(217, 91%, 25%)' },
  { name: 'Gemini-2.5 Flash', value: 100300000, color: 'hsl(217, 91%, 35%)' },
  { name: 'GPT-5', value: 85255000, color: 'hsl(217, 91%, 45%)' },
  { name: 'Claude-3', value: 75225000, color: 'hsl(217, 91%, 55%)' },
  { name: 'Sonar', value: 55165000, color: 'hsl(217, 91%, 65%)' },
  { name: 'Grok-1', value: 35105000, color: 'hsl(217, 91%, 75%)' },
  { name: 'อื่นๆ', value: 25075000, color: 'hsl(217, 91%, 85%)' },
];

export const totalTokens = 501500000;

import { MetricCard, ProvinceData, OccupationData, AgeDistributionData, OccupationDistributionData } from '@/types/dashboard';

export const summaryMetrics: MetricCard[] = [
  {
    metric_name: 'จำนวนผู้ลงทะเบียนสะสม',
    value: 3500024,
    change_percentage: 2.34,
    change_direction: 'up',
    previous_period_value: 3419873,
    tooltip: 'จำนวนผู้ใช้ที่ลงทะเบียนทั้งหมดในระบบ',
    sparkline_data: [2800000, 2950000, 3100000, 3200000, 3350000, 3500024],
    color: 'blue',
  },
  {
    metric_name: 'จำนวนผู้ลงทะเบียนใหม่',
    value: 55024,
    change_percentage: 1.94,
    change_direction: 'up',
    previous_period_value: 53977,
    tooltip: 'จำนวนผู้ใช้ใหม่ในช่วงเวลาที่เลือก',
    sparkline_data: [42000, 45000, 48000, 51000, 53000, 55024],
    color: 'yellow',
  },
];

export const engagementMetrics: MetricCard[] = [
  {
    metric_name: '% เฉลี่ยผู้ใช้งานในช่วง 1 วัน',
    value: 25.6,
    change_percentage: 0.31,
    change_direction: 'up',
    previous_period_value: 25.52,
    tooltip: 'เปอร์เซ็นต์ผู้ใช้งานที่ active ในช่วง 1 วัน',
    sparkline_data: [22, 23, 24, 24.5, 25, 25.6],
    color: 'orange',
  },
  {
    metric_name: '% เฉลี่ยผู้ใช้งานในช่วง 7 วัน',
    value: 37.5,
    change_percentage: 2.45,
    change_direction: 'up',
    previous_period_value: 36.6,
    tooltip: 'เปอร์เซ็นต์ผู้ใช้งานที่ active ในช่วง 7 วัน',
    sparkline_data: [32, 33.5, 35, 36, 36.8, 37.5],
    color: 'green',
  },
  {
    metric_name: '% เฉลี่ยผู้ใช้งานในช่วง 30 วัน',
    value: 65.7,
    change_percentage: -10.99,
    change_direction: 'down',
    previous_period_value: 73.81,
    tooltip: 'เปอร์เซ็นต์ผู้ใช้งานที่ active ในช่วง 30 วัน',
    sparkline_data: [72, 70, 68, 67, 66, 65.7],
    color: 'purple',
  },
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

export const totalUsersOverview = 24000000;

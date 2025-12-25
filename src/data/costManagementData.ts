export interface TokenByOccupationData {
  rank: number;
  occupation: string;
  tokenCount: number;
}

export interface TokenByFeatureData {
  name: string;
  value: number;
}

export const tokenByOccupationData: TokenByOccupationData[] = [
  { rank: 1, occupation: 'พนักงานบริษัทเอกชน', tokenCount: 10000000 },
  { rank: 2, occupation: 'ข้าราชการ', tokenCount: 9000000 },
  { rank: 3, occupation: 'พนักงานรัฐวิสาหกิจ', tokenCount: 8000000 },
  { rank: 4, occupation: 'เจ้าหน้าที่องค์กรไม่แสวงหากำไร (NGO)', tokenCount: 7000000 },
  { rank: 5, occupation: 'เจ้าหน้าที่สำนักงาน / ธุรการ', tokenCount: 6000000 },
  { rank: 6, occupation: 'เจ้าของกิจการ / ผู้ประกอบการ', tokenCount: 5000000 },
  { rank: 7, occupation: 'ฟรีแลนซ์ / อาชีพอิสระ', tokenCount: 4000000 },
  { rank: 8, occupation: 'นักบัญชี / ที่ปรึกษาทางการเงิน', tokenCount: 3000000 },
  { rank: 9, occupation: 'นักกฎหมาย / ทนายความ', tokenCount: 2000000 },
  { rank: 10, occupation: 'นายหน้าอสังหาริมทรัพย์ / ตัวแทนขาย', tokenCount: 1000000 },
];

export const featureTokenData: TokenByFeatureData[] = [
  { name: 'Feature 1', value: 4000000 },
  { name: 'Feature 2', value: 5000000 },
  { name: 'Feature 3', value: 3500000 },
  { name: 'Feature 4', value: 6000000 },
  { name: 'Feature 5', value: 2000000 },
  { name: 'Feature 6', value: 2500000 },
  { name: 'Feature 7', value: 3000000 },
  { name: 'Feature 8', value: 3800000 },
  { name: 'Feature 9', value: 500000 },
  { name: 'Feature 10', value: 700000 },
];

export const totalTokensUsed = 24000000;

export const modelOptions = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'gpt', label: 'GPT' },
  { value: 'claude', label: 'Claude' },
];

export const featureOptions = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'chat', label: 'แชท' },
  { value: 'document', label: 'สร้างเอกสาร' },
  { value: 'image', label: 'สร้างรูปภาพ' },
];

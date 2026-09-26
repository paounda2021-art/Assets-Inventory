import { Asset } from '../types/asset';

export interface CodeGeneratorInput {
  year2Digits: string; // e.g. "69"
  resp2Digits: string; // e.g. "01" (ส่วนกลางและสะพานปลากรุงเทพ)
  cat2Digits: string;  // e.g. "01" (ครุภัณฑ์สำนักงาน)
  type3Digits: string; // e.g. "001" (โต๊ะทำงาน)
  running4Digits: number; // e.g. 129 -> "0129"
  useSeparator?: boolean; // e.g. true -> "69/01-01-001-0129"
}

export const RESPONSIBLE_CODES = [
  { code: '01', name: '01 - ส่วนกลางและสะพานปลากรุงเทพ' },
  { code: '02', name: '02 - สะพานปลากรุงเทพ' },
  { code: '03', name: '03 - ส่วนกลางและสะพานปลาสมุทรปราการ' },
  { code: '04', name: '04 - สะพานปลาสมุทรสาคร' },
  { code: '07', name: '07 - ท่าเทียบเรือประมงตราด' },
  { code: '08', name: '08 - ท่าเทียบเรือประมงอ่างศิลา' },
  { code: '10', name: '10 - ท่าเทียบเรือประมงหัวหิน' },
  { code: '11', name: '11 - ด่านสิงขร' },
  { code: '12', name: '12 - ท่าเทียบเรือประมงชุมพร' },
  { code: '13', name: '13 - ท่าเทียบเรือประมงหลังสวน' },
  { code: '14', name: '14 - ท่าเทียบเรือประมงสุราษฎร์ธานี' },
  { code: '15', name: '15 - ท่าเทียบเรือประมงนครศรีธรรมราช (1)' },
  { code: '16', name: '16 - ท่าเทียบเรือประมงสงขลา' },
  { code: '17', name: '17 - ท่าเทียบเรือประมงปัตตานี' },
  { code: '18', name: '18 - ท่าเทียบเรือประมงนราธิวาส' },
  { code: '19', name: '19 - ท่าเทียบเรือประมงระนอง' },
  { code: '20', name: '20 - ท่าเทียบเรือประมงภูเก็ต' },
  { code: '21', name: '21 - ท่าเทียบเรือประมงสตูล' },
  { code: '22', name: '22 - ท่าเทียบเรือประมงสะอ้าน' },
  { code: '23', name: '23 - สินเชื่อ' },
];

export const CATEGORY_CODES = [
  { code: '01', name: '01 ครุภัณฑ์สำนักงาน' },
  { code: '02', name: '02 ครุภัณฑ์ยานพาหนะและขนส่ง' },
  { code: '03', name: '03 ครุภัณฑ์การเกษตร' },
  { code: '04', name: '04 ครุภัณฑ์ก่อสร้าง' },
  { code: '05', name: '05 ครุภัณฑ์ไฟฟ้าและวิทยุ' },
  { code: '07', name: '07 ครุภัณฑ์โสตทัศนูปกรณ์' },
  { code: '08', name: '08 ครุภัณฑ์ทางการแพทย์' },
  { code: '09', name: '09 ครุภัณฑ์งานบ้านงานครัว' },
  { code: '10', name: '10 ครุภัณฑ์กีฬา' },
  { code: '11', name: '11 ครุภัณฑ์สำรวจ' },
  { code: '12', name: '12 ครุภัณฑ์คอมพิวเตอร์' },
];

export const TYPE_CODES: Record<string, { code: string; name: string }[]> = {
  '01': [
    { code: '001', name: '001 โต๊ะทำงาน (รันล่าสุด 128 -> ถัดไป 0129)' },
    { code: '002', name: '002 เก้าอี้ทำงาน (รันล่าสุด 146 -> ถัดไป 0147)' },
    { code: '003', name: '003 เครื่องถ่ายเอกสาร (รันล่าสุด 2 -> ถัดไป 0003)' },
    { code: '004', name: '004 เครื่องปรับอากาศ (รันล่าสุด 5 -> ถัดไป 0006)' },
    { code: '005', name: '005 ชุดรับแขก (รันล่าสุด 1 -> ถัดไป 0002)' },
    { code: '006', name: '006 ตู้เอกสารโล่ง 5 ชั้น' },
    { code: '007', name: '007 พาติชั่น (รันล่าสุด 91 -> ถัดไป 0092)' },
    { code: '008', name: '008 ตู้เอกสารเหล็ก' },
  ],
  '02': [
    { code: '001', name: '001 รถยนต์นั่ง' },
    { code: '002', name: '002 รถโฟกลิ๊ฟ' },
  ],
  '03': [
    { code: '001', name: '001 เครื่องตัดหญ้า' },
    { code: '002', name: '002 เครื่องสูบน้ำ/ปั้มน้ำ (รันล่าสุด 5 -> ถัดไป 0006)' },
    { code: '003', name: '003 บันได (รันล่าสุด 2 -> ถัดไป 0003)' },
  ],
  '04': [
    { code: '001', name: '001 เครื่องเจาะ' },
    { code: '002', name: '002 เครื่องเชื่อม' },
  ],
  '05': [
    { code: '001', name: '001 ลำโพง' },
    { code: '002', name: '002 เครื่องบันทึกเสียง' },
    { code: '003', name: '003 พัดลม (รันล่าสุด 12 -> ถัดไป 0013)' },
    { code: '004', name: '004 เร้าเตอร์ (รันล่าสุด 1 -> ถัดไป 0002)' },
  ],
  '07': [
    { code: '001', name: '001 กล้องถ่ายรูป' },
    { code: '002', name: '002 เครื่องโปรเจคเตอร์ (รันล่าสุด 1 -> ถัดไป 0002)' },
    { code: '003', name: '003 วิทยุ (รันล่าสุด 2 -> ถัดไป 0003)' },
  ],
  '08': [
    { code: '001', name: '001 เครื่องวัดความดัน' },
    { code: '002', name: '002 เตียงตรวจโรค' },
  ],
  '09': [
    { code: '001', name: '001 เครื่องกรองน้ำ' },
    { code: '002', name: '002 ตู้เย็น/ตู้แช่ (รันล่าสุด 1 -> ถัดไป 0002)' },
    { code: '003', name: '003 อ่างล้างจาน (รันล่าสุด 2 -> ถัดไป 0003)' },
    { code: '004', name: '004 ถังน้ำดื่ม (รันล่าสุด 5 -> ถัดไป 0006)' },
    { code: '005', name: '005 เครื่องซักผ้า (รันล่าสุด 1 -> ถัดไป 0002)' },
    { code: '006', name: '006 ไมโครเวฟ (รันล่าสุด 1 -> ถัดไป 0002)' },
  ],
  '10': [
    { code: '001', name: '001 ชุดเครื่องออกกำลังกาย' },
  ],
  '11': [
    { code: '001', name: '001 กล้องวัดมุม/กล้องสำรวจ (รันล่าสุด 3 -> ถัดไป 0004)' },
    { code: '002', name: '002 เครื่องวัดระดับ (รันล่าสุด 2 -> ถัดไป 0003)' },
    { code: '003', name: '003 ขาตั้งกล้อง (รันล่าสุด 2 -> ถัดไป 0003)' },
    { code: '004', name: '004 กล้องวงจรปิด (รันล่าสุด 3 -> ถัดไป 0004)' },
  ],
  '12': [
    { code: '001', name: '001 เครื่องคอมพิวเตอร์' },
    { code: '002', name: '002 จอคอมพิวเตอร์' },
    { code: '003', name: '003 CPU' },
    { code: '004', name: '004 IPAD Pro 11 (รันล่าสุด 12 -> ถัดไป 0013)' },
    { code: '005', name: '005 เครื่องพริ้นเตอร์ (รันล่าสุด 5 -> ถัดไป 0006)' },
    { code: '006', name: '006 คอมพิวเตอร์แบบพกพา / Notebook (รันล่าสุด 103 -> ถัดไป 0104)' },
  ]
};

// Initial counts from Sheet "ประเภทการออเลขพัสดุ" in ทะเบียนพัสดุ อสป.ปัจจุบัน.xlsx
export const INITIAL_TYPE_COUNTS: Record<string, number> = {
  '01-001': 128, // โต๊ะทำงาน -> ถัดไป 129 (0129)
  '01-002': 146, // เก้าอี้ทำงาน -> ถัดไป 147 (0147)
  '01-003': 2,
  '01-004': 5,
  '01-005': 1,
  '01-007': 91,  // พาติชั่น -> ถัดไป 92 (0092)
  '03-002': 5,
  '03-003': 2,
  '05-003': 12,
  '05-004': 1,
  '07-002': 1,
  '07-003': 2,
  '09-002': 1,
  '09-003': 2,
  '09-004': 5,
  '09-005': 1,
  '09-006': 1,
  '11-001': 3,
  '11-002': 2,
  '11-003': 2,
  '11-004': 3,
  '12-004': 12,
  '12-005': 5,
  '12-006': 103, // Notebook -> ถัดไป 104 (0104)
};

export function getNextSequenceNumber(cat2: string, type3: string, assets: Asset[] = []): number {
  const cat = cat2.padStart(2, '0');
  const type = type3.padStart(3, '0');
  const key = `${cat}-${type}`;
  const baseCount = INITIAL_TYPE_COUNTS[key] || 0;

  let maxSeq = baseCount;

  // Search assets strictly matching pattern for higher sequence numbers
  assets.forEach(ast => {
    const code = ast.assetCode || '';
    
    // Pattern YY/RR-CC-TTT-NNNN
    if (code.includes(`-${cat}-${type}-`)) {
      const parts = code.split(`-${cat}-${type}-`);
      if (parts.length > 1) {
        const seqStr = parts[1].slice(0, 4);
        const seqNum = parseInt(seqStr, 10);
        if (!isNaN(seqNum) && seqNum > maxSeq) {
          maxSeq = seqNum;
        }
      }
    } else if (code.length === 13) {
      // 6901 01 001 0129 -> cat at 4..6, type at 6..9, seq at 9..13
      const codeCat = code.substring(4, 6);
      const codeType = code.substring(6, 9);
      if (codeCat === cat && codeType === type) {
        const seqNum = parseInt(code.substring(9, 13), 10);
        if (!isNaN(seqNum) && seqNum > maxSeq) {
          maxSeq = seqNum;
        }
      }
    }
  });

  return maxSeq + 1;
}

export function generateAssetCode(input: CodeGeneratorInput): string {
  const year = input.year2Digits.padStart(2, '0');
  const resp = input.resp2Digits.padStart(2, '0');
  const cat = input.cat2Digits.padStart(2, '0');
  const type = input.type3Digits.padStart(3, '0');
  const seq = String(input.running4Digits).padStart(4, '0');

  if (input.useSeparator) {
    // Format: 69/01-01-001-0129
    return `${year}/${resp}-${cat}-${type}-${seq}`;
  }

  // Pure 13 digits format: 6901010010129
  return `${year}${resp}${cat}${type}${seq}`;
}

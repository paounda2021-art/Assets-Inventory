const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../ทะเบียนพัสดุ อสป.ปัจจุบัน.xlsx');
const wb = XLSX.readFile(filePath);
const sheet = wb.Sheets['ทะเบียนพัสดุ อสป'];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const rawData = rows.slice(2).filter(r => r && (r[1] || r[3]));

function formatAcquisitionDate(val) {
  if (!val) return '2026-01-15';
  if (typeof val === 'number') {
    try {
      return XLSX.SSF.format('yyyy-mm-dd', val);
    } catch (e) {
      return String(val);
    }
  }
  return String(val).trim();
}

const parsedAssets = rawData.map((r, idx) => {
  const rawCode = String(r[1] || '').trim();
  const oldCode = String(r[2] || '').trim();
  const name = String(r[3] || '').trim();
  const unit = String(r[4] || 'เครื่อง').trim();
  const qty = Number(r[5]) || 1;
  const acqDate = formatAcquisitionDate(r[6]);
  const price = Number(r[7]) || 0;
  const vendor = String(r[8] || 'ส่วนกลางและ สป.กท.').trim();
  const location = String(r[9] || 'อาคารสำนักงาน').trim();
  const department = String(r[10] || 'สำนักเทคโนโลยีสารสนเทศ').trim();
  const custodian = String(r[11] || 'ผู้ใช้งานส่วนกลาง').trim();
  const statusStr = String(r[13] || 'ปกติ').trim();

  let status = 'active';
  if (statusStr.includes('ซ่อม')) status = 'repair';
  else if (statusStr.includes('ชำรุด')) status = 'damaged';
  else if (statusStr.includes('จำหน่าย')) status = 'disposed';

  // Format code standard according to rule if raw code exists
  const formattedCode = rawCode || `690101001${String(idx + 1).padStart(4, '0')}`;

  return {
    id: `ast-excel-${idx + 1}`,
    assetCode: formattedCode,
    name: name || 'ครุภัณฑ์',
    spec: `หน่วยนับ: ${unit} | รหัสเดิม: ${oldCode || '-'}`,
    category: name.includes('พริ้นเตอร์') || name.includes('โปรเจ็คเตอร์') || name.includes('คอมพิวเตอร์') ? 'คอมพิวเตอร์และอุปกรณ์ไอที' : 'สำนักงานและครุภัณฑ์',
    subCategory: unit,
    brand: 'มาตรฐาน อสป.',
    model: 'รุ่นตามสัญญา',
    serialNumber: oldCode ? `SN-${oldCode}` : `SN-2026-${idx + 1}`,
    department: department,
    custodian: custodian,
    location: location,
    budgetYear: formattedCode.length >= 2 ? `25${formattedCode.substring(0, 2)}` : '2569',
    acquisitionDate: acqDate,
    poNumber: 'สัญญา อสป.',
    vendor: vendor,
    purchasePrice: price || 15000,
    usefulLifeYears: 5,
    depreciationMethod: '20% ต่อปี (เส้นตรง)',
    currentBookValue: price || 15000,
    status: status,
    warrantyStart: acqDate,
    warrantyEnd: '2029-01-14',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
    history: [
      {
        id: `h-ex-${idx + 1}`,
        date: '2026-09-25 10:00',
        type: 'registration',
        title: 'นำเข้าจากทะเบียนพัสดุ อสป.ปัจจุบัน.xlsx',
        by: 'ระบบคุมพัสดุ อสป.',
        detail: `ลงทะเบียนรายการ ${name} รหัส ${formattedCode} (วันที่ได้มา: ${acqDate})`
      }
    ]
  };
});

const fileContent = `import { Asset } from '../types/asset';\n\nexport const REAL_EXCEL_ASSETS: Asset[] = ${JSON.stringify(parsedAssets, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, '../src/data/excelAssets.ts'), fileContent);
console.log('Successfully re-generated src/data/excelAssets.ts with formatted acquisition dates!');

import { Asset, SupplyItem, MaintenanceRecord } from '../types/asset';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-001',
    assetCode: 'วศ.69-0012-001',
    name: 'โน้ตบุ๊ก HP ProBook 440 G10',
    spec: 'Core i5 / RAM 16GB / SSD 512GB',
    category: 'คอมพิวเตอร์และอุปกรณ์ไอที',
    subCategory: 'คอมพิวเตอร์พกพา / Laptop',
    brand: 'HP',
    model: 'ProBook 440 G10',
    serialNumber: '5CD2410XYZ',
    department: 'สำนักเทคโนโลยีสารสนเทศ',
    custodian: 'รณิดา โชติธนาอุดม',
    location: 'อาคาร 1 > ชั้น 2 > ห้องพัฒนาระบบ',
    budgetYear: '2569',
    acquisitionDate: '2026-08-15',
    poNumber: 'พด.12/2569',
    vendor: 'บริษัท ไอที โซลูชั่นส์ จำกัด',
    purchasePrice: 28900.00,
    usefulLifeYears: 5,
    depreciationMethod: '20% ต่อปี (เส้นตรง)',
    currentBookValue: 28900.00,
    status: 'active',
    warrantyStart: '2026-08-15',
    warrantyEnd: '2029-08-14',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
    history: [
      {
        id: 'h-1',
        date: '2026-09-20 14:15',
        type: 'audit',
        title: 'ตรวจนับประจำปี 2569',
        by: 'นายเอกชัย (กรรมการตรวจนับพัสดุ)',
        detail: 'สแกนตรวจสอบผ่าน Mobile Web Scanner ผลการตรวจ: อยู่ในสภาพดี ใช้งานปกติ ณ ตำแหน่งเดิม',
        statusBadge: '🟢 อยู่ในสภาพดี'
      },
      {
        id: 'h-2',
        date: '2026-08-18 09:30',
        type: 'issuance',
        title: 'ส่งมอบ/เบิกจ่ายให้พนักงาน',
        by: 'ฝ่ายพัสดุ | ผู้รับมอบ: นางสาวรณิดา โชติธนาอุดม',
        detail: 'เบิกจ่ายประจำตำแหน่งนักพัฒนาระบบ',
        documentNo: 'เบิก-69/088 (ลงนามดิจิทัลเรียบร้อย)'
      },
      {
        id: 'h-3',
        date: '2026-08-15 11:00',
        type: 'registration',
        title: 'ตรวจรับและลงทะเบียนเข้าระบบ',
        by: 'คณะกรรมการตรวจรับ',
        detail: 'ตรวจรับเรียบร้อยตามสัญญาเลขที่ พด.12/2569 ออกรหัสทะเบียน: วศ.69-0012-001',
        documentNo: 'พด.12/2569'
      }
    ]
  },
  {
    id: 'ast-002',
    assetCode: 'วศ.68-0045-003',
    name: 'Network Switch Cisco 24-Port',
    spec: 'Catalyst 1000 Series 24G 4x1G SFP',
    category: 'คอมพิวเตอร์และอุปกรณ์ไอที',
    subCategory: 'อุปกรณ์เครือข่าย / Network',
    brand: 'Cisco',
    model: 'Catalyst 1000-24T-4G-L',
    serialNumber: 'FCW2240L0P9',
    department: 'สำนักเทคโนโลยีสารสนเทศ',
    custodian: '(อุปกรณ์ส่วนกลาง)',
    location: 'อาคาร 1 > ชั้น 3 > Server Room',
    budgetYear: '2568',
    acquisitionDate: '2025-05-10',
    poNumber: 'พด.45/2568',
    vendor: 'บริษัท เน็ตเวิร์ค ซิสเต็มส์ จำกัด',
    purchasePrice: 45000.00,
    usefulLifeYears: 5,
    depreciationMethod: '20% ต่อปี (เส้นตรง)',
    currentBookValue: 36000.00,
    status: 'active',
    warrantyStart: '2025-05-10',
    warrantyEnd: '2028-05-09',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60',
    history: [
      {
        id: 'h-4',
        date: '2026-09-10 10:00',
        type: 'audit',
        title: 'ตรวจนับประจำปี 2569',
        by: 'นายเอกชัย (กรรมการตรวจนับพัสดุ)',
        detail: 'ตรวจสอบสถานะการทำงาน LED สถานะเขียวปกติ',
        statusBadge: '🟢 ใช้งานปกติ'
      },
      {
        id: 'h-5',
        date: '2025-05-10 09:00',
        type: 'registration',
        title: 'ตรวจรับและลงทะเบียนเข้าระบบ',
        by: 'คณะกรรมการตรวจรับ',
        detail: 'ติดตั้งที่ Server Room ชั้น 3',
        documentNo: 'พด.45/2568'
      }
    ]
  },
  {
    id: 'ast-003',
    assetCode: 'สนง.67-0102-01',
    name: 'เครื่องพิมพ์มัลติฟังก์ชัน HP LaserJet Enterprise Flow',
    spec: 'M630z MFP Print/Scan/Copy/Fax 57 ppm',
    category: 'สำนักงานและครุภัณฑ์',
    subCategory: 'เครื่องพิมพ์และสแกนเนอร์',
    brand: 'HP',
    model: 'LaserJet Enterprise Flow M630z',
    serialNumber: 'CNB1K87654',
    department: 'กองบริหารการคลัง',
    custodian: 'วัชรีวรรณ จันทร์เพ็ญ',
    location: 'อาคาร 1 > ชั้น 1 > แผนกบัญชี',
    budgetYear: '2567',
    acquisitionDate: '2024-03-20',
    poNumber: 'พด.102/2567',
    vendor: 'บริษัท ออฟฟิศ โซลูชั่นส์ จำกัด',
    purchasePrice: 68000.00,
    usefulLifeYears: 5,
    depreciationMethod: '20% ต่อปี (เส้นตรง)',
    currentBookValue: 40800.00,
    status: 'repair',
    warrantyStart: '2024-03-20',
    warrantyEnd: '2027-03-19',
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&auto=format&fit=crop&q=60',
    history: [
      {
        id: 'h-6',
        date: '2026-09-22 11:30',
        type: 'repair',
        title: 'แจ้งซ่อมอาการกระดาษติดชุดดรัม',
        by: 'นางสาววัชรีวรรณ จันทร์เพ็ญ',
        detail: 'ส่งศูนย์บริการ HP เคลมเปลี่ยนชุด Fuser Roller',
        documentNo: 'REQ-REP-69/042',
        statusBadge: '🟡 ส่งซ่อม'
      }
    ]
  },
  {
    id: 'ast-004',
    assetCode: 'สนง.65-0089-05',
    name: 'โปรเจกเตอร์ EPSON EB-FH52',
    spec: 'ความสว่าง 4,000 Lumens Full HD 1080p Wireless',
    category: 'สำนักงานและครุภัณฑ์',
    subCategory: 'โสตทัศนูปกรณ์ / AV',
    brand: 'EPSON',
    model: 'EB-FH52',
    serialNumber: 'Q2TY9988110',
    department: 'ฝ่ายอำนวยการ',
    custodian: '(ห้องประชุม)',
    location: 'อาคาร 1 > ชั้น 2 > ห้องประชุมใหญ่',
    budgetYear: '2565',
    acquisitionDate: '2022-11-05',
    poNumber: 'พด.89/2565',
    vendor: 'บริษัท วิชวล ซิสเต็มส์ จำกัด',
    purchasePrice: 32500.00,
    usefulLifeYears: 5,
    depreciationMethod: '20% ต่อปี (เส้นตรง)',
    currentBookValue: 6500.00,
    status: 'damaged',
    warrantyStart: '2022-11-05',
    warrantyEnd: '2024-11-04',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60',
    history: [
      {
        id: 'h-7',
        date: '2026-09-15 16:00',
        type: 'disposal',
        title: 'ขออนุมัติแทงจำหน่าย (ชำรุดรอจำหน่าย)',
        by: 'นายสมชาย (หัวหน้าฝ่ายอำนวยการ)',
        detail: 'หลอดภาพเสื่อมสภาพ คุ้มค่าซ่อมต่ำกว่าซื้อใหม่ เสนอปลดระวาง',
        documentNo: 'DIS-69/012',
        statusBadge: '🔴 ชำรุด (รอจำหน่าย)'
      }
    ]
  },
  {
    id: 'ast-005',
    assetCode: 'วศ.69-0012-002',
    name: 'จอมอนิเตอร์ Dell UltraSharp 27 นิ้ว 4K',
    spec: 'IPS 4K UHD / USB-C Hub / HDR400',
    category: 'คอมพิวเตอร์และอุปกรณ์ไอที',
    subCategory: 'จอแสดงผล / Monitor',
    brand: 'Dell',
    model: 'UltraSharp U2723QE',
    serialNumber: 'CN-0T345M-WS200-34A-1234',
    department: 'สำนักเทคโนโลยีสารสนเทศ',
    custodian: 'รณิดา โชติธนาอุดม',
    location: 'อาคาร 1 > ชั้น 2 > ห้องพัฒนาระบบ',
    budgetYear: '2569',
    acquisitionDate: '2026-08-15',
    poNumber: 'พด.12/2569',
    vendor: 'บริษัท ไอที โซลูชั่นส์ จำกัด',
    purchasePrice: 18500.00,
    usefulLifeYears: 5,
    depreciationMethod: '20% ต่อปี (เส้นตรง)',
    currentBookValue: 18500.00,
    status: 'active',
    warrantyStart: '2026-08-15',
    warrantyEnd: '2029-08-14',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
    history: [
      {
        id: 'h-8',
        date: '2026-08-15 11:00',
        type: 'registration',
        title: 'ตรวจรับและลงทะเบียนเข้าระบบ',
        by: 'คณะกรรมการตรวจรับ',
        detail: 'ตรวจรับเรียบร้อยตามสัญญาเลขที่ พด.12/2569',
        documentNo: 'พด.12/2569'
      }
    ]
  }
];

export const INITIAL_SUPPLIES: SupplyItem[] = [
  {
    id: 'sup-001',
    code: 'SUP-A4-80G',
    name: 'กระดาษถ่ายเอกสาร A4 80 แกรม (Double A)',
    category: 'วัสดุสำนักงาน',
    unit: 'รีม',
    minStock: 50,
    currentStock: 120,
    unitPrice: 135.00,
    lastRestockDate: '2026-09-01'
  },
  {
    id: 'sup-002',
    code: 'SUP-PEN-BLUE',
    name: 'ปากกาลูกลื่น 0.5 มม. (หมึกสีน้ำเงิน)',
    category: 'เครื่องเขียน',
    unit: 'ด้าม',
    minStock: 100,
    currentStock: 35, // Low stock
    unitPrice: 12.00,
    lastRestockDate: '2026-07-15'
  },
  {
    id: 'sup-003',
    code: 'SUP-TONER-HP-05A',
    name: 'ตลับหมึกพิมพ์ HP LaserJet CE505A',
    category: 'วัสดุคอมพิวเตอร์',
    unit: 'ตลับ',
    minStock: 5,
    currentStock: 3, // Low stock
    unitPrice: 2850.00,
    lastRestockDate: '2026-08-10'
  }
];

export const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 'maint-001',
    assetCode: 'สนง.67-0102-01',
    assetName: 'เครื่องพิมพ์มัลติฟังก์ชัน HP LaserJet Enterprise Flow',
    requestDate: '2026-09-22',
    issue: 'กระดาษติดชุดดรัมบ่อย พิมพ์ออกมามีรอยเส้นดำยาว',
    reporter: 'นางสาววัชรีวรรณ จันทร์เพ็ญ',
    technician: 'ศูนย์บริการ HP (ส่งเคลม)',
    cost: 3500.00,
    status: 'in_progress'
  }
];

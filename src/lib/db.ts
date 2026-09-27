import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { REAL_EXCEL_ASSETS } from '../data/excelAssets';
import { INITIAL_SUPPLIES } from '../data/mockAssets';
import { DEPARTMENT_LIST } from '../data/departments';
import { CATEGORY_CODES, TYPE_CODES, RESPONSIBLE_CODES } from './codeGenerator';
import { formatThaiDate } from './dateUtils';
import { Asset, SupplyItem } from '../types/asset';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'system.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    assetCode TEXT NOT NULL,
    name TEXT NOT NULL,
    spec TEXT,
    category TEXT,
    subCategory TEXT,
    brand TEXT,
    model TEXT,
    serialNumber TEXT,
    department TEXT,
    custodian TEXT,
    location TEXT,
    budgetYear TEXT,
    acquisitionDate TEXT,
    poNumber TEXT,
    vendor TEXT,
    purchasePrice REAL,
    usefulLifeYears INTEGER,
    depreciationMethod TEXT,
    currentBookValue REAL,
    status TEXT,
    warrantyStart TEXT,
    warrantyEnd TEXT,
    imageUrl TEXT,
    history TEXT
  );

  CREATE TABLE IF NOT EXISTS categories (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subtypes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoryCode TEXT NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS departments (
    code TEXT PRIMARY KEY,
    fullTitle TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transfers (
    id TEXT PRIMARY KEY,
    documentNo TEXT NOT NULL,
    transferDate TEXT NOT NULL,
    assetIds TEXT NOT NULL,
    assetCodes TEXT NOT NULL,
    assetNames TEXT NOT NULL,
    fromDepartment TEXT NOT NULL,
    toDepartment TEXT NOT NULL,
    fromCustodian TEXT,
    toCustodian TEXT,
    newLocation TEXT,
    reason TEXT,
    approvedBy TEXT,
    attachmentName TEXT,
    attachmentUrl TEXT,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS supplies (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL,
    minStock INTEGER NOT NULL,
    currentStock INTEGER NOT NULL,
    unitPrice REAL NOT NULL,
    lastRestockDate TEXT
  );

  CREATE TABLE IF NOT EXISTS responsible_codes (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS supply_categories (
    name TEXT PRIMARY KEY
  );

  CREATE TABLE IF NOT EXISTS supply_units (
    name TEXT PRIMARY KEY
  );

  CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed function to initialize default data if tables are empty
function seedDatabase() {
  // 1. Seed Assets
  const assetCount = (db.prepare('SELECT COUNT(*) as count FROM assets').get() as { count: number }).count;
  if (assetCount === 0) {
    const insertAsset = db.prepare(`
      INSERT OR IGNORE INTO assets (
        id, assetCode, name, spec, category, subCategory, brand, model,
        serialNumber, department, custodian, location, budgetYear, acquisitionDate,
        poNumber, vendor, purchasePrice, usefulLifeYears, depreciationMethod,
        currentBookValue, status, warrantyStart, warrantyEnd, imageUrl, history
      ) VALUES (
        @id, @assetCode, @name, @spec, @category, @subCategory, @brand, @model,
        @serialNumber, @department, @custodian, @location, @budgetYear, @acquisitionDate,
        @poNumber, @vendor, @purchasePrice, @usefulLifeYears, @depreciationMethod,
        @currentBookValue, @status, @warrantyStart, @warrantyEnd, @imageUrl, @history
      )
    `);

    const insertManyAssets = db.transaction((assetsList: Asset[]) => {
      for (const item of assetsList) {
        insertAsset.run({
          ...item,
          spec: item.spec || '',
          category: item.category || '',
          subCategory: item.subCategory || '',
          brand: item.brand || '',
          model: item.model || '',
          serialNumber: item.serialNumber || '',
          department: item.department || '',
          custodian: item.custodian || '',
          location: item.location || '',
          budgetYear: item.budgetYear || '',
          acquisitionDate: formatThaiDate(item.acquisitionDate || ''),
          poNumber: item.poNumber || '',
          vendor: item.vendor || '',
          purchasePrice: item.purchasePrice || 0,
          usefulLifeYears: item.usefulLifeYears || 5,
          depreciationMethod: item.depreciationMethod || '20% ต่อปี (เส้นตรง)',
          currentBookValue: item.currentBookValue || 0,
          status: item.status || 'active',
          warrantyStart: formatThaiDate(item.warrantyStart || ''),
          warrantyEnd: item.warrantyEnd || '',
          imageUrl: item.imageUrl || '',
          history: JSON.stringify(item.history || [])
        });
      }
    });

    insertManyAssets(REAL_EXCEL_ASSETS);
  }

  // 2. Seed Categories
  const catCount = (db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number }).count;
  if (catCount === 0) {
    const insertCat = db.prepare('INSERT OR IGNORE INTO categories (code, name) VALUES (?, ?)');
    const insertManyCats = db.transaction(() => {
      for (const cat of CATEGORY_CODES) {
        insertCat.run(cat.code, cat.name);
      }
    });
    insertManyCats();
  }

  // 3. Seed Subtypes
  const subCount = (db.prepare('SELECT COUNT(*) as count FROM subtypes').get() as { count: number }).count;
  if (subCount === 0) {
    const insertSub = db.prepare('INSERT INTO subtypes (categoryCode, code, name) VALUES (?, ?, ?)');
    const insertManySubs = db.transaction(() => {
      for (const [catCode, typeList] of Object.entries(TYPE_CODES)) {
        for (const t of typeList) {
          insertSub.run(catCode, t.code, t.name);
        }
      }
    });
    insertManySubs();
  }

  // 4. Seed Departments
  const deptCount = (db.prepare('SELECT COUNT(*) as count FROM departments').get() as { count: number }).count;
  if (deptCount === 0) {
    const insertDept = db.prepare('INSERT OR IGNORE INTO departments (code, fullTitle) VALUES (?, ?)');
    const insertManyDepts = db.transaction(() => {
      for (const dept of DEPARTMENT_LIST) {
        insertDept.run(dept.code, dept.fullTitle);
      }
    });
    insertManyDepts();
  }

  // 5. Seed Initial Transfer Record
  const transferCount = (db.prepare('SELECT COUNT(*) as count FROM transfers').get() as { count: number }).count;
  if (transferCount === 0) {
    const insertTransfer = db.prepare(`
      INSERT OR IGNORE INTO transfers (
        id, documentNo, transferDate, assetIds, assetCodes, assetNames,
        fromDepartment, toDepartment, fromCustodian, toCustodian, newLocation,
        reason, approvedBy, attachmentName, attachmentUrl, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertTransfer.run(
      'tr-1001',
      'บันทึก อสป. 88/2569',
      '2026-09-20',
      JSON.stringify(['ast-excel-1']),
      JSON.stringify(['55/1-01-005-1']),
      JSON.stringify(['ชุดรับแขกบุนวมห้อง ผออ.']),
      'สลข.',
      'สทส.',
      'สลข.ผอ.',
      'น.ส.รณิดา โชติธนาอุดม',
      'อาคาร 1 > ชั้น 2 > ห้องระบบ',
      'โอนย้ายเพื่อใช้ในห้องสำนักงานเทคโนโลยีสารสนเทศ',
      'ผู้อำนวยการ สนอ.',
      '',
      '',
      'completed'
    );
  }

  // 6. Seed Supplies
  const supplyCount = (db.prepare('SELECT COUNT(*) as count FROM supplies').get() as { count: number }).count;
  if (supplyCount === 0) {
    const insertSupply = db.prepare(`
      INSERT OR IGNORE INTO supplies (id, code, name, category, unit, minStock, currentStock, unitPrice, lastRestockDate)
      VALUES (@id, @code, @name, @category, @unit, @minStock, @currentStock, @unitPrice, @lastRestockDate)
    `);
    const insertManySupplies = db.transaction(() => {
      for (const item of INITIAL_SUPPLIES) {
        insertSupply.run(item);
      }
    });
    insertManySupplies();
  }

  // 7. Seed Responsible Codes
  const respCount = (db.prepare('SELECT COUNT(*) as count FROM responsible_codes').get() as { count: number }).count;
  if (respCount === 0) {
    const insertResp = db.prepare('INSERT OR IGNORE INTO responsible_codes (code, name) VALUES (?, ?)');
    const insertManyResp = db.transaction(() => {
      for (const r of RESPONSIBLE_CODES) {
        insertResp.run(r.code, r.name);
      }
    });
    insertManyResp();
  }

  // 8. Seed Supply Categories
  const supCatCount = (db.prepare('SELECT COUNT(*) as count FROM supply_categories').get() as { count: number }).count;
  if (supCatCount === 0) {
    const insertSupCat = db.prepare('INSERT OR IGNORE INTO supply_categories (name) VALUES (?)');
    const defaultCats = ['วัสดุสำนักงาน', 'เครื่องเขียน', 'วัสดุคอมพิวเตอร์', 'วัสดุงานบ้านงานครัว', 'วัสดุไฟฟ้าและวิทยุ', 'วัสดุการเกษตร', 'อื่นๆ'];
    const insertManySupCats = db.transaction(() => {
      for (const c of defaultCats) {
        insertSupCat.run(c);
      }
    });
    insertManySupCats();
  }

  // 9. Seed Supply Units
  const supUnitCount = (db.prepare('SELECT COUNT(*) as count FROM supply_units').get() as { count: number }).count;
  if (supUnitCount === 0) {
    const insertUnit = db.prepare('INSERT OR IGNORE INTO supply_units (name) VALUES (?)');
    const defaultUnits = ['รีม', 'ด้าม', 'ตลับ', 'กล่อง', 'แผ่น', 'ชุด', 'เครื่อง', 'พวง', 'ม้วน', 'เล่ม', 'อัน', 'ขวด', 'ถุง'];
    const insertManyUnits = db.transaction(() => {
      for (const u of defaultUnits) {
        insertUnit.run(u);
      }
    });
    insertManyUnits();
  }

  // 10. Seed System Config
  const cfgCount = (db.prepare('SELECT COUNT(*) as count FROM system_config').get() as { count: number }).count;
  if (cfgCount === 0) {
    const insertCfg = db.prepare('INSERT OR IGNORE INTO system_config (key, value) VALUES (?, ?)');
    const defaultConfigs: Record<string, string> = {
      orgName: 'องค์การสะพานปลา (Fish Marketing Organization)',
      fiscalYear: '2569',
      defaultApprover: 'ผู้อำนวยการองค์การสะพานปลา',
      defaultDepreciationMethod: '20% ต่อปี (เส้นตรง)',
      defaultUsefulLife: '5'
    };
    const insertManyCfgs = db.transaction(() => {
      for (const [k, v] of Object.entries(defaultConfigs)) {
        insertCfg.run(k, v);
      }
    });
    insertManyCfgs();
  }
}

seedDatabase();

export function getAllSupplies(): SupplyItem[] {
  return db.prepare('SELECT * FROM supplies ORDER BY code ASC').all() as SupplyItem[];
}

export function saveSupply(item: SupplyItem) {
  const stmt = db.prepare(`
    INSERT INTO supplies (id, code, name, category, unit, minStock, currentStock, unitPrice, lastRestockDate)
    VALUES (@id, @code, @name, @category, @unit, @minStock, @currentStock, @unitPrice, @lastRestockDate)
    ON CONFLICT(id) DO UPDATE SET
      code = excluded.code,
      name = excluded.name,
      category = excluded.category,
      unit = excluded.unit,
      minStock = excluded.minStock,
      currentStock = excluded.currentStock,
      unitPrice = excluded.unitPrice,
      lastRestockDate = excluded.lastRestockDate
  `);
  stmt.run(item);
}

export function deleteSupply(id: string) {
  db.prepare('DELETE FROM supplies WHERE id = ?').run(id);
}

export function getSettingsData() {
  const categories = db.prepare('SELECT code, name FROM categories ORDER BY code ASC').all();
  const subtypesRaw = db.prepare('SELECT categoryCode, code, name FROM subtypes ORDER BY code ASC').all() as any[];
  const departments = db.prepare('SELECT code, fullTitle FROM departments ORDER BY code ASC').all();
  const responsibleCodes = db.prepare('SELECT code, name FROM responsible_codes ORDER BY code ASC').all();
  const supplyCategories = db.prepare('SELECT name FROM supply_categories ORDER BY name ASC').all().map((r: any) => r.name);
  const supplyUnits = db.prepare('SELECT name FROM supply_units ORDER BY name ASC').all().map((r: any) => r.name);
  const configRows = db.prepare('SELECT key, value FROM system_config').all() as any[];

  const typeCodesMap: Record<string, { code: string; name: string }[]> = {};
  for (const sub of subtypesRaw) {
    if (!typeCodesMap[sub.categoryCode]) {
      typeCodesMap[sub.categoryCode] = [];
    }
    typeCodesMap[sub.categoryCode].push({ code: sub.code, name: sub.name });
  }

  const systemConfig: Record<string, string> = {};
  for (const cfg of configRows) {
    systemConfig[cfg.key] = cfg.value;
  }

  return {
    categories,
    typeCodesMap,
    departments,
    responsibleCodes,
    supplyCategories,
    supplyUnits,
    systemConfig
  };
}

export function deleteCategory(code: string) {
  db.prepare('DELETE FROM categories WHERE code = ?').run(code);
  db.prepare('DELETE FROM subtypes WHERE categoryCode = ?').run(code);
}

export function deleteSubtype(categoryCode: string, code: string) {
  db.prepare('DELETE FROM subtypes WHERE categoryCode = ? AND code = ?').run(categoryCode, code);
}

export function deleteDepartment(code: string) {
  db.prepare('DELETE FROM departments WHERE code = ?').run(code);
}

export function deleteResponsibleCode(code: string) {
  db.prepare('DELETE FROM responsible_codes WHERE code = ?').run(code);
}

export function deleteSupplyCategory(name: string) {
  db.prepare('DELETE FROM supply_categories WHERE name = ?').run(name);
}

export function deleteSupplyUnit(name: string) {
  db.prepare('DELETE FROM supply_units WHERE name = ?').run(name);
}

export default db;

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { REAL_EXCEL_ASSETS } from '../data/excelAssets';
import { DEPARTMENT_LIST } from '../data/departments';
import { CATEGORY_CODES, TYPE_CODES } from './codeGenerator';
import { Asset } from '../types/asset';

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
          acquisitionDate: item.acquisitionDate || '',
          poNumber: item.poNumber || '',
          vendor: item.vendor || '',
          purchasePrice: item.purchasePrice || 0,
          usefulLifeYears: item.usefulLifeYears || 5,
          depreciationMethod: item.depreciationMethod || '20% ต่อปี (เส้นตรง)',
          currentBookValue: item.currentBookValue || 0,
          status: item.status || 'active',
          warrantyStart: item.warrantyStart || '',
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
}

seedDatabase();

export default db;

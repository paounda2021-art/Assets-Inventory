const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

function formatThaiDate(dateStr) {
  if (!dateStr || dateStr.trim() === '' || dateStr.trim() === '-') return '-';

  const cleaned = dateStr.trim();

  // Fix common typo in source data: "10 พ.ศ. 68" or "10 พ.ศ. 2568" -> "10 พ.ค. 2568"
  if (/^\d{1,2}\s+พ\.ศ\.\s+\d{2,4}$/.test(cleaned)) {
    const parts = cleaned.split(/\s+/);
    const day = parts[0];
    let yearNum = parseInt(parts[2], 10);
    if (yearNum < 100) yearNum += 2500;
    return `${day} พ.ค. ${yearNum}`;
  }

  // Format ISO Date YYYY-MM-DD
  const isoMatch = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);

    let yearBE = y;
    if (y < 2400) {
      yearBE = y + 543;
    }

    const monthShort = THAI_MONTHS_SHORT[m - 1] || '';
    return `${d} ${monthShort} ${yearBE}`;
  }

  return cleaned;
}

// 1. Update system.db
const dbPath = path.join(__dirname, '../data/system.db');
if (fs.existsSync(dbPath)) {
  const db = new Database(dbPath);
  const rows = db.prepare('SELECT id, acquisitionDate, warrantyStart, history FROM assets').all();
  
  const updateStmt = db.prepare(`
    UPDATE assets SET
      acquisitionDate = ?,
      warrantyStart = ?,
      history = ?
    WHERE id = ?
  `);

  const fixAll = db.transaction(() => {
    let fixedCount = 0;
    for (const r of rows) {
      const fixedAcq = formatThaiDate(r.acquisitionDate);
      const fixedWarr = formatThaiDate(r.warrantyStart);
      
      let historyList = [];
      try {
        historyList = JSON.parse(r.history || '[]');
      } catch (e) {}

      historyList = historyList.map(h => ({
        ...h,
        detail: h.detail ? h.detail.replace(/10 พ\.ศ\. 68/g, '10 พ.ค. 2568') : h.detail
      }));

      updateStmt.run(fixedAcq, fixedWarr, JSON.stringify(historyList), r.id);
      fixedCount++;
    }
    console.log(`Successfully updated ${fixedCount} asset date records in SQLite system.db!`);
  });

  fixAll();
}

// 2. Re-generate excelAssets.ts with formatted dates
const excelAssetsPath = path.join(__dirname, '../src/data/excelAssets.ts');
if (fs.existsSync(excelAssetsPath)) {
  let content = fs.readFileSync(excelAssetsPath, 'utf-8');
  // Replace all "10 พ.ศ. 68" with "10 พ.ค. 2568"
  content = content.replace(/10 พ\.ศ\. 68/g, '10 พ.ค. 2568');
  fs.writeFileSync(excelAssetsPath, content, 'utf-8');
  console.log('Successfully updated src/data/excelAssets.ts!');
}

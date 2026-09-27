const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function padAssetCode(code) {
  if (!code || typeof code !== 'string') return code;
  const match = code.match(/^(.*-)(\d+)$/);
  if (match) {
    const prefix = match[1];
    const seq = match[2];
    return prefix + seq.padStart(4, '0');
  }
  return code;
}

// 1. Process src/data/excelAssets.ts
const excelAssetsPath = path.join(__dirname, '../src/data/excelAssets.ts');
if (fs.existsSync(excelAssetsPath)) {
  console.log('Processing src/data/excelAssets.ts...');
  let content = fs.readFileSync(excelAssetsPath, 'utf-8');
  
  const equalsIdx = content.indexOf('=');
  const jsonStart = content.indexOf('[', equalsIdx);
  const jsonEnd = content.lastIndexOf(']');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonStr = content.substring(jsonStart, jsonEnd + 1);
    const assets = JSON.parse(jsonStr);
    
    let updatedCount = 0;
    assets.forEach(ast => {
      const oldCode = ast.assetCode;
      const newCode = padAssetCode(oldCode);
      if (oldCode !== newCode) {
        ast.assetCode = newCode;
        updatedCount++;
      }
      if (ast.history && Array.isArray(ast.history)) {
        ast.history.forEach(h => {
          if (h.detail && oldCode && oldCode !== newCode) {
            h.detail = h.detail.replace(oldCode, newCode);
          }
        });
      }
    });

    const newContent = `import { Asset } from '../types/asset';\n\nexport const REAL_EXCEL_ASSETS: Asset[] = ${JSON.stringify(assets, null, 2)};\n`;
    fs.writeFileSync(excelAssetsPath, newContent, 'utf-8');
    console.log(`Updated ${updatedCount} asset codes in src/data/excelAssets.ts!`);
  }
}

// 2. Process data/system.db
const dbPath = path.join(__dirname, '../data/system.db');
if (fs.existsSync(dbPath)) {
  console.log('Processing data/system.db...');
  const db = new Database(dbPath);

  // Update assets
  const assets = db.prepare('SELECT id, assetCode, history FROM assets').all();
  const updateAssetStmt = db.prepare('UPDATE assets SET assetCode = ?, history = ? WHERE id = ?');
  
  const updateAssetsTx = db.transaction(() => {
    let count = 0;
    for (const ast of assets) {
      const oldCode = ast.assetCode;
      const newCode = padAssetCode(oldCode);
      
      let historyArr = [];
      try {
        historyArr = JSON.parse(ast.history || '[]');
      } catch (e) {}

      if (Array.isArray(historyArr) && oldCode && oldCode !== newCode) {
        historyArr.forEach(h => {
          if (h.detail) h.detail = h.detail.replace(oldCode, newCode);
        });
      }

      if (oldCode !== newCode || JSON.stringify(historyArr) !== ast.history) {
        updateAssetStmt.run(newCode, JSON.stringify(historyArr), ast.id);
        count++;
      }
    }
    console.log(`Updated ${count} assets in SQLite database!`);
  });
  updateAssetsTx();

  // Update transfers assetCodes column
  const transfers = db.prepare('SELECT id, assetCodes FROM transfers').all();
  const updateTransferStmt = db.prepare('UPDATE transfers SET assetCodes = ? WHERE id = ?');
  const updateTransfersTx = db.transaction(() => {
    let count = 0;
    for (const tr of transfers) {
      try {
        const codes = JSON.parse(tr.assetCodes || '[]');
        if (Array.isArray(codes)) {
          const newCodes = codes.map(c => padAssetCode(c));
          if (JSON.stringify(newCodes) !== tr.assetCodes) {
            updateTransferStmt.run(JSON.stringify(newCodes), tr.id);
            count++;
          }
        }
      } catch (e) {}
    }
    console.log(`Updated ${count} transfers in SQLite database!`);
  });
  updateTransfersTx();
}

console.log('Asset code padding script finished successfully!');

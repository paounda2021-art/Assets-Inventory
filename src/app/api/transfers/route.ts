import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { AssetTransferRecord, Asset } from '@/types/asset';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM transfers ORDER BY id DESC').all() as any[];
    const transfers: AssetTransferRecord[] = rows.map(r => ({
      ...r,
      assetIds: JSON.parse(r.assetIds || '[]'),
      assetCodes: JSON.parse(r.assetCodes || '[]'),
      assetNames: JSON.parse(r.assetNames || '[]')
    }));
    return NextResponse.json({ success: true, data: transfers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { record, updatedAssets } = body as { record: AssetTransferRecord; updatedAssets: Asset[] };

    const insertTransfer = db.prepare(`
      INSERT OR REPLACE INTO transfers (
        id, documentNo, transferDate, assetIds, assetCodes, assetNames,
        fromDepartment, toDepartment, fromCustodian, toCustodian, newLocation,
        reason, approvedBy, attachmentName, attachmentUrl, status
      ) VALUES (
        @id, @documentNo, @transferDate, @assetIds, @assetCodes, @assetNames,
        @fromDepartment, @toDepartment, @fromCustodian, @toCustodian, @newLocation,
        @reason, @approvedBy, @attachmentName, @attachmentUrl, @status
      )
    `);

    const updateAssetStmt = db.prepare(`
      UPDATE assets SET
        department = @department,
        custodian = @custodian,
        location = @location,
        history = @history
      WHERE id = @id
    `);

    const executeTransfer = db.transaction(() => {
      insertTransfer.run({
        ...record,
        assetIds: JSON.stringify(record.assetIds),
        assetCodes: JSON.stringify(record.assetCodes),
        assetNames: JSON.stringify(record.assetNames),
        attachmentName: record.attachmentName || '',
        attachmentUrl: record.attachmentUrl || ''
      });

      for (const ast of updatedAssets) {
        updateAssetStmt.run({
          id: ast.id,
          department: ast.department,
          custodian: ast.custodian,
          location: ast.location,
          history: JSON.stringify(ast.history || [])
        });
      }
    });

    executeTransfer();

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

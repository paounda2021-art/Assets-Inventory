import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Asset } from '@/types/asset';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM assets ORDER BY id DESC').all() as any[];
    const assets: Asset[] = rows.map(r => ({
      ...r,
      purchasePrice: Number(r.purchasePrice || 0),
      usefulLifeYears: Number(r.usefulLifeYears || 5),
      currentBookValue: Number(r.currentBookValue || 0),
      history: r.history ? JSON.parse(r.history) : []
    }));
    return NextResponse.json({ success: true, data: assets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const asset: Asset = await req.json();
    const insert = db.prepare(`
      INSERT OR REPLACE INTO assets (
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

    insert.run({
      ...asset,
      spec: asset.spec || '',
      category: asset.category || '',
      subCategory: asset.subCategory || '',
      brand: asset.brand || '',
      model: asset.model || '',
      serialNumber: asset.serialNumber || '',
      department: asset.department || '',
      custodian: asset.custodian || '',
      location: asset.location || '',
      budgetYear: asset.budgetYear || '',
      acquisitionDate: asset.acquisitionDate || '',
      poNumber: asset.poNumber || '',
      vendor: asset.vendor || '',
      purchasePrice: asset.purchasePrice || 0,
      usefulLifeYears: asset.usefulLifeYears || 5,
      depreciationMethod: asset.depreciationMethod || '20% ต่อปี (เส้นตรง)',
      currentBookValue: asset.currentBookValue || 0,
      status: asset.status || 'active',
      warrantyStart: asset.warrantyStart || '',
      warrantyEnd: asset.warrantyEnd || '',
      imageUrl: asset.imageUrl || '',
      history: JSON.stringify(asset.history || [])
    });

    return NextResponse.json({ success: true, data: asset });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const asset: Asset = await req.json();
    const update = db.prepare(`
      UPDATE assets SET
        assetCode = @assetCode,
        name = @name,
        spec = @spec,
        category = @category,
        subCategory = @subCategory,
        brand = @brand,
        model = @model,
        serialNumber = @serialNumber,
        department = @department,
        custodian = @custodian,
        location = @location,
        budgetYear = @budgetYear,
        acquisitionDate = @acquisitionDate,
        poNumber = @poNumber,
        vendor = @vendor,
        purchasePrice = @purchasePrice,
        usefulLifeYears = @usefulLifeYears,
        depreciationMethod = @depreciationMethod,
        currentBookValue = @currentBookValue,
        status = @status,
        warrantyStart = @warrantyStart,
        warrantyEnd = @warrantyEnd,
        imageUrl = @imageUrl,
        history = @history
      WHERE id = @id
    `);

    update.run({
      ...asset,
      spec: asset.spec || '',
      category: asset.category || '',
      subCategory: asset.subCategory || '',
      brand: asset.brand || '',
      model: asset.model || '',
      serialNumber: asset.serialNumber || '',
      department: asset.department || '',
      custodian: asset.custodian || '',
      location: asset.location || '',
      budgetYear: asset.budgetYear || '',
      acquisitionDate: asset.acquisitionDate || '',
      poNumber: asset.poNumber || '',
      vendor: asset.vendor || '',
      purchasePrice: asset.purchasePrice || 0,
      usefulLifeYears: asset.usefulLifeYears || 5,
      depreciationMethod: asset.depreciationMethod || '20% ต่อปี (เส้นตรง)',
      currentBookValue: asset.currentBookValue || 0,
      status: asset.status || 'active',
      warrantyStart: asset.warrantyStart || '',
      warrantyEnd: asset.warrantyEnd || '',
      imageUrl: asset.imageUrl || '',
      history: JSON.stringify(asset.history || [])
    });

    return NextResponse.json({ success: true, data: asset });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing asset id' }, { status: 400 });
    }

    db.prepare('DELETE FROM assets WHERE id = ?').run(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

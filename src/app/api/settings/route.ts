import { NextResponse } from 'next/server';
import db, { getSettingsData, deleteCategory, deleteSubtype, deleteDepartment, deleteResponsibleCode, deleteSupplyCategory, deleteSupplyUnit } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getSettingsData();
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    // Asset Categories
    if (action === 'addCategory') {
      const stmt = db.prepare('INSERT OR REPLACE INTO categories (code, name) VALUES (?, ?)');
      stmt.run(data.code, data.name);
      return NextResponse.json({ success: true, message: 'Category saved' });
    }
    if (action === 'deleteCategory') {
      deleteCategory(data.code);
      return NextResponse.json({ success: true, message: 'Category deleted' });
    }

    // Asset Subtypes
    if (action === 'addType') {
      const stmt = db.prepare('INSERT OR REPLACE INTO subtypes (categoryCode, code, name) VALUES (?, ?, ?)');
      stmt.run(data.categoryCode, data.type.code, data.type.name);
      return NextResponse.json({ success: true, message: 'Subtype saved' });
    }
    if (action === 'deleteType') {
      deleteSubtype(data.categoryCode, data.code);
      return NextResponse.json({ success: true, message: 'Subtype deleted' });
    }

    // Departments
    if (action === 'addDepartment') {
      const stmt = db.prepare('INSERT OR REPLACE INTO departments (code, fullTitle) VALUES (?, ?)');
      stmt.run(data.code, data.fullTitle);
      return NextResponse.json({ success: true, message: 'Department saved' });
    }
    if (action === 'deleteDepartment') {
      deleteDepartment(data.code);
      return NextResponse.json({ success: true, message: 'Department deleted' });
    }

    // Responsible Codes
    if (action === 'addResponsibleCode') {
      const stmt = db.prepare('INSERT OR REPLACE INTO responsible_codes (code, name) VALUES (?, ?)');
      stmt.run(data.code, data.name);
      return NextResponse.json({ success: true, message: 'Responsible code saved' });
    }
    if (action === 'deleteResponsibleCode') {
      deleteResponsibleCode(data.code);
      return NextResponse.json({ success: true, message: 'Responsible code deleted' });
    }

    // Supply Categories
    if (action === 'addSupplyCategory') {
      const stmt = db.prepare('INSERT OR REPLACE INTO supply_categories (name) VALUES (?)');
      stmt.run(data.name);
      return NextResponse.json({ success: true, message: 'Supply category saved' });
    }
    if (action === 'deleteSupplyCategory') {
      deleteSupplyCategory(data.name);
      return NextResponse.json({ success: true, message: 'Supply category deleted' });
    }

    // Supply Units
    if (action === 'addSupplyUnit') {
      const stmt = db.prepare('INSERT OR REPLACE INTO supply_units (name) VALUES (?)');
      stmt.run(data.name);
      return NextResponse.json({ success: true, message: 'Supply unit saved' });
    }
    if (action === 'deleteSupplyUnit') {
      deleteSupplyUnit(data.name);
      return NextResponse.json({ success: true, message: 'Supply unit deleted' });
    }

    // System Config Key-Value
    if (action === 'saveSystemConfig') {
      const stmt = db.prepare('INSERT OR REPLACE INTO system_config (key, value) VALUES (?, ?)');
      stmt.run(data.key, data.value);
      return NextResponse.json({ success: true, message: 'System config saved' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error handling settings POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

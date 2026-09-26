import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = db.prepare('SELECT code, name FROM categories ORDER BY code ASC').all();
    const subtypes = db.prepare('SELECT categoryCode, code, name FROM subtypes ORDER BY code ASC').all() as any[];
    const departments = db.prepare('SELECT code, fullTitle FROM departments ORDER BY code ASC').all();

    const typeCodesMap: Record<string, { code: string; name: string }[]> = {};
    for (const sub of subtypes) {
      if (!typeCodesMap[sub.categoryCode]) {
        typeCodesMap[sub.categoryCode] = [];
      }
      typeCodesMap[sub.categoryCode].push({ code: sub.code, name: sub.name });
    }

    return NextResponse.json({
      success: true,
      data: {
        categories,
        typeCodesMap,
        departments
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (action === 'addCategory') {
      const stmt = db.prepare('INSERT OR REPLACE INTO categories (code, name) VALUES (?, ?)');
      stmt.run(data.code, data.name);
      return NextResponse.json({ success: true, message: 'Category added' });
    }

    if (action === 'addType') {
      const stmt = db.prepare('INSERT INTO subtypes (categoryCode, code, name) VALUES (?, ?, ?)');
      stmt.run(data.categoryCode, data.type.code, data.type.name);
      return NextResponse.json({ success: true, message: 'Subtype added' });
    }

    if (action === 'addDepartment') {
      const stmt = db.prepare('INSERT OR REPLACE INTO departments (code, fullTitle) VALUES (?, ?)');
      stmt.run(data.code, data.fullTitle);
      return NextResponse.json({ success: true, message: 'Department added' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

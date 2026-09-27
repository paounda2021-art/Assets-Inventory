import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { UserAccount } from '@/types/user';
import { OFFICIAL_USERS } from '@/data/users';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = db.prepare('SELECT id, username, name, role, roleName, department, position, avatarText FROM users').all() as UserAccount[];
    const userList = rows.length > 0 ? rows : OFFICIAL_USERS.map(({ password, ...u }) => u);
    return NextResponse.json({ success: true, data: userList });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: OFFICIAL_USERS.map(({ password, ...u }) => u) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุชื่อผู้ใช้งานและรหัสผ่าน' }, { status: 400 });
    }

    const row = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username.trim(), password.trim()) as UserAccount | undefined;

    if (row) {
      const { password: _, ...userProfile } = row;
      return NextResponse.json({ success: true, user: userProfile });
    }

    // Fallback match with OFFICIAL_USERS
    const matchedFallback = OFFICIAL_USERS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password.trim()
    );

    if (matchedFallback) {
      const { password: _, ...userProfile } = matchedFallback;
      return NextResponse.json({ success: true, user: userProfile });
    }

    return NextResponse.json({ success: false, error: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

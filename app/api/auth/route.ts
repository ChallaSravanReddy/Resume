import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === adminPassword) {
    return NextResponse.json({ success: true, token: 'admin-authenticated' });
  }
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}

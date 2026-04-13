export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';

export async function GET() {
  const data = await readData('profile.json');
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  await writeData('profile.json', body);
  return NextResponse.json({ success: true });
}


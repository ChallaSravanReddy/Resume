export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';

function sanitizeArrays(obj: any) {
  if (obj?.about) {
    if (typeof obj.about.interests === 'string') {
      try { obj.about.interests = JSON.parse(obj.about.interests); } catch(e) { obj.about.interests = []; }
    }
    if (typeof obj.about.languages === 'string') {
      try { obj.about.languages = JSON.parse(obj.about.languages); } catch(e) { obj.about.languages = []; }
    }
  }
  return obj;
}

export async function GET() {
  let data = await readData('profile.json');
  data = sanitizeArrays(data);
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  let body = await request.json();
  body = sanitizeArrays(body);
  await writeData('profile.json', body);
  return NextResponse.json({ success: true });
}

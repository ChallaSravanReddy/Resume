import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

interface Item { id: string; [key: string]: unknown; }

export async function GET() {
  return NextResponse.json(await readData<Item[]>('certifications.json'));
}
export async function POST(request: Request) {
  const body = await request.json();
  const data = await readData<Item[]>('certifications.json');
  const newItem = { ...body, id: uuidv4() };
  data.push(newItem);
  await writeData('certifications.json', data);
  return NextResponse.json(newItem);
}

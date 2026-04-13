export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

interface Item {
  id: string;
  [key: string]: unknown;
}

export async function GET() {
  const data = await readData<Item[]>('skills.json');
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await readData<Item[]>('skills.json');
  const newItem = { ...body, id: uuidv4() };
  data.push(newItem);
  await writeData('skills.json', data);
  return NextResponse.json(newItem);
}


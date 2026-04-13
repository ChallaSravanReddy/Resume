import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';

interface Item { id: string; [key: string]: unknown; }

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const data = await readData<Item[]>('experience.json');
  const index = data.findIndex(item => item.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data[index] = { ...body, id: params.id };
  await writeData('experience.json', data);
  return NextResponse.json(data[index]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const data = await readData<Item[]>('experience.json');
  await writeData('experience.json', data.filter(item => item.id !== params.id));
  return NextResponse.json({ success: true });
}

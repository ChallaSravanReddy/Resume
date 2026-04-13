import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';

interface Item { id: string; [key: string]: unknown; }

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await readData<Item[]>('blogs.json');
  const item = data.find(item => item.id === params.id || (item as { slug?: string }).slug === params.id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const data = await readData<Item[]>('blogs.json');
  const index = data.findIndex(item => item.id === params.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data[index] = { ...body, id: params.id };
  await writeData('blogs.json', data);
  return NextResponse.json(data[index]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const data = await readData<Item[]>('blogs.json');
  await writeData('blogs.json', data.filter(item => item.id !== params.id));
  return NextResponse.json({ success: true });
}

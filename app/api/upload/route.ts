export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'resume' or 'image'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let uploadDir = '';
    let fileName = file.name;

    if (type === 'resume') {
      uploadDir = path.join(process.cwd(), 'public', 'resume');
      fileName = `Sravan_Reddy_Resume.pdf`; // Force name for resume download link consistency
    } else {
      uploadDir = path.join(process.cwd(), 'public', 'uploads');
      // Keep original name but sanitize
      fileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
    }

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const relativePath = type === 'resume' ? `/resume/${fileName}` : `/uploads/${fileName}`;

    return NextResponse.json({ success: true, path: relativePath });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


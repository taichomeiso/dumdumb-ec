import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルがアップロードされていません' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ファイル名を一意にする
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const path = join(process.cwd(), 'public/uploads', fileName);

    await writeFile(path, buffer);
    
    return NextResponse.json({ 
      success: true,
      path: `/uploads/${fileName}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'アップロード中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;
    
    if (!file) {
      return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 });
    }

    // ファイル形式チェック
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '画像ファイルのみアップロード可能です' }, { status: 400 });
    }

    // ファイルをArrayBufferとして読み込む
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ファイル名を一意にする
    const uniqueFilename = `${Date.now()}-${(file as File).name}`;
    
    // 保存先のパスを作成
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, uniqueFilename);

    // ファイルを保存
    await writeFile(filePath, buffer);

    // URLを返す
    return NextResponse.json({ 
      url: `/uploads/${uniqueFilename}`,
      message: 'アップロード成功'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '画像のアップロードに失敗しました' },
      { status: 500 }
    );
  }
}

// POSTリクエストのサイズ制限を設定
export const config = {
  api: {
    bodyParser: false,
  },
};
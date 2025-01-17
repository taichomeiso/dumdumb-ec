import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "ファイルが見つかりません" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ファイル名をUUIDとして生成
    const fileName = `${uuidv4()}${getExtension(file.name)}`;
    const path = join(process.cwd(), "public/uploads", fileName);
    const publicPath = `/uploads/${fileName}`;

    // public/uploadsディレクトリに保存
    await writeFile(path, buffer);

    return NextResponse.json({ path: publicPath });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "ファイルのアップロードに失敗しました" },
      { status: 500 }
    );
  }
}

function getExtension(filename: string): string {
  const ext = filename.split(".").pop();
  return ext ? `.${ext}` : "";
}
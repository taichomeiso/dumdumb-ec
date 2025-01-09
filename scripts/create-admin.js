const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('メールアドレスとパスワードを指定してください');
    process.exit(1);
  }

  try {
    const hashedPassword = await hash(password, 12);
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    console.log(`管理者アカウントを作成しました: ${admin.email}`);
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
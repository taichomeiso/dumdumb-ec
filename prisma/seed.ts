import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // サンプル製品データ
  const products = [
    {
      name: "DumDumb Basic Tee",
      price: 3900,
      description: "シンプルで着心地の良い定番Tシャツ",
      image: "/images/products/tee-1.jpg",
      category: "Tシャツ",
      stock: 100,
      isNew: true,
      isFeatured: true,
    },
    {
      name: "DumDumb Hoodie",
      price: 7900,
      description: "着心地抜群のパーカー",
      image: "/images/products/hoodie-1.jpg",
      category: "パーカー",
      stock: 50,
      isNew: true,
      isFeatured: true,
    },
    {
      name: "DumDumb Mug",
      price: 2900,
      description: "毎日使いたくなるマグカップ",
      image: "/images/products/mug-1.jpg",
      category: "コップ",
      stock: 30,
      isNew: false,
      isFeatured: true,
    },
    // 以下、必要に応じて製品を追加
  ]

  console.log('Start seeding...')

  // 既存の製品を削除
  await prisma.product.deleteMany()

  // 製品を作成
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    })
    console.log(`Created product with id: ${createdProduct.id}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
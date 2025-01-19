import { Product } from "@/types/product";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
  isFavorite: boolean;
  onFavoriteClick: (e: React.MouseEvent, productId: string) => void;
};

export const ProductCard = ({ product, isFavorite, onFavoriteClick }: ProductCardProps) => {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="aspect-square relative">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 group-hover:scale-105 
              ${product.stock <= 0 ? "opacity-50" : ""}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHSIeHx8dIR4jIiAgICAjIiYmJSUmJiYrKysrKzY2NjY2Njs7Ozs7Ozs7Ozv/2wBDAQwQEBYTFiUWFiU7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            priority={false}
          />
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="bg-black text-white px-6 py-3 rounded-full text-xl font-black">
              SOLD OUT
            </span>
          </div>
        )}
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-black text-white text-sm px-3 py-1 rounded-full font-bold">
            NEW
          </span>
        )}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => onFavoriteClick(e, product.id)}
          aria-label={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'text-pink-500' : 'text-gray-900 hover:text-pink-500'
            }`}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
      </div>
      <div className="p-4 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-gray-900">
            ¥{product.price.toLocaleString()}
          </span>
          {product.stock > 0 && product.stock <= product.stockAlert && (
            <span className="text-sm text-red-500">
              残り{product.stock}点
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
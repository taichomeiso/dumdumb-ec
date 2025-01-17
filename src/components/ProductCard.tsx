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
      className="block group relative overflow-hidden aspect-square"
    >
      <div className="absolute inset-0 flex flex-col">
        <div className="relative h-3/4">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-700 group-hover:scale-105 
                ${product.stock <= 0 ? "opacity-50" : ""}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            <span className="absolute top-6 left-6 bg-black text-white text-base px-4 py-2 rounded-full font-bold">
              NEW
            </span>
          )}
          <button
            className="absolute top-6 right-6 p-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            onClick={(e) => onFavoriteClick(e, product.id)}
          >
            <Heart 
              className={`w-6 h-6 transition-colors ${
                isFavorite ? 'text-pink-500' : 'text-gray-900 hover:text-pink-500'
              }`}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>
        <div className="h-1/4 p-4 bg-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-black">{product.name}</h3>
            <span className="text-xl font-black text-black">
              ¥{product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
import React from 'react'
import { Heart, HeartFilled } from 'lucide-react'
import { useFavoriteStore } from '@/store/favoriteStore'
import { Product } from '@/types/product'
import { Button } from '@/components/ui/button'

interface FavoriteButtonProps {
  product: Product
  className?: string
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  product,
  className = '',
}) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoriteStore()
  const isProductFavorite = isFavorite(product.id)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isProductFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`hover:bg-transparent ${className}`}
      onClick={toggleFavorite}
      aria-label={isProductFavorite ? "商品をお気に入りから削除" : "商品をお気に入りに追加"}
    >
      {isProductFavorite ? (
        <HeartFilled className="h-6 w-6 text-red-500" />
      ) : (
        <Heart className="h-6 w-6" />
      )}
    </Button>
  )
}

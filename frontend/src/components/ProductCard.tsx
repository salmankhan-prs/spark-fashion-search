import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/api"

interface ProductCardProps {
  product: Product
  showScore?: boolean
  onClick?: () => void
}

export function ProductCard({ product, showScore, onClick }: ProductCardProps) {
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)
  const discountPercent = hasDiscount
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice!)) * 100)
    : 0

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <Badge variant="destructive" className="bg-red-500 text-white">
              -{discountPercent}%
            </Badge>
          )}
          {product.collections?.includes("new-arrivals") && (
            <Badge className="bg-violet-500">New</Badge>
          )}
        </div>

        {/* Score indicator */}
        {showScore && product.score !== undefined && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {(product.score * 100).toFixed(0)}% match
          </div>
        )}

        {/* Stock warning */}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full text-center">
              Only {product.stock} left!
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
        <h3 className="mt-1 font-medium text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors">
          {product.title}
        </h3>
        <p className="mt-1 text-xs text-gray-500">{product.category}</p>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price, product.currency)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice!, product.currency)}
            </span>
          )}
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


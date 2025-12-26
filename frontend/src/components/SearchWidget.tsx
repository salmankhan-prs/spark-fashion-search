import { useState, useCallback } from "react"
import { Search, X, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ProductCard"
import { searchProducts, type Product, type SearchBanner } from "@/lib/api"
import { useMerchant } from "@/context/MerchantContext"
import { cn } from "@/lib/utils"

interface SearchWidgetProps {
  onProductClick?: (product: Product) => void
  className?: string
}

export function SearchWidget({ onProductClick, className }: SearchWidgetProps) {
  const { merchant, isLoading: merchantLoading } = useMerchant()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Product[]>([])
  const [banners, setBanners] = useState<SearchBanner[]>([])
  const [meta, setMeta] = useState<{ totalResults: number; latencyMs: number; appliedRules: string[] } | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    if (!merchant) {
      setError("No merchant selected. Please select a merchant first.")
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    setError(null)

    try {
      const response = await searchProducts({ 
        query: query.trim(), 
        merchantId: merchant.id,
        limit: 20 
      })
      setResults(response.responseObject.products)
      setBanners(response.responseObject.banners)
      setMeta(response.responseObject.meta)
    } catch (err) {
      console.error("Search failed:", err)
      setError(err instanceof Error ? err.message : "Search failed")
      setResults([])
      setBanners([])
      setMeta(null)
    } finally {
      setIsLoading(false)
    }
  }, [query, merchant])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setBanners([])
    setMeta(null)
    setHasSearched(false)
    setError(null)
  }

  // Show loading state while merchant is loading
  if (merchantLoading) {
    return (
      <div className={cn("w-full flex items-center justify-center py-8", className)}>
        <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
        <span className="ml-2 text-gray-500">Loading merchant...</span>
      </div>
    )
  }

  // Show error if no merchant
  if (!merchant) {
    return (
      <div className={cn("w-full", className)}>
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="font-medium text-amber-800">No Merchant Available</p>
          <p className="text-sm text-amber-600 mt-1">
            Please run the seed script to create a merchant and products.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Current Merchant Indicator */}
      <div className="mb-3 flex items-center justify-center gap-2 text-xs text-gray-500">
        <span>Searching in:</span>
        <span className="font-medium text-violet-600">{merchant.name}</span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products... try 'black t-shirt' or 'cotton shirt'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-12 pr-24 h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
          />
          <div className="absolute right-2 flex items-center gap-2">
            {query && (
              <button onClick={clearSearch} className="p-1.5 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
            <Button onClick={handleSearch} disabled={!query.trim() || isLoading} className="bg-violet-600 hover:bg-violet-700">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span className="ml-1">Search</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Search Meta */}
      {meta && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              Found <strong className="text-gray-900">{meta.totalResults}</strong> products
            </span>
            <span className="text-gray-300">|</span>
            <span>{meta.latencyMs}ms</span>
          </div>
          {meta.appliedRules.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs">Rules:</span>
              {meta.appliedRules.map((rule) => (
                <span key={rule} className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                  {rule}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Banners */}
      {banners.filter((b) => b.position === "top").map((banner, i) => (
        <div
          key={i}
          className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl"
        >
          <p className="text-amber-800 font-medium">{banner.text}</p>
          {banner.link && (
            <a href={banner.link} className="text-sm text-amber-600 hover:underline">
              Shop now →
            </a>
          )}
        </div>
      ))}

      {/* Results Grid */}
      {hasSearched && (
        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showScore
                  onClick={() => onProductClick?.(product)}
                />
              ))}
            </div>
          ) : !error && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found for "{query}"</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Banners */}
      {banners.filter((b) => b.position === "bottom").map((banner, i) => (
        <div
          key={i}
          className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl"
        >
          <p className="text-violet-800 font-medium">{banner.text}</p>
        </div>
      ))}
    </div>
  )
}

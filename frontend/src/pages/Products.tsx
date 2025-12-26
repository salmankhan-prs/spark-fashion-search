import { useState, useEffect, useCallback } from "react"
import { Search, Grid, List, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/ProductCard"
import { useMerchant } from "@/context/MerchantContext"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  title: string
  description: string | null
  category: string
  brand: string
  price: string
  originalPrice: string | null
  currency: string
  stock: number
  url: string | null
  image: string | null
  collections: string[] | null
  tags: string[] | null
}

const API_BASE = "http://localhost:8080/api/v1"

export function Products() {
  const { merchant, isLoading: merchantLoading } = useMerchant()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    if (!merchant) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/products?merchantId=${merchant.id}&limit=100`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`)
      }

      const data = await response.json()
      const productList = data.responseObject?.products || []
      setProducts(productList)

      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(productList.map((p: Product) => p.category).filter(Boolean))]
      setCategories(uniqueCategories as string[])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }, [merchant])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Show loading while merchant is loading
  if (merchantLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="ml-2 text-gray-500">Loading store...</span>
      </div>
    )
  }

  // Show error if no merchant
  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-12 h-12 text-amber-500" />
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">No Merchant Selected</h2>
          <p className="text-gray-500 mt-1">Please run the seed script to create a merchant.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">
            Showing products for <span className="font-medium text-amber-600">{merchant.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={fetchProducts}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-1", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600">
            + Add Product
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <p className="text-red-700">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchProducts}>
            Retry
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {categories.slice(0, 8).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg transition-colors",
                selectedCategory === category
                  ? "bg-amber-100 text-amber-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {category}
            </button>
          ))}
          {categories.length > 8 && (
            <span className="text-xs text-gray-400">+{categories.length - 8} more</span>
          )}
        </div>

        <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-1.5 rounded",
              viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"
            )}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-1.5 rounded",
              viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <p className="text-gray-500">No products found</p>
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="text-sm text-amber-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
            >
              <img
                src={product.image || "https://via.placeholder.com/80"}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                <p className="text-sm text-gray-500">{product.category} • {product.brand}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold">${product.price}</span>
                  <Badge variant={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "destructive"}>
                    {product.stock} in stock
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

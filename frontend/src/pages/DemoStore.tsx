import { useState, useCallback, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, ShoppingCart, User, Heart, X, Loader2, Zap, ArrowLeft, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/ProductCard"
import { searchProducts, type Product, type SearchBanner } from "@/lib/api"
import { useMerchant } from "@/context/MerchantContext"
import { Button } from "@/components/ui/button"

const API_BASE = import.meta.env.VITE_API_BASE;

export function DemoStore() {
  const { merchant, isLoading: merchantLoading } = useMerchant()
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<Product[]>([])
  const [banners, setBanners] = useState<SearchBanner[]>([])
  const [meta, setMeta] = useState<{ totalResults: number; latencyMs: number; appliedRules: string[] } | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Default products listing
  const [defaultProducts, setDefaultProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const productsPerPage = 12

  // Fetch default products for the store
  const fetchDefaultProducts = useCallback(async (page: number) => {
    if (!merchant) return

    setIsLoadingProducts(true)
    try {
      const offset = (page - 1) * productsPerPage
      const response = await fetch(
        `${API_BASE}/products?merchantId=${merchant.id}&limit=${productsPerPage}&offset=${offset}`
      )
      if (response.ok) {
        const data = await response.json()
        setDefaultProducts(data.responseObject?.products || [])
        setTotalProducts(data.responseObject?.pagination?.total || 0)
      }
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setIsLoadingProducts(false)
    }
  }, [merchant])

  useEffect(() => {
    fetchDefaultProducts(currentPage)
  }, [fetchDefaultProducts, currentPage])

  const handleSearch = useCallback(async () => {
    if (!query.trim() || !merchant) return

    setIsSearching(true)
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
      setIsSearching(false)
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

  const totalPages = Math.ceil(totalProducts / productsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-amber-500 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">
              DEMO: This is a sample store with Spark search widget embedded
            </span>
          </div>
          <Link 
            to="/dashboard" 
            className="flex items-center gap-1 text-sm font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Store Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {merchant?.name || "Sample Store"}
                </h1>
                <p className="text-xs text-gray-500">Powered by Spark Search</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <User className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6 py-3 border-t border-gray-100">
            {["All Products", "Men", "Women", "Accessories", "Sale"].map((cat) => (
              <button key={cat} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SPARK SEARCH WIDGET - Full Width */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="mb-8">
          {/* Widget Header */}
          <div className="bg-gray-900 text-white px-4 py-2 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">Spark Search Widget</span>
              <span className="text-xs text-gray-400 hidden sm:inline">— AI-powered product search</span>
            </div>
            <a 
              href="https://spark-search.demo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-white"
            >
              Learn more
            </a>
          </div>

          {/* Widget Body */}
          <div className="bg-white border-2 border-t-0 border-gray-900 rounded-b-xl p-6">
            {merchantLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              </div>
            ) : !merchant ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No merchant configured.</p>
              </div>
            ) : (
              <>
                {/* Search Input - Full Width */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products... try 'casual summer outfit' or 'running shoes'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query && (
                      <button onClick={clearSearch} className="p-2 text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={handleSearch}
                      disabled={!query.trim() || isSearching}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                      Search
                    </button>
                  </div>
                </div>

                {/* Quick Search Suggestions */}
                {!hasSearched && (
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-500">Try:</span>
                    {["black t-shirt", "summer dress", "running shoes", "formal shirt"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Search Results Section */}
                {hasSearched && (
                  <div className="mt-6">
                    {/* Meta Info */}
                    {meta && (
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            Found <strong className="text-gray-700">{meta.totalResults}</strong> products
                          </span>
                          <span className="text-gray-300">|</span>
                          <span>{meta.latencyMs}ms</span>
                        </div>
                        {meta.appliedRules.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Rules:</span>
                            {meta.appliedRules.map((rule) => (
                              <span key={rule} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                {rule}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Top Banners */}
                    {banners.filter((b) => b.position === "top").map((banner, i) => (
                      <div
                        key={i}
                        className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl"
                      >
                        <p className="text-amber-800 font-medium">{banner.text}</p>
                        {banner.link && (
                          <a href={banner.link} className="text-sm text-amber-600 hover:underline">
                            Shop now →
                          </a>
                        )}
                      </div>
                    ))}

                    {/* Error */}
                    {error && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-700">{error}</p>
                      </div>
                    )}

                    {/* Results Grid */}
                    {isSearching ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                      </div>
                    ) : results.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {results.map((product) => (
                          <ProductCard key={product.id} product={product} showScore />
                        ))}
                      </div>
                    ) : !error && (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No products found for "{query}"</p>
                      </div>
                    )}

                    {/* Bottom Banners */}
                    {banners.filter((b) => b.position === "bottom").map((banner, i) => (
                      <div
                        key={i}
                        className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
                      >
                        <p className="text-blue-800 font-medium">{banner.text}</p>
                      </div>
                    ))}

                    {/* Clear Search Button */}
                    <div className="mt-6 text-center">
                      <button
                        onClick={clearSearch}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Clear search and browse all products
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Widget Footer */}
          <div className="mt-2 flex items-center justify-end gap-2 text-xs text-gray-400">
            <Zap className="w-3 h-3" />
            <span>Powered by Spark</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* DEFAULT PRODUCT LISTING (when not searching) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {!hasSearched && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">All Products</h2>
              <p className="text-sm text-gray-500">{totalProducts.toLocaleString()} products</p>
            </div>

            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {defaultProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1 px-4">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Store Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-500">
            <p className="font-medium text-gray-700 mb-1">This is a demo storefront</p>
            <p>The search above is powered by Spark — AI Search for E-commerce</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

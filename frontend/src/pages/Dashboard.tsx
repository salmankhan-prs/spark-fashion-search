import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Search, TrendingUp, Zap, Loader2, AlertCircle, ExternalLink, Sparkles } from "lucide-react"
import { useMerchant } from "@/context/MerchantContext"

const API_BASE = "http://localhost:8080/api/v1"

interface DashboardStats {
  totalProducts: number
  activeRules: number
}

export function Dashboard() {
  const { merchant, isLoading: merchantLoading } = useMerchant()
  const [stats, setStats] = useState<DashboardStats>({ totalProducts: 0, activeRules: 0 })
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    if (!merchant) return
    setIsLoading(true)

    try {
      const [productsRes, rulesRes] = await Promise.all([
        fetch(`${API_BASE}/products?merchantId=${merchant.id}&limit=1`),
        fetch(`${API_BASE}/merchandising?merchantId=${merchant.id}`),
      ])

      let totalProducts = 0
      let activeRules = 0

      if (productsRes.ok) {
        const data = await productsRes.json()
        totalProducts = data.responseObject?.pagination?.total || 0
      }

      if (rulesRes.ok) {
        const data = await rulesRes.json()
        activeRules = data.responseObject?.activeCount || 0
      }

      setStats({ totalProducts, activeRules })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setIsLoading(false)
    }
  }, [merchant])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const statsConfig = [
    { name: "Total Products", value: stats.totalProducts.toLocaleString(), icon: ShoppingBag, color: "bg-blue-500" },
    { name: "Active Rules", value: stats.activeRules.toString(), icon: Sparkles, color: "bg-amber-500" },
  ]

  if (merchantLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-12 h-12 text-amber-500" />
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">No Store Available</h2>
          <p className="text-gray-500 mt-1">Please run the seed script to create a store.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview for <span className="font-medium text-amber-600">{merchant.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {statsConfig.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  {isLoading ? (
                    <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  )}
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/dashboard/products"
                className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <ShoppingBag className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">View Products</p>
                <p className="text-sm text-gray-500">Manage catalog</p>
              </Link>
              <Link 
                to="/dashboard/merchandising"
                className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <Sparkles className="w-6 h-6 text-amber-600 mb-2" />
                <p className="font-medium text-gray-900">Merchandising</p>
                <p className="text-sm text-gray-500">Configure rules</p>
              </Link>
              <Link 
                to="/store"
                className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <ExternalLink className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Preview Store</p>
                <p className="text-sm text-gray-500">See widget live</p>
              </Link>
              <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left opacity-50 cursor-not-allowed">
                <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-500">Coming soon</p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Set up your AI-powered search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Products Synced</p>
                  <p className="text-sm text-gray-600">{stats.totalProducts} products indexed</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Search Enabled</p>
                  <p className="text-sm text-gray-600">AI search is active</p>
                </div>
              </div>

              <div className={`flex items-start gap-3 p-3 rounded-lg border ${stats.activeRules > 0 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className={`w-6 h-6 ${stats.activeRules > 0 ? 'bg-green-500' : 'bg-amber-500'} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs">{stats.activeRules > 0 ? '✓' : '!'}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Merchandising Rules</p>
                  <p className="text-sm text-gray-600">{stats.activeRules} active rules</p>
                  {stats.activeRules === 0 && (
                    <Link to="/dashboard/merchandising" className="text-sm text-amber-600 hover:underline">
                      Configure rules →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

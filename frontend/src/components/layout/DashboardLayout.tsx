import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useMerchant } from "@/context/MerchantContext"
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Sparkles, 
  Settings, 
  ExternalLink,
  Loader2,
  RefreshCw,
  Zap
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/products", icon: ShoppingBag },
  { name: "Merchandising", href: "/dashboard/merchandising", icon: Sparkles },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()
  const { merchant, merchants, isLoading, error, setMerchant, refresh } = useMerchant()

  const handleMerchantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMerchant = merchants.find(m => m.id === e.target.value)
    if (selectedMerchant) {
      setMerchant(selectedMerchant)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Spark</span>
          </Link>
          
          {/* Merchant Indicator */}
          {merchant && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
              <span className="text-xs text-amber-700">Store:</span>
              <span className="text-sm font-medium text-amber-900">{merchant.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/store" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Preview Store
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed top-14 left-0 bottom-0 w-56 bg-white border-r border-gray-200">
        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-amber-50 text-amber-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-amber-600" : "text-gray-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section - Merchant Selector */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Switch Store
              </label>
              <button 
                onClick={refresh}
                className="p-1 text-gray-400 hover:text-amber-600 transition-colors"
                title="Refresh merchants"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : error ? (
              <div className="px-3 py-2 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600">{error}</p>
                <button 
                  onClick={refresh}
                  className="text-xs text-red-500 hover:underline mt-1"
                >
                  Retry
                </button>
              </div>
            ) : merchants.length > 0 ? (
              <select
                value={merchant?.id || ""}
                onChange={handleMerchantChange}
                className="w-full h-9 px-3 pr-8 text-sm bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-2 bg-amber-50 rounded-lg">
                <p className="text-xs font-medium text-amber-700">No Stores</p>
                <p className="text-xs text-amber-600 mt-0.5">Run seed script first</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="pt-14 pl-56">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

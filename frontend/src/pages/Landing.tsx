import { Link } from "react-router-dom"
import { Zap, Search, Sparkles, BarChart3, ArrowRight, Check } from "lucide-react"

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Spark</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/store" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              View Demo Store
            </Link>
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
            >
              Merchant Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-sm text-amber-700 mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered E-commerce Search
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Search that understands
            <span className="text-amber-500"> what shoppers mean</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Transform your product search with semantic AI. Customers type naturally, 
            find exactly what they want, and convert more.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors shadow-lg shadow-amber-500/25"
            >
              Try Merchant Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/store" 
              className="flex items-center gap-2 px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              See Demo Store
            </Link>
          </div>
        </div>

        {/* Demo Preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-gray-400">spark-demo.store/search</span>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3 bg-gray-700 rounded-lg px-4 py-3 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">casual outfit for a summer beach party</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-700 rounded-lg aspect-[3/4] animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How Spark Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Semantic Search</h3>
              <p className="text-gray-600">
                Understands natural language queries like "warm jacket for skiing" 
                instead of just matching keywords.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Merchandising Rules</h3>
              <p className="text-gray-600">
                Boost, bury, or pin products. Show promotional banners. 
                Full control over what customers see.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Integration</h3>
              <p className="text-gray-600">
                Drop-in widget for any e-commerce platform. 
                Works with Shopify, custom stores, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How This Demo Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📋 How This Demo Works
            </h2>
            <p className="text-gray-700 mb-6">
              This is a working prototype demonstrating Spark's capabilities. 
              Explore both parts:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-amber-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Merchant Dashboard
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    View product catalog (synced from sample data)
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Create merchandising rules (BOOST, BURY, PIN, BANNER)
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Preview how rules affect search results
                  </li>
                </ul>
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                  Open Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl border border-amber-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Demo Store
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Sample e-commerce storefront
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Spark search widget embedded
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    See AI search + merchandising rules in action
                  </li>
                </ul>
                <Link 
                  to="/store" 
                  className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                  Open Demo Store <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>Spark — AI-Powered Search for E-commerce</p>
          <p className="mt-1">A demonstration project showcasing semantic search capabilities</p>
        </div>
      </footer>
    </div>
  )
}



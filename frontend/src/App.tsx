import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MerchantProvider } from "@/context/MerchantContext"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Landing } from "@/pages/Landing"
import { Dashboard } from "@/pages/Dashboard"
import { Products } from "@/pages/Products"
import { Merchandising } from "@/pages/Merchandising"
import { DemoStore } from "@/pages/DemoStore"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MerchantProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing page - no layout */}
            <Route path="/" element={<Landing />} />

            {/* Dashboard routes with layout */}
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/products"
              element={
                <DashboardLayout>
                  <Products />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/merchandising"
              element={
                <DashboardLayout>
                  <Merchandising />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <DashboardLayout>
                  <div className="text-center py-12 text-gray-500">
                    Settings page coming soon...
                  </div>
                </DashboardLayout>
              }
            />

            {/* Demo store - full page, no dashboard layout */}
            <Route path="/store" element={<DemoStore />} />
          </Routes>
        </BrowserRouter>
      </MerchantProvider>
    </QueryClientProvider>
  )
}

export default App

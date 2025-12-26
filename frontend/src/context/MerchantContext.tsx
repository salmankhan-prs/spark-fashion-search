import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { fetchMerchants, type Merchant } from "@/lib/api"

const STORAGE_KEY = "spark_selected_merchant_id"
// Hardcoded Flipkart Fashion ID for demo purposes
const DEFAULT_MERCHANT_ID = "55323090-c2b7-49ad-b940-24baeede0d8c"

interface MerchantContextType {
  merchant: Merchant | null
  merchants: Merchant[]
  isLoading: boolean
  error: string | null
  setMerchant: (merchant: Merchant) => void
  refresh: () => Promise<void>
}

const MerchantContext = createContext<MerchantContextType | null>(null)

export function MerchantProvider({ children }: { children: ReactNode }) {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [merchant, setMerchantState] = useState<Merchant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Persist merchant selection
  const setMerchant = useCallback((newMerchant: Merchant) => {
    setMerchantState(newMerchant)
    localStorage.setItem(STORAGE_KEY, newMerchant.id)
  }, [])

  const loadMerchants = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await fetchMerchants()
      setMerchants(data)
      
      // Priority order for selecting default merchant:
      // 1. Previously saved merchant from localStorage
      // 2. Flipkart Fashion (hardcoded ID for demo)
      // 3. First active merchant
      // 4. First merchant in list
      
      const savedMerchantId = localStorage.getItem(STORAGE_KEY)
      const savedMerchant = savedMerchantId ? data.find(m => m.id === savedMerchantId) : null
      const flipkartMerchant = data.find(m => m.id === DEFAULT_MERCHANT_ID)
      const activeMerchant = data.find(m => m.status === "ACTIVE")
      
      const selectedMerchant = savedMerchant || flipkartMerchant || activeMerchant || data[0]
      
      if (selectedMerchant) {
        setMerchantState(selectedMerchant)
        localStorage.setItem(STORAGE_KEY, selectedMerchant.id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load merchants")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMerchants()
  }, [loadMerchants])

  return (
    <MerchantContext.Provider
      value={{
        merchant,
        merchants,
        isLoading,
        error,
        setMerchant,
        refresh: loadMerchants,
      }}
    >
      {children}
    </MerchantContext.Provider>
  )
}

export function useMerchant() {
  const context = useContext(MerchantContext)
  if (!context) {
    throw new Error("useMerchant must be used within a MerchantProvider")
  }
  return context
}

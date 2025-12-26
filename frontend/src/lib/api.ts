const API_BASE = import.meta.env.VITE_API_BASE;


export interface Merchant {
  id: string
  name: string
  slug: string
  email: string
  status: string
}

export interface Product {
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
  score?: number
}

export interface SearchBanner {
  text: string
  link?: string
  position: "top" | "bottom"
}

export interface SearchResponse {
  success: boolean
  message: string
  responseObject: {
    success: boolean
    meta: {
      query: string
      totalResults: number
      latencyMs: number
      appliedRules: string[]
    }
    banners: SearchBanner[]
    products: Product[]
  }
}

export interface SearchParams {
  query: string
  merchantId: string  // Now required - must be passed from context
  limit?: number
  filters?: {
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
  }
}


/**
 * Fetch all merchants from the API
 */
export async function fetchMerchants(): Promise<Merchant[]> {
  const response = await fetch(`${API_BASE}/merchants`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch merchants: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.responseObject.merchants
}


export async function searchProducts(params: SearchParams): Promise<SearchResponse> {
  if (!params.merchantId) {
    throw new Error("Merchant ID is required for search")
  }
  
  const response = await fetch(`${API_BASE}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: params.query,
      merchantId: params.merchantId,
      limit: params.limit || 20,
      filters: params.filters,
    }),
  })

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`)
  }

  return response.json()
}

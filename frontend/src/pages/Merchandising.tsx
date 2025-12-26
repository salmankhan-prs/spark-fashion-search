import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useMerchant } from "@/context/MerchantContext"
import { 
  Sparkles, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Pin, 
  Filter, 
  MessageSquare,
  Loader2,
  AlertCircle,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

const API_BASE = import.meta.env.VITE_API_BASE;

interface MerchandisingRule {
  id: string
  name: string
  type: "BOOST" | "BURY" | "PIN" | "FILTER" | "BANNER"
  conditions: Record<string, any>
  actions: Record<string, any>
  priority: number | null
  isActive: boolean
}

const ruleTypeConfig = {
  BOOST: { icon: TrendingUp, color: "text-green-600", bg: "bg-green-50", border: "border-green-200", label: "Boost" },
  BURY: { icon: TrendingDown, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Bury" },
  PIN: { icon: Pin, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Pin" },
  FILTER: { icon: Filter, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", label: "Filter" },
  BANNER: { icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Banner" },
}

type RuleType = keyof typeof ruleTypeConfig

export function Merchandising() {
  const { merchant, isLoading: merchantLoading } = useMerchant()
  const [rules, setRules] = useState<MerchandisingRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedType, setSelectedType] = useState<RuleType>("BOOST")
  
  const [formQuery, setFormQuery] = useState("")
  const [formValue, setFormValue] = useState("")
  const [formWeight, setFormWeight] = useState("1.5")
  const [formPosition, setFormPosition] = useState("1")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchRules = useCallback(async () => {
    if (!merchant) return
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE}/merchandising?merchantId=${merchant.id}`)
      if (response.ok) {
        const data = await response.json()
        setRules(data.responseObject?.rules || [])
      }
    } catch (err) {
      console.error("Failed to fetch rules:", err)
    } finally {
      setIsLoading(false)
    }
  }, [merchant])

  useEffect(() => {
    fetchRules()
  }, [fetchRules])

  const handleCreateRule = async () => {
    if (!merchant || !formQuery.trim()) return
    setIsSubmitting(true)

    const newRule: MerchandisingRule = {
      id: `rule-${Date.now()}`,
      name: `${selectedType} for "${formQuery}"`,
      type: selectedType,
      conditions: selectedType === "BANNER" 
        ? { queryContains: [formQuery] }
        : { collection: formValue || formQuery },
      actions: selectedType === "BANNER"
        ? { banner: { text: formValue, position: "top" } }
        : { boostFactor: parseFloat(formWeight), position: parseInt(formPosition) },
      priority: 50,
      isActive: true,
    }

    setRules([...rules, newRule])
    setShowCreateForm(false)
    setFormQuery("")
    setFormValue("")
    setFormWeight("1.5")
    setFormPosition("1")
    setIsSubmitting(false)
  }

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

  const getRuleDescription = (rule: MerchandisingRule) => {
    switch (rule.type) {
      case "BOOST":
        return `Boost ${rule.conditions.collection || "products"} by ${rule.actions.boostFactor}x`
      case "BURY":
        return `Bury ${rule.conditions.collection || "products"} by ${rule.actions.boostFactor}x`
      case "PIN":
        return `Pin product at position ${rule.actions.position}`
      case "FILTER":
        return `Filter out ${rule.conditions.collection || "products"}`
      case "BANNER":
        return rule.actions.banner?.text || "Show banner"
      default:
        return ""
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merchandising Rules</h1>
          <p className="text-gray-500 mt-1">Control how products appear in search results</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {(Object.keys(ruleTypeConfig) as RuleType[]).map((type) => {
          const config = ruleTypeConfig[type]
          return (
            <div key={type} className={cn("p-4 rounded-xl border", config.bg, config.border)}>
              <config.icon className={cn("w-5 h-5 mb-2", config.color)} />
              <p className="font-medium text-gray-900 text-sm">{config.label}</p>
              <p className="text-xs text-gray-600 mt-1">
                {type === "BOOST" && "Promote products higher"}
                {type === "BURY" && "Push products lower"}
                {type === "PIN" && "Fix at position"}
                {type === "FILTER" && "Hide from results"}
                {type === "BANNER" && "Show message"}
              </p>
            </div>
          )
        })}
      </div>

      {showCreateForm && (
        <Card className="mb-8 border-2 border-amber-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Create New Rule</CardTitle>
              <CardDescription>Define how products should appear for specific searches</CardDescription>
            </div>
            <button onClick={() => setShowCreateForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rule Type</label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(ruleTypeConfig) as RuleType[]).map((type) => {
                    const config = ruleTypeConfig[type]
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                          selectedType === type
                            ? cn(config.bg, config.border, config.color)
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <config.icon className="w-4 h-4" />
                        {config.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedType === "BANNER" ? "Query Trigger" : "Target Collection/Category"}
                </label>
                <Input
                  placeholder={selectedType === "BANNER" ? "e.g., summer, sale" : "e.g., new-arrivals, sale"}
                  value={formQuery}
                  onChange={(e) => setFormQuery(e.target.value)}
                />
              </div>

              {selectedType === "BANNER" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Message</label>
                  <Input
                    placeholder="e.g., 🎉 Big Sale! 20% off"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                  />
                </div>
              )}

              {(selectedType === "BOOST" || selectedType === "BURY") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight ({selectedType === "BOOST" ? ">1 to boost" : "<1 to bury"})
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                <Button 
                  onClick={handleCreateRule}
                  disabled={!formQuery.trim() || isSubmitting}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Create Rule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Active Rules
          </CardTitle>
          <CardDescription>{rules.filter(r => r.isActive).length} active rules</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No merchandising rules yet</p>
              <p className="text-sm text-gray-400 mt-1">Create your first rule to control search results</p>
              <Button onClick={() => setShowCreateForm(true)} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Rule
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => {
                const config = ruleTypeConfig[rule.type] || ruleTypeConfig.BOOST
                return (
                  <div 
                    key={rule.id}
                    className={cn("flex items-center justify-between p-4 rounded-xl border", config.bg, config.border)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2 rounded-lg bg-white", config.border)}>
                        <config.icon className={cn("w-5 h-5", config.color)} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn(config.color, config.border)}>
                            {config.label}
                          </Badge>
                          <span className="font-medium text-gray-900">{rule.name}</span>
                          {!rule.isActive && (
                            <Badge variant="outline" className="text-gray-400">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{getRuleDescription(rule)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
